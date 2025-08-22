import { Agent, routeAgentRequest } from "agents";
import type { ExportedHandler } from "@cloudflare/workers-types";
import {
  Agent as OpenAIAgent,
  MCPServerStreamableHttp,
  run,
} from "@openai/agents";

export interface Env {
  OPENAI_API_KEY: string;
}

export class AgentDurableObject extends Agent<Env> {
  async onRequest(request: Request): Promise<Response> {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const mcpServer = new MCPServerStreamableHttp({
      url: "http://localhost:3000/mcp",
      name: "test-mcp-server",
    });

    const agent = new OpenAIAgent({
      name: "Test Agent",
      mcpServers: [mcpServer],
    });

    const result = await run(agent, "Test the MCP connection");

    return Response.json({ result });
  }
}

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext) {
    return (
      (await routeAgentRequest(request, env)) ||
      new Response("Not found", { status: 404 })
    );
  },
} satisfies ExportedHandler<Env>;
