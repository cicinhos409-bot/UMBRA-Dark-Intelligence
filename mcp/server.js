import readline from "node:readline";

const apiBaseUrl = (process.env.UMBRA_API_URL || "https://umbra-dark-intelligence.vercel.app").replace(/\/+$/, "");
const apiKey = process.env.UMBRA_API_KEY;
const protocolVersion = "2024-11-05";

const tools = [
  {
    name: "list_micro_audiences",
    description: "Search and list UMBRA micro-audiences in a selected interface language.",
    inputSchema: {
      type: "object",
      properties: {
        q: { type: "string", description: "Optional search text." },
        country: { type: "string", description: "Optional country in the source catalog." },
        language: { type: "string", description: "Optional audience content language." },
        locale: { type: "string", description: "pt-BR, en, es, fr, de, ja, ru, or ko." },
        limit: { type: "integer", minimum: 1, maximum: 322 },
      },
    },
  },
  {
    name: "search_youtube",
    description: "Search YouTube videos through the UMBRA server-side YouTube API.",
    inputSchema: {
      type: "object",
      required: ["q"],
      properties: {
        q: { type: "string" },
        country: { type: "string", description: "Country name or ISO country code." },
        order: { type: "string", enum: ["date", "viewCount", "relevance"] },
        days: { type: "integer", minimum: 1, maximum: 1825 },
        maxResults: { type: "integer", minimum: 1, maximum: 50 },
        videoType: { type: "string", enum: ["all", "shorts", "long"] },
      },
    },
  },
  {
    name: "generate_titles",
    description: "Generate editorial title and summary concepts for a UMBRA micro-audience.",
    inputSchema: {
      type: "object",
      required: ["audienceId", "format"],
      properties: {
        audienceId: { type: "string" },
        format: { type: "string", enum: ["Documentário narrado", "Storytelling", "Avatar / apresentador", "Animação explicativa", "Lista / ranking", "História real", "Nostalgia", "Comparativo", "Tutorial contextual", "Mini-documentário", "Estudo de caso", "Linha do tempo", "Mito vs. fato", "Mistério investigativo", "Diário de campo", "Entrevista contextual", "Mapa narrado", "Antes e depois", "Perguntas da comunidade", "Série em episódios"] },
        topic: { type: "string", maxLength: 200 },
        count: { type: "integer", minimum: 1, maximum: 50 },
        locale: { type: "string", enum: ["pt-BR", "en", "es", "fr", "de", "ja", "ru", "ko"] },
      },
    },
  },
];

function send(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

async function callApi(path, options = {}) {
  if (!apiKey) throw new Error("Set UMBRA_API_KEY in this MCP server's environment.");
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      authorization: `Bearer ${apiKey}`,
      ...(options.body ? { "content-type": "application/json" } : {}),
      ...options.headers,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `UMBRA API returned HTTP ${response.status}.`);
  return data;
}

async function callTool(name, args) {
  if (name === "list_micro_audiences") {
    const query = new URLSearchParams(Object.entries(args).filter(([, value]) => value !== undefined).map(([key, value]) => [key, String(value)]));
    return callApi(`/api/v1/audiences?${query}`);
  }
  if (name === "search_youtube") {
    const query = new URLSearchParams(Object.entries(args).filter(([, value]) => value !== undefined).map(([key, value]) => [key, String(value)]));
    return callApi(`/api/v1/youtube?${query}`);
  }
  if (name === "generate_titles") {
    return callApi("/api/v1/titles", { method: "POST", body: JSON.stringify(args) });
  }
  throw new Error(`Unknown UMBRA tool: ${name}`);
}

async function handleMessage(message) {
  if (!message || typeof message !== "object" || !("method" in message)) return;
  const { id, method, params = {} } = message;
  if (method === "notifications/initialized" || method === "notifications/cancelled") return;
  if (id === undefined) return;

  if (method === "initialize") {
    send({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: params.protocolVersion || protocolVersion,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "umbra-dark-intelligence", version: "1.0.0" },
      },
    });
    return;
  }
  if (method === "ping") {
    send({ jsonrpc: "2.0", id, result: {} });
    return;
  }
  if (method === "shutdown") {
    send({ jsonrpc: "2.0", id, result: {} });
    return;
  }
  if (method === "tools/list") {
    send({ jsonrpc: "2.0", id, result: { tools } });
    return;
  }
  if (method === "tools/call") {
    try {
      const result = await callTool(params.name, params.arguments || {});
      send({
        jsonrpc: "2.0",
        id,
        result: {
          content: [{ type: "text", text: JSON.stringify(result) }],
          structuredContent: result,
        },
      });
    } catch (error) {
      send({
        jsonrpc: "2.0",
        id,
        result: { isError: true, content: [{ type: "text", text: error.message }] },
      });
    }
    return;
  }
  send({ jsonrpc: "2.0", id, error: { code: -32601, message: `Method not found: ${method}` } });
}

const input = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
input.on("line", (line) => {
  try {
    void handleMessage(JSON.parse(line));
  } catch {
    send({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } });
  }
});
