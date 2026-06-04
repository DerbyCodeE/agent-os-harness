# 🛸 Agent OS

**One dashboard. Every AI agent. Your command centre.**

Agent OS is a local web dashboard ("Mission Control") that wires together **Claude Code, OpenClaw, Hermes, Gemini, Antigravity, Codex, and Free Claude Code** — plus a full **MiniMax Studio** (generate images, video & voice), a **live voice chat**, an SEO suite, a Kanban board, and a Video studio. It runs entirely on **your** machine and reads from **your** Obsidian vault. No cloud account required.

> 🧠 **The single most useful tip in this whole pack:** if *anything* goes wrong, open Claude Code (or Hermes) **in your `~/agent-os` folder** and say: *"Read the files in this folder and help me fix &lt;the problem&gt;."* An AI agent reading the actual source will solve almost any setup issue in minutes. (This whole system was built and debugged exactly that way.) More on this in **`06-TROUBLESHOOTING.md`**.

---

## ✅ What you need (5 minutes)

- **macOS or Linux** (Windows works via WSL2)
- **Node 22 or newer** — *required.* (The Kanban uses Node's built-in SQLite, which only exists on Node 22+.) Check with `node -v`.
  - Don't have it? `brew install node@22` (get Homebrew at [brew.sh](https://brew.sh) if needed.)

That's it to run the dashboard. The individual **agents** (Claude, Hermes, etc.) are optional and installed one at a time — see **`02-CONNECT-AGENTS.md`**.

---

## 🚀 Install (3 commands)

Open Terminal, then:

```bash
# 1. Move the app somewhere permanent (your home folder is perfect)
cp -R ./source ~/agent-os && cd ~/agent-os

# 2. Install dependencies (needs internet once — pulls Next.js, React, etc.)
npm install

# 3. Start it
npm run dev
```

Open **http://localhost:3000**. You'll land on **Mission Control**. 🎉

> The dashboard works with **zero agents installed** — every tile renders, it just shows "Offline" for any CLI you haven't set up yet. Add them whenever you like.

### Point it at your notes (optional but recommended)
So Goals / Journal / Memory show real content:

```bash
mkdir -p ~/.agentic-os
cp ~/agent-os/agentic-os.config.example.json ~/.agentic-os/config.json
```

Then edit `~/.agentic-os/config.json` and set `"vaultRoot"` to your Obsidian vault path (or leave it `null` to auto-detect `~/Documents/Obsidian Vault`).

---

## 🤖 Connect your agents

The dashboard is the easy part. Connecting the agents is where most questions come up — so there's a **dedicated, copy-paste guide** with the *correct, tested* commands for each one:

👉 **Read `02-CONNECT-AGENTS.md`** — it covers Claude, Gemini, Codex, OpenClaw, Hermes, Antigravity, Free Claude Code, **and** the standout: connecting **MiniMax** to Hermes (which unlocks the Studio, voice chat, and image/video generation).

You don't need all of them. Pick the ones you'll actually use.

---

## ✨ What's inside the dashboard

- **Mission Control** — every agent's status, your goals/journal/memory, a live activity stream
- **Each Agent** — a full chat + workspace, with a "Control Room" for sessions/skills/health
- **Hermes** specifically has: **Chat · Talk (live voice) · Studio (generate image/video/voice) · Sessions · Goal Mode · Workspace · Kanban**
- **MiniMax Studio** — type a prompt, get a real image, a Hailuo video, or a voice clip, live
- **Talk** — a hands-free voice conversation: tap once, just talk, tap to end
- **SEO / Notebook / Kanban / Goals / Journal / Memory** — productivity layers grounded in your vault
- **Video** — HyperFrames composition runner + render gallery

---

## 📦 What's in this pack

```
agent-os-pack/
├── README.md                 ← you are here (install + overview)
├── 01-INSTALL.md             ← step-by-step install
├── 02-CONNECT-AGENTS.md      ← connect each agent (the important one)
├── 03-DESIGN-SYSTEM.md       ← brand tokens / design reference
├── 04-WORKSPACE-PATTERN.md   ← how each agent's Workspace tab works
├── 05-TRAVEL-MODE.md         ← reach it from anywhere (Tailscale)
├── 06-TROUBLESHOOTING.md     ← fixes + the "ask an AI to fix it" trick
├── source/                   ← the entire app (Next.js)
├── design/                   ← design assets
└── examples/                 ← 5 ready-to-render HyperFrames video compositions
```

---

## 🏃 Run it again later

```bash
cd ~/agent-os && npm run dev
```

Then open **http://localhost:3000**. Want it always-on (auto-start, never think about it)? See the "Keep it running forever" section in **`06-TROUBLESHOOTING.md`**.

---

Built with Agent OS · AI Profit Boardroom · made to be hacked on.
