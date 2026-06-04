# 🛠️ 01 · Install Agent OS

Zero to running dashboard. About **10 minutes**. Do the steps in order.

> 💡 Stuck at any point? Skip to **`06-TROUBLESHOOTING.md`** — and remember the golden rule: open **Claude Code** or **Hermes** *inside the `source` folder* and ask it to read the files and fix your problem. That works for almost everything.

---

## Step 1 · Install Node 22+ (required)

The dashboard needs **Node version 22 or newer** — the Kanban board reads its data through Node's built-in SQLite, which only exists on Node 22+. On older Node the Kanban won't load.

Check what you have:

```bash
node -v
```

If it's missing or below 22, install via Homebrew:

```bash
brew install node@22
```

(No Homebrew? Get the one-line installer at [brew.sh](https://brew.sh).)

---

## Step 2 · Copy the app onto your machine

The full app is already in this pack, under **`source/`**. There's **no GitHub clone** — it's all here.

First, `cd` into wherever you unzipped this pack. If you double-clicked the zip, it's probably in Downloads:

```bash
cd ~/Downloads/agent-os-pack
```

Run `ls` — you should see `README.md`, `source/`, `examples/`, and the numbered guides. If you don't see `source/`, you're in the wrong folder.

Now copy the app to a permanent home and install its dependencies:

```bash
# Copy the app
cp -R ./source ~/agent-os

# Move in and install (needs internet once — pulls Next.js, React, Tailwind…)
cd ~/agent-os
npm install
```

`npm install` takes a minute or two the first time. After that the dashboard runs fully local.

> You may see *"2 moderate severity vulnerabilities"* at the end. **That's normal — ignore it.** Do **not** run `npm audit fix --force`; it upgrades packages to incompatible versions and breaks the build.

---

## Step 3 · Point it at your notes (optional)

So **Goals / Journal / Memory** show real content from your Obsidian vault:

```bash
mkdir -p ~/.agentic-os
cp ~/agent-os/agentic-os.config.example.json ~/.agentic-os/config.json
```

Then open `~/.agentic-os/config.json` and set `"vaultRoot"` to your vault's full path, e.g.:

```json
{ "vaultRoot": "/Users/yourname/Documents/Obsidian Vault" }
```

Leave it `null` and it'll try to auto-detect `~/Documents/Obsidian Vault`. No vault? It still runs — those tabs just stay empty.

---

## Step 4 · Start it

```bash
cd ~/agent-os
npm run dev
```

You'll see:

```
✓ Ready in ~200ms
- Local:  http://localhost:3000
```

Open **http://localhost:3000** → you're on **Mission Control**. 🎉

> The dashboard works with **no agents installed**. Every tile renders; CLIs you haven't set up show "Offline". That's expected.

---

## Step 5 · Connect your agents

Now the fun part. Head to **`02-CONNECT-AGENTS.md`** for the exact, tested commands to wire up Claude, Hermes, OpenClaw, Gemini, Codex, Antigravity, Free Claude Code — and **MiniMax** (which powers the Studio + voice chat).

---

## 🏃 Running it later

```bash
cd ~/agent-os && npm run dev
```

Want it **always-on** (auto-start at login, restarts itself if it crashes)? See *"Keep it running forever"* in **`06-TROUBLESHOOTING.md`** — it's a 2-minute setup and the difference between "I have to start it each time" and "it's just always there."

---

## 🔒 What you DON'T need

No GitHub account. No fork. No cloud account anywhere. No exposed ports (unless you opt into Travel Mode via Tailscale — see `05-TRAVEL-MODE.md`). The source is in this pack, the agents are CLIs on your machine, your data is in your vault. That's the whole stack.
