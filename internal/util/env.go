package util

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// load the password from .env file or environment variable - PASSWORD.
func LoadEnv() {
	if len(os.Getenv("PASSWORD")) > 0 {
		log.Println("Password set using $PASSWORD environment variable")
		return
	}

	// try the .env file
	err := godotenv.Load()
	if err == nil && len(os.Getenv("PASSWORD")) > 0 {
		log.Println("Password set using .env file")
		return
	}

	log.Fatal("error: $PASSWORD is not set - use environment variable or .env file.", err)
}
