# 🧰 06 · Troubleshooting

## 🥇 The #1 fix: let an AI agent read the files and solve it

This entire system was built **and debugged** by pointing an AI agent at the source code and asking it to fix things. You can do the exact same thing. It's faster and less stressful than any checklist.

**How:**

1. Open **Claude Code** (or Hermes) in a terminal, *inside your app folder*:
   ```bash
   cd ~/agent-os
   claude          # or: hermes
   ```
2. Describe your problem in plain English. Good prompts:

   > *"The dashboard won't start — read the files in this folder and tell me exactly what to run to fix it."*

   > *"My Hermes agent shows Offline in Mission Control. Look at how the dashboard detects agents (check src/lib/config.ts and src/lib/runner.ts) and help me connect it."*

   > *"npm run dev throws an error — here's the message: [paste it]. Read the project and fix it."*

   > *"I want MiniMax working in Hermes Studio. Read src/lib/hermesStudio.ts and the api/hermes/studio routes and walk me through connecting it."*

The agent reads the **actual code** — how the dashboard talks to each agent, where files live, what the routes expect — and gives you the precise fix. It can even run the commands for you. **Try this first for anything you're unsure about.**

---

## Common issues (quick fixes)

### Dashboard won't open / "site can't be reached"
- Make sure it's running: `cd ~/agent-os && npm run dev`, then open **http://localhost:3000**.
- Check your Node version: `node -v` must be **22+**. If lower, install Node 22 (see `01-INSTALL.md`) and re-run `npm install`.

### "Parsing CSS source code failed" / broken styles
- You (or someone) ran **`npm audit fix --force`**. Don't — it upgrades packages to incompatible versions. Fix it with a clean reinstall:
  ```bash
  cd ~/agent-os
  rm -rf node_modules package-lock.json
  npm install
  npm run dev
  ```
- Ignore the "2 moderate vulnerabilities" notice. It's harmless and expected.

### (Windows) Don't put the app in a system folder
- Never unzip/copy it into `C:\Windows\System32` or another protected folder. Use your home folder, e.g. `C:\Users\<you>\agent-os`. Run everything inside **WSL2** for the smoothest experience.

### An agent shows "Offline" in Mission Control
- 9 times out of 10 it's one of these two:
  1. The agent isn't on your **PATH**. Run `which <agent>` (e.g. `which hermes`). If nothing prints, add `~/.local/bin` to PATH (see `02-CONNECT-AGENTS.md`, Rule 1).
  2. You didn't **restart the dashboard** after installing it. Stop it (Ctrl-C) and `npm run dev` again.

### Claude chat says "401 / invalid authentication credentials"
- Your Claude CLI login expired. Re-run `claude login` in a terminal.
- Rare gotcha: if your system has an **empty** `ANTHROPIC_API_KEY` environment variable, it hijacks Claude's login. Clear it: `launchctl unsetenv ANTHROPIC_API_KEY` (macOS), then restart the dashboard.

### Kanban board is blank
- Almost always **Node < 22**. The Kanban uses Node's built-in SQLite (Node 22+ only). Upgrade Node, re-run `npm install`.

### Hermes / MiniMax: "balance too low" or "requires credits"
- Hermes is pointed at a *paid* provider with no credits. Re-connect MiniMax (free) via `02-CONNECT-AGENTS.md` → the MiniMax section (`ollama launch hermes --model minimax-m3:cloud`, or `hermes auth add minimax-oauth`). Verify with `hermes status` → should read **Model: MiniMax-M3**.

### It's slow / it keeps stopping when I close the terminal
- The dev server stops when you close its terminal. For a fast, always-on setup, see the next section.

---

## 🔌 Keep it running forever (recommended)

For speed and "it's just always there", run a **production build** as a background service that auto-starts at login and restarts itself if it ever crashes.

**1. Build the production version (once):**
```bash
cd ~/agent-os && npm run build
```

**2. macOS — install it as a launch agent:**
```bash
cat > ~/Library/LaunchAgents/com.agent-os.dashboard.plist <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>Label</key><string>com.agent-os.dashboard</string>
  <key>ProgramArguments</key><array>
    <string>/opt/homebrew/bin/npm</string><string>run</string><string>start</string>
  </array>
  <key>WorkingDirectory</key><string>$HOME/agent-os</string>
  <key>EnvironmentVariables</key><dict>
    <key>PATH</key><string>$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin</string>
  </dict>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
  <key>StandardOutPath</key><string>/tmp/agent-os.log</string>
  <key>StandardErrorPath</key><string>/tmp/agent-os.log</string>
</dict></plist>
EOF
launchctl load ~/Library/LaunchAgents/com.agent-os.dashboard.plist
```

Now it's always running at **http://localhost:3000** — fast (production mode), auto-starting, self-healing.

- **After you change code or update:** `cd ~/agent-os && npm run build`, then `launchctl kickstart -k gui/$(id -u)/com.agent-os.dashboard`
- **To stop it:** `launchctl unload ~/Library/LaunchAgents/com.agent-os.dashboard.plist`
- **Logs:** `tail -f /tmp/agent-os.log`

> Tip: production mode (`npm run start`) is much faster than `npm run dev` and won't do the occasional "compiling…" pauses. Use dev only when you're editing the code.

---

## Still stuck?

Go back to the top of this file. Seriously — `cd ~/agent-os`, open `claude` or `hermes`, and ask it to read the folder and fix your exact problem. That's the superpower of this whole system: **the tools can fix themselves.**
