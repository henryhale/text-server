# project settings
APP_NAME := ./bin/text-server
SRC := ./text-server.go

# bundle front end
frontend:
	cd web && pnpm build

# build project 
build: frontend
	go build -o $(APP_NAME) $(SRC)

# execute binary
run: build
	$(APP_NAME) --host 0.0.0.0

# clean the build output
clean:
	rm -f ./bin ./dist

.PHONY: build run clean
 