import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { intentCompiler } from "../compiler/intentCompiler";
import { analyticsEngine } from "../infra/logging/analyticsEngine";
import { ASSET_REGISTRY } from "../data/assetRegistry";
import { RobloxAdapter } from "../adapters/robloxAdapter";

const robloxAdapter = new RobloxAdapter();

/**
 * EZ Studios MCP Server
 * Exposes core procedural and analytics tools for AI assistants.
 */

const server = new Server(
    {
        name: "ez-studios-server",
        version: "2.3.1",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

/**
 * List available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "compile_intent",
                description: "Compila um prompt de linguagem natural em uma intenção procedural e código Luau para Roblox/Unity.",
                inputSchema: {
                    type: "object",
                    properties: {
                        prompt: {
                            type: "string",
                            description: "O prompt descrevendo o item, ator ou mapa a ser gerado (ex: 'espada de fogo', 'npc guarda').",
                        },
                    },
                    required: ["prompt"],
                },
            },
            {
                name: "get_engine_metrics",
                description: "Retorna métricas de performance, XP e saúde financeira do EZ Studios.",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
            {
                name: "query_registry",
                description: "Busca assets e comportamentos no registro poliglota do EZ Studios.",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: {
                            type: "string",
                            description: "Palavra-chave para busca (ex: 'sword', 'fire', 'npc').",
                        },
                    },
                },
            },
        ],
    };
});

/**
 * Handle tool calls
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        switch (name) {
            case "compile_intent": {
                const prompt = String(args?.prompt);
                // Usamos o robloxAdapter padrão e uma lista de tiles vazia
                const result = await intentCompiler.compilarComPrompt(prompt, [], robloxAdapter);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            }

            case "get_engine_metrics": {
                const metrics = analyticsEngine.getMetrics();
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(metrics, null, 2),
                        },
                    ],
                };
            }

            case "query_registry": {
                const query = String(args?.query || "").toLowerCase();
                const filtered = ASSET_REGISTRY.filter(asset =>
                    asset.id.toLowerCase().includes(query) ||
                    asset.tags.some(t => t.toLowerCase().includes(query))
                );
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(filtered, null, 2),
                        },
                    ],
                };
            }

            default:
                throw new Error(`Tool unknown: ${name}`);
        }
    } catch (error: any) {
        return {
            isError: true,
            content: [
                {
                    type: "text",
                    text: `Error executing tool ${name}: ${error.message}`,
                },
            ],
        };
    }
});

/**
 * Start the server using stdio transport
 */
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("EZ Studios MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Server failure:", error);
    process.exit(1);
});
