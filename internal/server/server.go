package server

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"

	"github.com/henryhale/text-server/cmd"
)

// check if user is logged in via session.
func isLoggedIn(c *gin.Context) bool {
	session := sessions.Default(c)

	return session.Get("authenticated") == true
}

// verify password when login form is submitted.
func loginHandler(c *gin.Context) {
	if isLoggedIn(c) {
		c.Redirect(http.StatusFound, "/app/")
		c.Abort()

		return
	}

	// get password from submitted form
	password := strings.TrimSpace(c.DefaultPostForm("password", ""))
	expected := os.Getenv("PASSWORD")

	if len(password) > 0 && password == expected {
		session := sessions.Default(c)
		session.Set("authenticated", true)

		if err := session.Save(); err != nil {
			log.Printf("error: %s", err)
		}

		// redirect to app
		c.Redirect(http.StatusFound, "/app/")

		return
	}

	c.Redirect(http.StatusFound, "/")
}

func defaultRouteHandler(staticFiles *fs.FS) func(*gin.Context) {
	return func(c *gin.Context) {
		// logout on /?logout
		if c.Request.URL.Path == "/" && c.Query("logout") != "" {
			session := sessions.Default(c)
			session.Clear()
			session.Save()

			c.Redirect(http.StatusFound, "/")
			c.Abort()

			return
		}

		// require authorization
		if strings.Contains(c.Request.URL.Path, "/app/") && !isLoggedIn(c) {
			c.Redirect(http.StatusFound, "/")
			c.Abort()

			return
		}

		// redirect logged user or active session
		if c.Request.URL.Path == "/" && isLoggedIn(c) {
			c.Redirect(http.StatusFound, "/app/")
			c.Abort()

			return
		}

		c.FileFromFS(c.Request.URL.Path, http.FS(*staticFiles))
	}
}

type Options struct {
	StaticFiles *embed.FS
	Host        *string
	Port        *string
	Workspace   *string
}

// initialize gin router.
func Init(s Options) func() {
	// use release mode
	gin.SetMode(gin.ReleaseMode)

	// server: init
	router := gin.New()
	router.SetTrustedProxies(nil)
	router.Use(gin.Logger())

	hp := *s.Host + ":" + *s.Port

	// add cors
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://" + hp},
		AllowMethods:     []string{"GET", "POST"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           3600,
	}))

	// session store
	store := cookie.NewStore([]byte("secret"))
	store.Options(sessions.Options{
		Path:     "/",
		MaxAge:   3600, // 1hr
		HttpOnly: false,
	})
	router.Use(sessions.Sessions(cmd.CommandName+"-session", store))

	// login form
	router.POST("/", loginHandler)

	// create sub file system for static files from embed
	fsys, err := fs.Sub(*s.StaticFiles, "static")
	if err != nil {
		log.Fatal(err)
	}

	// general route access handler
	router.GET("/*filepath", defaultRouteHandler(&fsys))

	// rest api for file management
	{
		api := router.Group("/api/file", func(c *gin.Context) {
			// require auth
			if !isLoggedIn(c) {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
				c.Abort()

				return
			}

			c.Next()
		})

		api.POST("/tree", treeHandler(*s.Workspace))
		api.POST("/load", readHandler(*s.Workspace))
		api.POST("/save", writeHandler(*s.Workspace))
		api.POST("/rename", renameHandler(*s.Workspace))
		api.POST("/create", createHandler(*s.Workspace))
	}

	return func() {
		log.Printf("Listening on %s", hp)

		err := router.Run(hp)
		if err != nil {
			log.Fatal(err)
		}
	}
}
