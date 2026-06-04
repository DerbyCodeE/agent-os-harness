// Singleton MCP client to jacob-bd/notebooklm-mcp-cli. 35 tools — full Studio coverage
// (audio, video, infographic, mind map, slides, flashcards, reports, briefing doc, etc.)
// + download_artifact for pulling any of those back into the dashboard.

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import { config } from "./config";

// Resolve the notebooklm-mcp binary portably so this works on any machine —
// no hardcoded home directory. Order:
//   1. config.nlmBin (env AGENTIC_OS_NLM_MCP_BIN or config.json nlmBin) — explicit
//   2. `notebooklm-mcp` on PATH (pip/pipx/uv installs usually land here)
//   3. Common install locations across macOS/Linux
//   4. Bare command name — let the OS resolve it via PATH at spawn time
function resolveNlmBin(): string {
  const override = config.nlmBin;
  if (override) return override;

  try {
    const onPath = execSync("command -v notebooklm-mcp", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (onPath) return onPath;
  } catch {
    /* not on PATH — fall through to known locations */
  }

  const home = os.homedir();
  const candidates = [
    path.join(home, ".local", "bin", "notebooklm-mcp"),
    "/opt/homebrew/bin/notebooklm-mcp",
    "/usr/local/bin/notebooklm-mcp",
    path.join(home, ".pyenv", "shims", "notebooklm-mcp"),
  ];
  for (const c of candidates) {
    if (existsSync(c)) return c;
  }

  // Last resort: bare name, resolved from PATH by the child process.
  return "notebooklm-mcp";
}

const NLM_BIN = resolveNlmBin();

let clientPromise: Promise<Client> | null = null;

function makeClient(): Promise<Client> {
  const env: Record<string, string> = { ...process.env } as Record<string, string>;
  const transport = new StdioClientTransport({ command: NLM_BIN, args: [], env });
  const client = new Client({ name: "agentic-os", version: "0.2.0" });
  return client.connect(transport).then(() => client);
}

export async function getNotebookLM(): Promise<Client> {
  if (!clientPromise) {
    clientPromise = makeClient().catch((e) => {
      clientPromise = null;
      throw e;
    });
  }
  return clientPromise;
}

/** Reset the cached client — used after re-auth or if the subprocess crashes. */
export async function resetClient(): Promise<void> {
  if (clientPromise) {
    try {
      const c = await clientPromise;
      await c.close().catch(() => {});
    } catch {}
  }
  clientPromise = null;
}

type ContentPart = { type?: string; text?: string };

/** Call a tool and return parsed JSON content (with raw fallback). */
export async function callTool<T = unknown>(name: string, args: Record<string, unknown> = {}): Promise<T> {
  const client = await getNotebookLM();
  const res = await client.callTool({ name, arguments: args });
  const content = (res as { content?: ContentPart[] }).content;
  if (Array.isArray(content) && content.length > 0) {
    const first = content[0];
    if (first?.type === "text" && typeof first.text === "string") {
      try { return JSON.parse(first.text) as T; }
      catch { return first.text as unknown as T; }
    }
  }
  return res as T;
}
