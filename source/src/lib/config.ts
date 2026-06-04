// Single source of truth for paths + config.
// Load order:
//   1. Environment variables (highest priority)
//   2. ~/.agentic-os/config.json (user override)
//   3. Auto-detect (via `which`) for CLIs
//   4. Sensible defaults
//
// This is what makes the project portable. AIPB members run `npm run setup` or
// drop a config.json with their paths; the dashboard adapts.

import { readFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import os from "node:os";

export interface AgenticConfig {
  // CLI binary paths
  claude: string | null;
  openclaw: string | null;
  hermes: string | null;
  gemini: string | null;
  antigravity: string | null;
  codex: string | null;
  ant: string | null; // Claude Platform CLI (`ant`) — note: collides with Apache Ant
  nlmBin: string | null; // notebooklm-mcp binary (null = auto-detect on PATH)

  // Obsidian vault root (where Agentic OS writes goals, journal, memories)
  vaultRoot: string | null;

  // Per-agent log directories (for the Activity Stream tile)
  openclawLogs: string;
  hermesLogs: string;

  // OpenClaw default agent id (for chat)
  openclawAgent: string;

  // Goal categories shown in the dropdown
  goalCategories: string[];

  // SEO funnel — the sites the SEO generator writes blog posts into. User-specific,
  // so fully configurable. Leave null to use the built-in default funnel.
  seoSites: SeoSiteConfig[] | null;
  // Which site (by id) holds the blog-post skill + transcripts under its .claude
  // dir. Defaults to the first site when null.
  seoSkillSite: string | null;

  // Display
  locationLabel: string; // e.g. "Bangkok"
}

export interface SeoSiteConfig {
  id: string;
  name: string;
  url: string;
  path: string;       // repo root — absolute, or "~/..." (home is expanded)
  postsDir?: string;  // optional override; defaults to <path>/src/blog/posts
}

function which(cmd: string): string | null {
  try {
    const out = execSync(`command -v ${cmd}`, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    return out.trim() || null;
  } catch { return null; }
}

function loadFileConfig(): Partial<AgenticConfig> {
  const candidates = [
    process.env.AGENTIC_OS_CONFIG,
    path.join(os.homedir(), ".agentic-os", "config.json"),
    path.join(process.cwd(), "agentic-os.config.json"),
  ].filter(Boolean) as string[];

  for (const p of candidates) {
    if (!existsSync(p)) continue;
    try {
      return JSON.parse(readFileSync(p, "utf8"));
    } catch { /* ignore malformed */ }
  }
  return {};
}

const fileCfg = loadFileConfig();

function defaultVault(): string | null {
  const fromFile = fileCfg.vaultRoot;
  if (typeof fromFile === "string" && existsSync(fromFile)) return fromFile;
  const fromEnv = process.env.AGENTIC_OS_VAULT;
  if (fromEnv && existsSync(fromEnv)) return fromEnv;
  // Common defaults to try
  const guesses = [
    path.join(os.homedir(), "Documents", "Obsidian Vault"),
    path.join(os.homedir(), "Obsidian"),
    path.join(os.homedir(), "Obsidian Vault"),
  ];
  for (const g of guesses) if (existsSync(g)) return g;
  return null;
}

export const config: AgenticConfig = {
  claude:   process.env.AGENTIC_OS_CLAUDE_BIN   ?? fileCfg.claude   ?? which("claude"),
  openclaw: process.env.AGENTIC_OS_OPENCLAW_BIN ?? fileCfg.openclaw ?? which("openclaw"),
  hermes:   process.env.AGENTIC_OS_HERMES_BIN   ?? fileCfg.hermes   ?? which("hermes"),
  gemini:   process.env.AGENTIC_OS_GEMINI_BIN   ?? fileCfg.gemini   ?? which("gemini"),
  // Antigravity CLI (the new "agy" binary — Gemini CLI's successor). Both can coexist
  // during the migration window (Gemini sunsets 2026-06-18).
  antigravity: process.env.AGENTIC_OS_ANTIGRAVITY_BIN ?? fileCfg.antigravity ?? which("agy"),
  // Codex CLI (OpenAI's coding agent). Used for chat + Goal Mode + reviewing past sessions.
  codex: process.env.AGENTIC_OS_CODEX_BIN ?? fileCfg.codex ?? which("codex"),
  // Claude Platform CLI (`ant`) — runs every Claude API endpoint + Managed Agents
  // from the terminal. `which ant` may also match Apache Ant; the UI verifies the
  // real one via `ant --version`.
  ant: process.env.AGENTIC_OS_ANT_BIN ?? fileCfg.ant ?? which("ant"),
  // notebooklm-mcp binary. Null → notebooklmClient auto-detects on PATH + common
  // install locations. Env AGENTIC_OS_NLM_MCP_BIN or config.nlmBin to pin it.
  nlmBin: process.env.AGENTIC_OS_NLM_MCP_BIN ?? fileCfg.nlmBin ?? null,

  vaultRoot: defaultVault(),

  openclawLogs:
    process.env.AGENTIC_OS_OPENCLAW_LOGS
    ?? fileCfg.openclawLogs
    ?? path.join(os.homedir(), ".openclaw", "logs"),
  hermesLogs:
    process.env.AGENTIC_OS_HERMES_LOGS
    ?? fileCfg.hermesLogs
    ?? path.join(os.homedir(), ".hermes", "cache"),

  openclawAgent: process.env.AGENTIC_OS_OPENCLAW_AGENT ?? fileCfg.openclawAgent ?? "main",

  goalCategories: fileCfg.goalCategories ?? [
    "Health", "Personal", "Work", "Learning", "Side Project",
  ],

  // SEO funnel. Env var AGENTIC_OS_SEO_SITES (JSON array) > config.json seoSites >
  // null (seoPipeline then falls back to the built-in default funnel).
  seoSites: parseSeoSitesEnv() ?? fileCfg.seoSites ?? null,
  seoSkillSite: process.env.AGENTIC_OS_SEO_SKILL_SITE ?? fileCfg.seoSkillSite ?? null,

  locationLabel: process.env.AGENTIC_OS_LOCATION ?? fileCfg.locationLabel ?? "Local",
};

function parseSeoSitesEnv(): SeoSiteConfig[] | null {
  const raw = process.env.AGENTIC_OS_SEO_SITES;
  if (!raw) return null;
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? (v as SeoSiteConfig[]) : null;
  } catch { return null; }
}

/** Expand a leading "~" to the user's home directory. */
export function expandHome(p: string): string {
  if (p === "~") return os.homedir();
  if (p.startsWith("~/")) return path.join(os.homedir(), p.slice(2));
  return p;
}

export function isAgentInstalled(agent: "claude" | "openclaw" | "hermes" | "gemini" | "antigravity" | "codex"): boolean {
  return Boolean(config[agent]);
}

// The Claude model the dashboard pins for the real `claude` CLI (Claude agent
// chat + SEO generation). Single source of truth so a model bump is a one-line
// change. Override with AGENTIC_OS_CLAUDE_MODEL if you want a different one.
// `claude-opus-4-8` = Opus 4.8 (released 2026-05). Use the bare `opus` alias
// instead if you'd rather always track the latest Opus automatically.
export const CLAUDE_MODEL: string =
  process.env.AGENTIC_OS_CLAUDE_MODEL
  ?? (fileCfg as { claudeModel?: string }).claudeModel
  ?? "claude-opus-4-8";
