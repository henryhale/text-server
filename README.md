<div align=center>
<img src="./web/public/favicon.svg" width=75 />

# text-server

A self-hosted, web-based document editor with rich text editing and file management capabilities, packaged as a single executable.

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/henryhale/text-server/release.yml)
![GitHub Release](https://img.shields.io/github/v/release/henryhale/text-server)
![GitHub License](https://img.shields.io/github/license/henryhale/text-server)

![Screen Shot](https://github.com/user-attachments/assets/3b17dbff-d7cd-42c4-b5aa-18653fe84286)

</div>

## Overview

Like [code-server](https://github.com/coder/code-server) but delivering a WYSIWYG editor and file explorer only.

Why? I needed a local-first document editing tool in a single executable to allow me create, edit and manage my documents on the go. Basically privacy-focused by self hosting the tool or using it locally on a local area network.

> :warning: work in progress

## Live Demo

You can explore the project in action via the live demo link below:

:rocket: [Live Demo](https://henryhale.github.io/text-server/)

This demo showcases the core features and user interface of the application in real time. Use it to test functionality, review performance, or evaluate usability before intergating or contributing.

## Features

- **WYSIWYG Editor**: Rich text editing with [Lake.js](https://lakejs.org)
- **File Explorer**: Tree view for easy navigation and file management
- **Cross-Platform**: Available for Windows, macOS, and Linux
- **Single Binary**: Simple installation with no dependencies
- **Self-Hosted**: Run entirely on your own machine

## Usage

### Command Line Options

| Flag     | Default           | Description                        |
| -------- | ----------------- | ---------------------------------- |
| `--host` | 127.0.0.1         | Host to bind the server to         |
| `--port` | 4321              | Port to run the server on          |
| `--root` | Current directory | Root directory for file operations |

### Starting the Server

Before starting the server, a password is required for user access control.

**Setting the password**:

1. With `.env` file

   ```txt
   PASSWORD=your_password
   ```

   Then run the server with cli options

2. Environment variable
   ```sh
   $ PASSWORD=your_password text-server
   ```

**Configuring the server**:

```bash
# start with default settings
text-server

# specify a custom port
text-server --port 8080

# specify a custom root directory
text-server --root ~/docs

# specify host/IP
text-server --host 0.0.0.0

# full example
text-server --host 0.0.0.0 --port 8080 --root ~/docs

# with PASSWORD variable
PASSWORD=your_password text-server --host 0.0.0.0 --port 8080 --root ~/docs
```

Once started, open your browser and navigate to `http://localhost:8080` (or your custom hostname and port).

## Installation

### Download Binary

Download the latest release for your platform from the [Releases page](https://github.com/henryhale/text-server/releases).

### Building from Source

**Prerequisites:**

- Go 1.24+
- Node.js v22+ and pnpm V10+

```bash
# clone repository
git clone https://github.com/henryhale/text-server.git

cd text-editor

# build the binary
make build

# the binary will be available in ./bin/text-server
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgements

- [Lake.js](https://lakejs.org/) for the WYSIWYG editor
- [Vue.js](https://vuejs.org/), [Reka UI](https://reka-ui.com) and [Lucide Icons](https://lucide.dev) for the frontend
- [Go](https://golang.org/) and [Gin](https://gin-gonic.com) for the backend
<!-- - [Goreleaser](https://goreleaser.com/) for simplified releases -->

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE.txt) file for details.

&copy; 2025-present [Henry Hale](https://github.com/henryhale)
