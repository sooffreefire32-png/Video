import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Teaser() {
  return (
    <section id="teaser" className="relative border-y border-white/5 bg-night-900/60 py-24 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Proof of the pipeline"
          title="Rendered straight from the XML"
          subtitle="This 60-second clip was produced by workflow/render.js — the project XML defines every scene, caption and camera move. No manual video editing."
        />

        <Reveal delay={120}>
          <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-night-950 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
            <video
              className="aspect-video w-full"
              src="/output/teaser-60s.mp4"
              poster="/output/poster.png"
              controls
              preload="metadata"
              playsInline
            >
              Your browser does not support HTML video — grab output/teaser-60s.mp4 from the repo.
            </video>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 px-5 py-3 text-xs text-slate-500">
              <span className="font-semibold tracking-wider uppercase">
                output/teaser-60s.mp4 · first 60s of 600
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                H.264 + AAC · rendered from XML
              </span>
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-slate-500">
            Full 10-minute render:{" "}
            <code className="rounded bg-night-800 px-2 py-0.5 font-mono text-xs text-gold-300">
              bun workflow/render.js
            </code>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
