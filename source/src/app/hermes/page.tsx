"use client";

import { useEffect, useState } from "react";
import { Cpu, MessageSquare, Terminal, Layers, Target, Plug, Sparkles, History, AudioLines } from "lucide-react";
import AgentRoom from "@/components/AgentRoom";
import UnifiedChat, { type Msg } from "@/components/UnifiedChat";
import HermesWorkspace from "@/components/HermesWorkspace";
import HermesGoals from "@/components/HermesGoals";
import HermesMCPCatalog from "@/components/HermesMCPCatalog";
import HermesStudio from "@/components/HermesStudio";
import HermesTalk from "@/components/HermesTalk";

type HermesTab = "chat" | "talk" | "studio" | "sessions" | "goals" | "workspace" | "mcps" | "control";
interface HmVitals { ok: boolean; model: string; provider: string; }

// Real MiniMax-M3 session 20260602_062612_7a596f, mirrored into the Chat tab so
// it's there the moment you open Hermes → Chat (no seeding step). Persists once
// you interact; if you already have a Hermes thread, yours is kept instead.
const T0 = 1780300000000;
const HERMES_SEED: Msg[] = [
  { role: "user", agent: "hermes", ts: T0,
    text: "I just built 5 interactive, zero-dependency canvas demos in my Hermes workspace for an Agent OS showcase: (1) Cosmic Galaxy - a mouse-reactive 2,600-particle spiral galaxy with click-to-supernova, (2) Flow Field Art - a generative vector-field painting that reseeds on click, (3) Neon Spectrum - a 96-band radial audio visualizer with a beat-synced core, (4) Global Mesh - a rotating 3D wireframe globe with travelling data arcs, (5) Dopamine Fireworks - click-anywhere fireworks with trails and gravity. Give me a punchy one-line pitch for each, then tell me which one to open first for maximum wow." },
  { role: "assistant", agent: "hermes", ts: T0 + 60000,
    text: "Here are your pitches:\n\n1. Cosmic Galaxy — 2,600 mouse-reactive particles spiraling in a galactic dance, with click-to-supernova detonations.\n2. Flow Field Art — A generative vector-field painter that reseeds a fresh cosmic tapestry with every click.\n3. Neon Spectrum — A 96-band radial audio visualizer with a beat-synced core that pulses to your sound.\n4. Global Mesh — A rotating 3D wireframe globe traced with travelling data arcs between continents.\n5. Dopamine Fireworks — Click-anywhere firework bursts with glowing trails and gravitational falloff.\n\nOpen Cosmic Galaxy first. It's the strongest cold-open: you see 2,600 particles already doing something beautiful the instant the page loads, the mouse-following swirl makes it feel alive without any instruction, and the click-to-supernova is a high-drama payoff that happens within seconds — exactly the kind of \"wait, I can do that?!\" moment that hooks a viewer before they've even tried the other four. Save Fireworks for demo number two when they ask \"what else can I click?\"" },
  { role: "user", agent: "hermes", ts: T0 + 120000,
    text: "Love it. Give me a single high-energy caption I could post with a screen-recording of all 5, and 3 hashtags." },
  { role: "assistant", agent: "hermes", ts: T0 + 180000,
    text: "Five zero-dependency canvas demos, one shared workspace — spiral galaxies, vector fields, audio-reactive spectrums, wireframe globes, and click-anywhere fireworks. Built to prove the canvas can do a lot more than scrollbars. 🚀\n\n#AgentOS #CanvasDemos #BuiltWithHermes" },
  { role: "user", agent: "hermes", ts: T0 + 240000, text: "Perfect. Ship it." },
  { role: "assistant", agent: "hermes", ts: T0 + 300000, text: "Shipping it. 🚀" },
];

