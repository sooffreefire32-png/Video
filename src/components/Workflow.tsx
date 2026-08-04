import { WORKFLOW_STEPS } from "../kit";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const XML_SNIPPET = `<?xml version="1.0" encoding="UTF-8"?>
<project title="The ATM That Printed Tomorrow's Money"
  width="1920" height="1080" fps="30" duration="600">
  <assets>
    <asset id="street-night" src="public/assets/street-night.svg" />
    <asset id="city2087"    src="public/assets/city2087.svg" />
  </assets>
  <audio>
    <track src="voiceover/vo-full.mp3" offset="0" />
  </audio>
  <scenes>
    <scene id="s01" start="0" end="20" bg="street-night"
      motion="zoom-in" grade="#ef4444" vignette="0.5">
      <caption>Aaj ki raat, ek ladke ne ATM se paise nikale...</caption>
    </scene>
    <!-- 17 more scenes... -->
  </scenes>
</project>`;

const CMDS = [
  { label: "Generate art (26 SVGs)", cmd: "bun tools/gen-assets.js" },
  { label: "Build the 600s project XML", cmd: "bun tools/gen-project.js" },
  { label: "Render the full 10:00 MP4", cmd: "bun workflow/render.js" },
  { label: "Quick teaser (first 60s)", cmd: "bun workflow/render.js --to 60 --width 960" },
  { label: "Smoke test the pipeline", cmd: "bun workflow/render.js --project workflow/sample.xml --width 640 --fps 24" },
];

export function Workflow() {
  return (
    <section id="workflow" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeading
        eyebrow="The Workflow"
        title="From story to MP4 — fully automated"
        subtitle="An open, documented Alight-style XML format plus a real ffmpeg converter. Change the story JSON, re-run two commands, get a new video."
      />

      {/* steps */}
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {WORKFLOW_STEPS.map((st, i) => (
          <Reveal key={st.n} delay={i * 70}>
            <div className="group relative h-full rounded-2xl border border-white/8 bg-night-800/50 p-5 transition-all duration-300 hover:border-cyber-400/30 hover:bg-night-800/80">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{st.icon}</span>
                <span className="font-display text-3xl font-extrabold text-white/10 transition-colors group-hover:text-gold-400/40">
                  {st.n}
                </span>
              </div>
              <h3 className="mt-3 font-display text-base font-bold text-white">{st.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">{st.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {/* commands */}
        <Reveal>
          <div className="h-full rounded-2xl border border-white/8 bg-night-900/80 p-6">
            <h3 className="mb-4 font-display text-lg font-bold text-white">
              <span className="mr-2">⚡</span>One-liners
            </h3>
            <div className="space-y-3">
              {CMDS.map((c) => (
                <div
                  key={c.cmd}
                  className="group rounded-xl border border-white/5 bg-night-950 p-3 transition-colors hover:border-gold-400/25"
                >
                  <p className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                    {c.label}
                  </p>
                  <code className="mt-1 block break-all font-mono text-xs text-gold-300">
                    {c.cmd}
                  </code>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              Output: <code className="text-cyber-300">output/atm-tomorrow-money.mp4</code> —
              H.264 + AAC, faststart, captions, Ken Burns motion, mood grading and fades baked in.
            </p>
          </div>
        </Reveal>

        {/* xml snippet */}
        <Reveal delay={100}>
          <div className="h-full overflow-hidden rounded-2xl border border-white/8 bg-night-900/80">
            <div className="flex items-center gap-2 border-b border-white/5 px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-alert-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-gold-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
              <span className="ml-2 font-mono text-xs text-slate-500">
                project/atm-tomorrow-money.xml
              </span>
            </div>
            <pre className="max-h-96 overflow-auto p-5 font-mono text-[11px] leading-relaxed text-slate-300">
              {XML_SNIPPET}
            </pre>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
