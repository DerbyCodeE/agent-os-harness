# 🤖 02 · Connect Your Agents

The dashboard runs on its own. **Agents are optional and added one at a time.** Pick the ones you'll actually use — you don't need all of them.

> 🧠 **If any agent won't connect:** open **Claude Code** or **Hermes** *inside your `~/agent-os` folder* and say: *"This agent won't connect — read the files in here and help me fix it."* It will read the real code, see exactly how the dashboard talks to that agent, and fix it. This is the fastest way to solve anything. (See `06-TROUBLESHOOTING.md`.)

---

## 🔑 Two rules that fix 90% of problems

**Rule 1 — Make sure agents are on your PATH.** Several install to `~/.local/bin`. The dashboard finds agents by running `which`, so that folder must be on your PATH:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**Rule 2 — Restart the dashboard after installing an agent.** It detects CLIs at startup. After you install one:

1. Stop the dashboard (Ctrl-C in its terminal)
2. `cd ~/agent-os && npm run dev`
3. Refresh **http://localhost:3000** → the agent's tile flips to **ONLINE**

---

## The agents (copy-paste, tested)

### 1 · Claude Code — the gold standard
```bash
npm install -g @anthropic-ai/claude-code
claude login          # opens a browser; sign in
```
> If the dashboard's Claude chat ever shows **"401 / invalid credentials"**, your CLI login expired — just re-run `claude login`. (Inside `claude`, you can also type `/login`.)

### 2 · Gemini — Google, huge context
```bash
npm install -g @google/gemini-cli
gemini                # first run walks you through Google sign-in
```

### 3 · Codex — OpenAI's coding agent
```bash
npm install -g @openai/codex
codex login
```

### 4 · OpenClaw — local multi-channel agent
```bash
npm install -g openclaw
openclaw onboard --install-daemon     # guided setup; installs the gateway daemon
```
To use **Grok (xAI)** as its model:
```bash
openclaw models auth login --provider xai --device-code --set-default
```
> If the gateway won't start (`missing gateway.mode`):
> ```bash
> openclaw config set gateway.mode local
> openclaw gateway install --force
> ```

### 5 · Hermes — the self-improving agent (sessions, skills, kanban)
```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
source ~/.zshrc
hermes setup          # or: hermes setup --portal  (one login covers model + tools)
```
> This is the agent to connect to **MiniMax** for the Studio + voice chat — see the MiniMax section below.

### 6 · Antigravity — Gemini's successor (the `agy` binary)
```bash
curl -fsSL https://antigravity.google/cli/install.sh | bash
agy                   # first run = Google sign-in
```
> ⚠️ It is **NOT** `brew install agy` and **NOT** `npm i @google/antigravity` — those don't exist. Use the installer above. The binary is `agy`.

### 7 · Free Claude Code — Claude Code at $0 (advanced)
Routes Claude Code through a local proxy to free models. Needs **Python 3.14** and a free provider key.
```bash
# install uv if you don't have it
curl -LsSf https://astral.sh/uv/install.sh | sh
uv python install 3.14.5
uv tool install --force --python 3.14.5 "git+https://github.com/Alishahryar1/free-claude-code.git"
fcc-server
```
Then open the Admin UI it prints (`http://127.0.0.1:8082/admin`) and paste a **free OpenRouter** key (openrouter.ai/keys) or **NVIDIA NIM** key (build.nvidia.com).
> Use **Python 3.14 stable** (e.g. `3.14.5`) — an *alpha* 3.14 build will crash it.

---

## ⭐ MiniMax + Hermes — the powerful combo

Connecting MiniMax to Hermes unlocks the standout features: **Hermes → Studio** (generate images, Hailuo videos & voice from a prompt) and **Hermes → Talk** (live hands-free voice chat). Pick whichever is easier for you:

**Option A — via Ollama (easiest, free):**
```bash
# install Ollama from ollama.com, then:
ollama signin
ollama launch hermes --model minimax-m3:cloud
```

**Option B — via MiniMax's own login:**
```bash
hermes auth add minimax-oauth     # sign in with your MiniMax account in the browser
```

Once connected, open **Hermes** in the dashboard and you'll have **Chat · Talk · Studio · Sessions · Workspace** — all running on MiniMax. No API keys to paste; it uses the login.

> Want to verify? `hermes status` should show **Model: MiniMax-M3**. If a generation fails with "balance too low", you're accidentally on a different (paid) provider — re-run the connect step above.

---

## ✅ Did it work?

Refresh **Mission Control**. Each connected agent's tile shows **ONLINE** with its version/model. Click into an agent to chat, browse its Workspace, or (for Hermes) open Studio and Talk.

If a tile stays Offline: it's almost always **Rule 1 or Rule 2** above (PATH, or you didn't restart the dashboard). Still stuck? Ask Claude Code or Hermes to read the folder and fix it — that's what it's there for.
