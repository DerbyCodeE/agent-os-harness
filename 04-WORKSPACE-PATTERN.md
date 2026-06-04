# 📦 The Workspace Pattern

Same pattern across every agent that builds things.

Antigravity has it.

Codex has it.

Free Claude Code has it.

You can add it to any new agent in 30 minutes.

---

## 🎯 What it does

Anything an agent writes during a chat or goal → lands in a scratch dir.

The dashboard browses that scratch dir.

Click any file → inline preview:

- HTML pages → live iframe with `Preview / Source` toggle
- Images → render
- Videos (including HyperFrames .mp4 / .webm) → play with full controls
- Audio → audio player
- PDF → embedded viewer
- Text → source view
- Binary → download link

Plus HTTP Range support so videos scrub smoothly + large files don't lock the browser.

---

## 🗂️ Where files go

Each agent has its own scratch root.

| Agent | Scratch root |
|---|---|
| Antigravity | `~/.gemini/antigravity-cli/scratch/` (+ brain) |
| Codex | `~/codex-scratch/` |
| Free Claude Code | `~/freeclaude-scratch/` |

Inside each, every "project" is a subfolder.

The chat endpoint pins the agent's `cwd` to the active project so files land in the right place.

---

## 🔌 The four ingredients

To wire this for any new agent you build:

**1. Workspace library** (`src/lib/<agent>Workspace.ts`)

Defines:
- The scratch root path
- `listProjects()` → returns all project folders
- `listProjectFiles(name)` → returns files inside one
- `readProjectFile(name, path)` → returns text content
- `ensureProject(name)` → creates if missing

**2. Workspace API** (`src/app/api/<agent>/workspace/route.ts`)

- `GET /api/<agent>/workspace` → list projects
- `GET /api/<agent>/workspace?project=name` → list files
- `POST /api/<agent>/workspace { name }` → create project

**3. File content API** (`src/app/api/<agent>/workspace/file/route.ts`)

- `GET /api/<agent>/workspace/file?project=name&path=rel` → text content

**4. Path-based preview API** (`src/app/api/<agent>/preview/[...path]/route.ts`)

This is the magic one.

URL shape: `/api/<agent>/preview/<project>/<rel-path-with-slashes>`

When an HTML iframe loads `/api/<agent>/preview/my-site/index.html`, and that page references `<link href="style.css">`, the browser resolves it to `/api/<agent>/preview/my-site/style.css` — which the same endpoint serves.

Whole project becomes browse-able through the iframe.

Plus HTTP Range support for video scrubbing.

---

## 🛡️ Security guardrails

Every preview endpoint hard-restricts to its scratch root:

```typescript
const base = path.join(SCRATCH_ROOT, project);
const abs = path.resolve(base, rel);
if (abs !== base && !abs.startsWith(base + path.sep)) {
  return new Response("forbidden", { status: 403 });
}
```

Plus Next.js auto-rejects `..` in catch-all routes.

Plus iframe sandbox: `sandbox="allow-scripts allow-forms allow-popups allow-modals"` — scripts run but can't read your dashboard's cookies.

---

## 🎨 The UI shape

Same layout for all three workspace tabs:

```
┌────────────────────────────────────────────────────────────┐
│ Tab bar  [Chat]  [Workspace 3]            [Active: my-app] │
├──────────────────┬─────────────────────────────────────────┤
│ Projects · 3     │ my-app                                  │
│ ┌──────────────┐ │ /Users/.../scratch/my-app               │
│ │ new-project  │ ├─────────────────────────────────────────┤
│ │   + Add      │ │ Files                                   │
│ ├──────────────┤ │  ▸ index.html       TEXT  6.8KB         │
│ │ my-app  ◀── active│  ▸ style.css        TEXT  2.1KB    │
│ │   3 files    │ │  ▸ hero.png         IMAGE 45KB         │
│ │ Set active → │ │  ▸ promo.mp4        VIDEO 12MB         │
│ └──────────────┘ │ ─────────────────────────────────────── │
│ ┌──────────────┐ │ index.html                              │
│ │ smoke-test   │ │  [Preview] [Source]  [New tab] [Save]  │
│ │   1 files    │ │ ┌─────────────────────────────────────┐ │
│ └──────────────┘ │ │   (rendered iframe of the HTML)     │ │
│                  │ └─────────────────────────────────────┘ │
└──────────────────┴─────────────────────────────────────────┘
```

Left sidebar lists projects.

Right pane lists files + previews the open one.

Same shape, three agents.

---

## 🛠️ Adding a new agent

If you wire up a new agent — let's say Aider or some future Claude variant — and you want the Workspace pattern:

1. Copy `src/lib/freeClaudeWorkspace.ts` → `src/lib/<agent>Workspace.ts`. Change the scratch root path.

2. Copy the 4 API route folders. Rename. Repoint the import.

3. Add a Workspace tab to your agent's view component. Use `FreeClaudePanel.tsx` as the template.

4. Update the chat endpoint to pin `cwd` to the active scratch project.

That's the whole pattern.

Build it once. Use it everywhere.

---

## 🎬 HyperFrames + this pattern

Specifically — if your agent uses HyperFrames to render videos:

The .mp4 / .webm output lands in the scratch project.

Click it in the Workspace tab.

Plays inline with full scrub controls.

Range requests work so big files don't kill the browser.

This is how I check video drafts without leaving the dashboard.
