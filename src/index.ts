import { Agent, MCPServerStreamableHttp, run } from "@openai/agents";
import { DurableObject } from "cloudflare:workers";

export interface Env {
  AGENT_DO: DurableObjectNamespace;
}

export class AgentDurableObject extends DurableObject {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const mcpServer = new MCPServerStreamableHttp({
      url: "http://localhost:3000/mcp",
      name: "test-mcp-server",
    });

    const agent = new Agent({
      name: "Test Agent",
      mcpServers: [mcpServer],
    });

    const result = await run(agent, "Test the MCP connection");
    console.log("[Agent] Agent completed:", result.finalOutput);

    return Response.json({ success: true });
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/test" && request.method === "POST") {
      const id = env.AGENT_DO.idFromName("test-agent");
      const obj = env.AGENT_DO.get(id);
      return obj.fetch(request);
    }

    return new Response("Not found", { status: 404 });
  },
};
