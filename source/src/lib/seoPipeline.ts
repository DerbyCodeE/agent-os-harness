import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { config, expandHome, type SeoSiteConfig } from "./config";

export interface Site {
  id: string;
  name: string;
  url: string;
  path: string;
  postsDir: string;
}

// Built-in default funnel — used when no `seoSites` is configured. Override it in
// ~/.agentic-os/config.json (or via AGENTIC_OS_SEO_SITES) so the dashboard adapts
// to your own sites without editing source.
const DEFAULT_SITES: SeoSiteConfig[] = [
  { id: "bestaiagentcommunity",   name: "bestaiagentcommunity.com",     url: "https://bestaiagentcommunity.com",     path: "~/AIProfitBoardroom.com" },
  { id: "aiprofitboardroom",      name: "aiprofitboardroom.com",        url: "https://aiprofitboardroom.com",        path: "~/AIProfitBoardroom-main" },
  { id: "juliangoldieautomation", name: "juliangoldieaiautomation.com", url: "https://juliangoldieaiautomation.com", path: "~/juliangoldieaiautomation" },
  { id: "aisuccesslab",           name: "aisuccesslabjuliangoldie.com", url: "https://aisuccesslabjuliangoldie.com", path: "~/aisuccesslab" },
  { id: "aimoneylab",             name: "aimoneylabjuliangoldie.com",   url: "https://aimoneylabjuliangoldie.com",   path: "~/aimoneylab" },
];

function resolveSites(): Site[] {
  const src = config.seoSites && config.seoSites.length > 0 ? config.seoSites : DEFAULT_SITES;
  return src.map((s) => {
    const root = expandHome(s.path);
    return {
      id: s.id,
      name: s.name,
      url: s.url.replace(/\/+$/, ""),
      path: root,
      postsDir: s.postsDir ? expandHome(s.postsDir) : path.join(root, "src", "blog", "posts"),
    };
  });
}

// The SEO funnel, resolved from config (falls back to the default funnel).
export const SITES: Site[] = resolveSites();

// The skill + transcripts live under one site's .claude dir. Use the configured
// `seoSkillSite` if set, otherwise the first site.
const SKILL_SITE: Site =
  SITES.find((s) => s.id === config.seoSkillSite) ?? SITES[0];

export const TRANSCRIPTS_DIR = path.join(SKILL_SITE?.path ?? os.homedir(), ".claude", "transcripts");
export const BLOG_POST_SKILL = path.join(SKILL_SITE?.path ?? os.homedir(), ".claude", "skills", "blog-post.md");

export interface SiteStats {
  site: Site;
  postCount: number;
  recent: { slug: string; mtime: number; title?: string; date?: string }[];
}

async function listFilesMtime(dir: string, n = 6): Promise<{ name: string; mtime: number }[]> {
  try {
    const items = await readdir(dir);
    const mds = items.filter((f) => /\.md$/.test(f));
    const stats = await Promise.all(mds.map(async (f) => {
      try { const s = await stat(path.join(dir, f)); return { name: f, mtime: s.mtimeMs }; }
      catch { return { name: f, mtime: 0 }; }
    }));
    stats.sort((a, b) => b.mtime - a.mtime);
    return stats.slice(0, n);
  } catch { return []; }
}

async function readFrontMatter(file: string): Promise<{ title?: string; date?: string }> {
  try {
    const data = await readFile(file, "utf8");
    const m = data.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!m) return {};
    const fm = m[1];
    const titleMatch = fm.match(/^title:\s*["']?([^"'\n]+)["']?\s*$/m);
    const dateMatch = fm.match(/^date:\s*["']?([^"'\n]+)["']?\s*$/m);
    return {
      title: titleMatch ? titleMatch[1].trim() : undefined,
      date: dateMatch ? dateMatch[1].trim() : undefined,
    };
  } catch { return {}; }
}

export async function getSiteStats(site: Site): Promise<SiteStats> {
  const recent = await listFilesMtime(site.postsDir, 6);
  let postCount = 0;
  try { postCount = (await readdir(site.postsDir)).filter((f) => /\.md$/.test(f)).length; }
  catch {}
  const enriched = await Promise.all(recent.map(async (r) => {
    const fm = await readFrontMatter(path.join(site.postsDir, r.name));
    return { slug: r.name.replace(/\.md$/, ""), mtime: r.mtime, ...fm };
  }));
  return { site, postCount, recent: enriched };
}

export async function getAllSiteStats(): Promise<SiteStats[]> {
  return Promise.all(SITES.map(getSiteStats));
}

export interface TranscriptMeta { slug: string; bytes: number; mtime: number; preview: string; }

export async function listTranscripts(): Promise<TranscriptMeta[]> {
  try {
    const items = await readdir(TRANSCRIPTS_DIR);
    const txts = items.filter((f) => /\.txt$/.test(f));
    const out: TranscriptMeta[] = [];
    for (const t of txts) {
      const full = path.join(TRANSCRIPTS_DIR, t);
      try {
        const s = await stat(full);
        const head = (await readFile(full, "utf8")).slice(0, 220).replace(/\s+/g, " ").trim();
        out.push({ slug: t.replace(/\.txt$/, ""), bytes: s.size, mtime: s.mtimeMs, preview: head });
      } catch {}
    }
    out.sort((a, b) => b.mtime - a.mtime);
    return out;
  } catch { return []; }
}

export async function readTranscript(slug: string): Promise<string | null> {
  if (!/^[A-Za-z0-9_-]+$/.test(slug)) return null;
  const file = path.join(TRANSCRIPTS_DIR, `${slug}.txt`);
  try { return await readFile(file, "utf8"); }
  catch { return null; }
}
