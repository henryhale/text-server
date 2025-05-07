package cmd

import (
	"flag"
	"fmt"
	"log"
	"os"
	"path/filepath"
)

type Config struct {
	Dev       *bool
	Host      *string
	Port      *string
	Workspace string
}

const CommandName = "text-server"

// from build bindings.
var (
	Version = "v0.0.0"
)

func Init() Config {
	config := Config{}

	showHelp := flag.Bool("help", false, "Display usage information")
	showVersion := flag.Bool("version", false, "Display the version details")

	config.Host = flag.String("host", "127.0.0.1", "Set the hostname for the server")
	config.Port = flag.String("port", "4321", "Set the port from which the server accepts connections")

	rootPath := flag.String("root", ".", "Set the directory to serve")

	flag.Parse()

	// help
	if *showHelp {
		fmt.Printf("Usage of %s:\n", os.Args[0])
		flag.PrintDefaults()
		os.Exit(0)
	}

	// version
	if *showVersion {
		fmt.Printf("%s %s\n", CommandName, Version)
		os.Exit(0)
	}

	// full path
	fp, err := filepath.Abs(*rootPath)
	if err != nil {
		log.Fatal(err)
	}

	fp = filepath.Clean(fp)

	info, err := os.Stat(fp)
	if err != nil {
		log.Fatal(err)
	}

	if info.IsDir() {
		config.Workspace = fp
	} else {
		config.Workspace = filepath.Dir(fp)
	}

	return config
}
