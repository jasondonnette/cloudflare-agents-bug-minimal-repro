# MCP Workers Bug

Minimal reproduction of MCP server error in Cloudflare Workers.

## Setup

```bash
pnpm i
pnpm dev
curl -X POST http://localhost:${PORT}/agents/test-agent/instance
```

## Error

```
Error: Method not implemented.
  at MCPServerStreamableHttp.listTools
  (file:///node_modules/@openai/agents-core/src/shims/mcp-server/browser.ts:53:11)
```

MCP server's `listTools` not implemented in Workers environment.

**Environment:** macOS 15.6
