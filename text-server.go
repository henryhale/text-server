package main

import (
	"embed"
	"log"

	"github.com/henryhale/text-server/cmd"
	"github.com/henryhale/text-server/internal/server"
	"github.com/henryhale/text-server/internal/util"
)

//go:embed static/*
var staticFiles embed.FS

func main() {
	// init: logger
	log.SetFlags(log.Ltime)
	// log.SetPrefix("[" + cmd.CommandName + "] ")

	// init: cli
	config := cmd.Init()

	// load env variables
	util.LoadEnv()

	// init: server
	serve := server.Init(server.Options{
		StaticFiles: &staticFiles,
		Host:        config.Host,
		Port:        config.Port,
		Workspace:   &config.Workspace,
	})

	serve()
}
