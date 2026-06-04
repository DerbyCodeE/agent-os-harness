# 🛰️ Travel Mode — Use Agent OS from anywhere

Your dashboard runs on your home Mac.

But you can use it from Tokyo, Bali, the airport.

Same kanban tasks. Same chat history. Same memory.

Just open Chrome → same URL.

Here's how.

---

## ⚡ The setup — 10 minutes

You need:

- Your home Mac (the one running Agent OS)
- Your travel laptop
- A free Tailscale account

Tailscale is a private network only YOUR devices can see.

No router config. No port forwarding. No public exposure.

---

## 📥 Step 1 · Install Tailscale on your home Mac

Download from tailscale.com.

Sign up with Google or Apple.

You'll see a status menu in your menu bar.

Click it. Note the hostname.

It'll be something like `mac-studio.tail-abcd.ts.net`.

That's your dashboard's permanent address.

---

## 💻 Step 2 · Install Tailscale on your travel laptop

Same download.

Same account.

It auto-joins your tailnet.

You can now reach your home Mac from anywhere with internet.

---

## 🔒 Step 3 · Make sure your home Mac stays awake

System Settings → Lock Screen.

Turn ON "Prevent automatic sleeping when display is off".

Otherwise your Mac will sleep + your dashboard will be unreachable.

---

## 🔁 Step 4 · Auto-start the dev server on boot (optional)

If your Mac reboots while you're away, you want it to come back automatically.

Create a launchd plist:

```bash
cat > ~/Library/LaunchAgents/com.agentic-os.dev.plist <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.agentic-os.dev</string>
  <key>WorkingDirectory</key>
  <string>/Users/YOURNAME/Agentic OS/agentic-os</string>
  <key>ProgramArguments</key>
  <array>
    <string>/Users/YOURNAME/.nvm/versions/node/v20.0.0/bin/npm</string>
    <string>run</string>
    <string>dev</string>
  </array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key>
    <string>/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin</string>
    <key>PORT</key>
    <string>3737</string>
  </dict>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>/tmp/aos-dev.log</string>
  <key>StandardErrorPath</key>
  <string>/tmp/aos-dev.log</string>
</dict>
</plist>
EOF

launchctl load ~/Library/LaunchAgents/com.agentic-os.dev.plist
```

Replace `YOURNAME` + paths to match your setup.

Now `npm run dev` auto-starts on boot.

---

## 🌐 Step 5 · Open the dashboard from anywhere

From your travel laptop:

```
http://mac-studio.tail-abcd.ts.net:3737
```

(Replace with your actual Tailscale hostname + port.)

Bookmark it.

It's your home dashboard, anywhere.

---

## ⚙️ Step 6 · Phone access (bonus)

Install Tailscale on iPhone or Android.

Same account.

Open Safari / Chrome on the phone → same URL → mobile dashboard.

The MobileNav at the bottom of the sidebar is built for this.

---

## 🚧 Catches

**Latency** — your home internet is the bottleneck. 200ms ping = noticeable but workable.

**Mac asleep** — if your Mac sleeps, the dashboard goes dark. Set "Prevent automatic sleeping when display is off" + use a keep-alive utility like `caffeinate -d` if needed.

**Power outage at home** — nothing to do here. Wait for power to come back.

---

## 🌍 Alternative — Local install on the travel laptop

If you want offline access (planes, bad wifi):

Do a full install of Agent OS on the travel laptop too.

Sync your Obsidian vault via iCloud Drive (works automatically).

The kanban + memory + chat history stays separate per-machine.

But Goals + Journal + Memory pages stay in sync via the vault.

Use Tailscale for "same state" days.

Use the local install for "offline" days.

Both work.

---

## ⚡ My setup

I run Agent OS on my Mac Studio at home in Bangkok.

When I travel — Japan, Bali, anywhere — I just open my MacBook Pro.

Bookmark in Chrome.

One click → my dashboard.

Same kanban tasks I left.

Same conversation history.

Same memory.

Like I never left my desk.

That's the magic of Tailscale.
