# MCPServerStreamableHttp + Cloudflare Durable Objects Issue Reproduction

This is a minimal reproduction of an issue where `MCPServerStreamableHttp.connect` method is missing when running in Cloudflare Workers/Durable Objects environment.

## The Issue

When using `@openai/agents` with `MCPServerStreamableHttp` in a Cloudflare Durable Object, the `connect` method is not available on the MCPServerStreamableHttp instance, suggesting a browser shim is being used instead of the proper implementation.

## Error Message

```
MCPServerStreamableHttp.connect is missing (browser shim). This is the reproduction of the error.
```

## Environment Details

The code logs several environment checks showing:

- `process` is undefined (expected in Workers)
- `WebSocket` is available
- `fetch` is available
- But `MCPServerStreamableHttp.connect` is missing

## Setup Instructions

1. Install dependencies:

```bash
npm install
# or
pnpm install
```

2. Run the development server:

```bash
npm run dev
# or
pnpm dev
```

3. In another terminal, trigger the error:

```bash
npm run test
# or
curl -X POST http://localhost:8787/test
```

## Expected Behavior

The MCPServerStreamableHttp instance should have a `connect` method that allows establishing a connection to the MCP server.

## Actual Behavior

The `connect` method is missing from the MCPServerStreamableHttp instance, causing the agent to fail initialization.

## Files

- `src/index.ts` - Cloudflare Worker entry point with Durable Object
- `src/agent.ts` - Agent code that attempts to use MCPServerStreamableHttp
- `wrangler.toml` - Cloudflare Workers configuration

## Dependencies

- `@openai/agents`: latest
- Running in Cloudflare Workers/Durable Objects environment