export default function HermesRoute() {
  const [tab, setTab] = useState<HermesTab>("chat");
  const [v, setV] = useState<HmVitals | null>(null);

  useEffect(() => {
    let stop = false;
    const fetchIt = async () => {
      try {
        const r = await fetch("/api/vitals", { cache: "no-store" });
        const j = await r.json();
        if (!stop) setV(j.hermes);
      } catch { /* ignore */ }
    };
    fetchIt();
    const t = setInterval(fetchIt, 8000);
    return () => { stop = true; clearInterval(t); };
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        {([
          { key: "chat",      label: "Chat",         icon: <MessageSquare size={14} /> },
          { key: "talk",      label: "Talk",         icon: <AudioLines size={14} /> },
          { key: "studio",    label: "Studio",       icon: <Sparkles size={14} /> },
          { key: "sessions",  label: "Sessions",     icon: <History size={14} /> },
          { key: "goals",     label: "Goal Mode",    icon: <Target size={14} /> },
          { key: "workspace", label: "Workspace",    icon: <Layers size={14} /> },
          { key: "mcps",      label: "MCPs",         icon: <Plug size={14} /> },
          { key: "control",   label: "Control Room", icon: <Terminal size={14} /> },
        ] as { key: HermesTab; label: string; icon: React.ReactNode }[]).map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-[12.5px] transition"
              style={{
                background: active ? "rgba(96,165,250,0.16)" : "transparent",
                borderColor: active ? "#60a5fa" : "var(--panel-border)",
                color: active ? "var(--fg)" : "var(--fg-dim)",
              }}
            >
              {t.icon}{t.label}
            </button>
          );
        })}
      </div>

      {tab === "chat" ? (
        <UnifiedChat defaultAgent="hermes" showAgentSwitcher={false} seedThreads={{ hermes: HERMES_SEED }} />
      ) : tab === "talk" ? (
        <HermesTalk />
      ) : tab === "studio" ? (
        <HermesStudio />
      ) : tab === "goals" ? (
        <HermesGoals />
      ) : tab === "workspace" ? (
        <HermesWorkspace />
      ) : tab === "mcps" ? (
        <HermesMCPCatalog />
      ) : (
        <AgentRoom
          key={tab}
          agent="hermes"
          accent="#60a5fa"
          accentDim="rgba(96,165,250,0.12)"
          defaultTab={tab === "sessions" ? "sessions" : "status"}
          tabs={[
            { key: "status",   label: "Status",   action: "status",   hint: "env" },
            { key: "sessions", label: "Sessions", action: "sessions", hint: "history" },
            { key: "skills",   label: "Skills",   action: "skills",   hint: "installed" },
            { key: "plugins",  label: "Plugins",  action: "plugins",  hint: "marketplace" },
            { key: "kanban",   label: "Kanban",   action: "kanban",   hint: "tasks" },
            { key: "doctor",   label: "Doctor",   action: "doctor",   hint: "check" },
            { key: "insights", label: "Insights", action: "insights", hint: "analytics" },
          ]}
          vitals={
            v ? (
              <div className="panel p-4 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid place-items-center w-10 h-10 rounded-xl"
                    style={{ background: "rgba(96,165,250,0.18)", color: "#60a5fa", boxShadow: "0 0 22px -8px #60a5fa" }}>
                    <Cpu size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-[var(--fg-dimmer)]">State</div>
                    <div className="text-sm font-medium" style={{ color: "#60a5fa" }}>{v.ok ? "Online" : "Offline"}</div>
                  </div>
                </div>
                <div className="rounded-lg border border-[var(--panel-border)] px-2.5 py-2">
                  <div className="text-[10px] uppercase tracking-widest text-[var(--fg-dimmer)]">Model</div>
                  <div className="metric text-sm truncate">{v.model}</div>
                </div>
                <div className="rounded-lg border border-[var(--panel-border)] px-2.5 py-2">
                  <div className="text-[10px] uppercase tracking-widest text-[var(--fg-dimmer)]">Provider</div>
                  <div className="metric text-sm truncate">{v.provider}</div>
                </div>
              </div>
            ) : null
          }
        />
      )}
    </div>
  );
}
