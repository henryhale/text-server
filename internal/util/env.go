package util

import (
	"log"

	"github.com/joho/godotenv"
)

// load the .env file.
func LoadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("error: failed to load .env file. ", err)
	}
}
