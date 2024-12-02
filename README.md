# local-command-server MCP Server

This is a TypeScript-based MCP server that executes commands and returns structured outputs. 

## Features

### Tools

- `execute_command` - Execute a command and return structured output
  - Takes a `command` as a required parameter
  - Returns structured output from the command

## Development

Install dependencies:
```bash
npm install
```

Build the server:
```bash
npm run build
```

For development with auto-rebuild:
```bash
npm run watch
```

## Installation

To use with Claude Desktop, add the server config:

On MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "local-command-server": {
      "command": "/path/to/mcp-local-command-server/build/index.js"
    }
  }
}
```

### Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), which is available as a package script:

```bash
npm run inspector
```

The Inspector will provide a URL to access debugging tools in your browser.

## License

MIT

## Author

- [@kentaro](https://github.com/kentaro)
