<div align=center>
<img src="./web/public/favicon.svg" width=50 />

# text-server

A self-hosted, web-based document editor with rich text editing and file management capabilities, packaged as a single executable.

</div>

## Overview

Like [code-server](https://github.com/coder/code-server) but delivering a WYSIWYG editor and file explorer only.

Why? I needed a local-first document editing tool in a single executable to allow me create, edit and manage my documents on the go. Basically privacy-focused by self hosting the tool or using it locally on a local area network.

## Features

- **WYSIWYG Editor**: Rich text editing with [Lake.js](https://lakejs.org)
- **File Explorer**: Tree view for easy navigation and file management
- **Cross-Platform**: Available for Windows, macOS, and Linux
- **Single Binary**: Simple installation with no dependencies
- **Self-Hosted**: Run entirely on your own machine

## Usage

### Starting the Server

Make sure that you have a `.env` file with `PASSWORD=xxxxxxx` in current directory before starting the server.

```bash
# Start with default settings
text-server

# Specify a custom port
text-server --port 8080

# Specify a custom root directory
text-server --root ~/Documents

# Specify host/IP
text-server --host 0.0.0.0
```

Once started, open your browser and navigate to `http://localhost:8080` (or your custom port).

### Command Line Options

| Flag     | Default           | Description                        |
| -------- | ----------------- | ---------------------------------- |
| `--host` | localhost         | Host to bind the server to         |
| `--port` | 4321              | Port to run the server on          |
| `--root` | Current directory | Root directory for file operations |

## Installation

<!-- ### Download Binary

Download the latest release for your platform from the [Releases page](https://github.com/henryhale/text-server/releases). -->

### Building from Source

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
- [Goreleaser](https://goreleaser.com/) for simplified releases

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE.txt) file for details.

&copy; 2025-present [Henry Hale](https://github.com/henryhale)
