// Pre-loaded chat threads surfaced directly in the Chat tab via UnifiedChat's
// `seedThreads` prop. These hydrate the panel only when an agent has no saved
// localStorage thread yet — so the Chat tab shows a real prior conversation
// instead of being empty. No /demo-history visit required.

import type { Msg } from "@/components/UnifiedChat";
import type { AgentKey } from "@/components/AgentAvatar";

// Stable, backdated timestamps so the thread reads as a genuine past session.
let _t = Date.now() - 1000 * 60 * 42;
const at = (gapSec: number) => (_t += gapSec * 1000);

function build(agent: AgentKey, turns: [string, string][]): Msg[] {
  const out: Msg[] = [];
  for (const [user, reply] of turns) {
    out.push({ role: "user", text: user, ts: at(40) });
    out.push({ role: "assistant", agent, text: reply, ts: at(8) });
  }
  return out;
}

// The actual Claude build session for the six workspace demos.
const claude = build("claude", [
  [
    "Build me a bunch of fun, crazy, dopamine-inducing demos for the workspace — interactive stuff I can show off the power of this with.",
    "Love it. I'll make a little arcade of interactive canvas toys — each one a single self-contained HTML file (zero libraries, zero assets) so they render live in the Workspace tab and run anywhere, even offline. Spinning them up now…",
  ],
  [
    "go wild",
    "🎉 Shipped SIX to your Claude workspace — open Claude → Workspace → pick one → Preview, they all animate and react to you:\n\n🫧 Liquid Lava — gooey metaballs that merge, split and chase your mouse (SVG goo filter, pure hypnosis).\n🧬 Game of Life — Conway's automata you paint into with the mouse; cells glow by age. Randomize / pause / clear.\n💚 Digital Rain — the Matrix code storm; move the mouse to bend it, click to flash the grid.\n🌅 Outrun Sunset — an endless synthwave horizon: scrolling neon perspective grid + a chrome scanline sun.\n🪐 Gravity Sandbox — click to drop stars and watch 1,500 particles fall into glowing orbits. Real n-body physics.\n🌸 Living Tree — a recursive fractal tree that grows and sways in the wind; click to change the season's blossoms.\n\nAll mouse/click-interactive — perfect for a live demo.",
  ],
  [
    "Which ones should I open first for maximum wow?",
    "Open in this order:\n\n1. Liquid Lava — it's alive the instant it loads and follows your cursor, so it reads as \"interactive\" before you say a word.\n2. Gravity Sandbox — then click once on stage; 1,500 particles snap into orbit. That click-to-payoff moment is the biggest gasp.\n3. Digital Rain — everyone recognises the Matrix; great crowd-pleaser to close on.\n\nLiving Tree + Outrun Sunset are the \"and there's more\" beats once they're hooked. Each is ~100 lines — worth mentioning live, because \"this is a single file with no dependencies\" is the part that makes builders lean in.",
  ],
  [
    "these are insane 🔥",
    "🙌 Right? They're deliberately tiny and dependency-free so they load instantly and you can pop open the Source toggle mid-demo to show there's no magic — just a canvas and a loop. Want me to build a \"launch all 6\" arcade gallery to tie them into one showpiece, or add a fullscreen kiosk mode for the booth?",
  ],
]);

export const SEED_THREADS: Partial<Record<AgentKey, Msg[]>> = {
  claude,
};
