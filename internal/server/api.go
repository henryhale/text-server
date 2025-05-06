package server

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/henryhale/text-server/internal/fs"
)

// list directory contents - one level.
func treeHandler(workspace string) func(*gin.Context) {
	return func(c *gin.Context) {
		contents, err := fs.GetWorkspaceTree(workspace)
		if err != nil {
			log.Printf("error: %s", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get directory contents"})
		} else {
			c.JSON(http.StatusOK, gin.H{"content": contents})
		}
	}
}

// read a file.
func readHandler(workspace string) func(*gin.Context) {
	return func(c *gin.Context) {
		filePath := c.PostForm("path")

		content, err := fs.ReadWorkspaceFile(workspace, filePath)
		if err != nil {
			log.Printf("error: %s", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to read file"})
		} else {
			c.JSON(http.StatusOK, gin.H{"content": content})
		}
	}
}

// write a file.
func writeHandler(workspace string) func(*gin.Context) {
	return func(c *gin.Context) {
		filePath := c.PostForm("path")
		content := c.PostForm("content")

		err := fs.WriteWorkspaceFile(workspace, filePath, content)
		if err != nil {
			log.Printf("error: %s", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to write file"})
		} else {
			c.JSON(http.StatusOK, gin.H{})
		}
	}
}

// rename a file.
func renameHandler(workspace string) func(*gin.Context) {
	return func(c *gin.Context) {
		oldPath := c.PostForm("oldpath")
		newName := c.PostForm("newname")

		err := fs.RenameWorkspaceFile(workspace, oldPath, newName)
		if err != nil {
			log.Printf("error: %s", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to rename file"})
		} else {
			c.JSON(http.StatusOK, gin.H{})
		}
	}
}

// create a file.
func createHandler(workspace string) func(*gin.Context) {
	return func(c *gin.Context) {
		filePath := c.PostForm("path")

		err := fs.CreateWorkspaceFile(workspace, filePath)
		if err != nil {
			log.Printf("error: %s", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create file"})
		} else {
			c.JSON(http.StatusOK, gin.H{})
		}
	}
}
