import scenes from "../../story/scenes.json";
import { MOOD_COLORS } from "../kit";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const fmt = (s: number) => {
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
};

export function Timeline() {
  return (
    <section id="scenes" className="relative mx-auto max-w-5xl px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeading
        eyebrow="The Timeline"
        title="18 scenes · 600 seconds"
        subtitle="Every beat timed for retention — hook, rise, panic, revelation, choice, reward. This table is the single source of truth for the XML and the renderer."
      />

      <div className="relative mt-14">
        <div className="absolute top-0 bottom-0 left-[19px] w-px bg-gradient-to-b from-gold-400/60 via-cyber-400/40 to-transparent sm:left-[23px]" />
        <div className="space-y-5">
          {scenes.scenes.map((s, i) => {
            const color = MOOD_COLORS[s.mood] ?? "#fbbf24";
            return (
              <Reveal key={s.id} delay={Math.min(i * 40, 320)}>
                <div className="group relative flex gap-5 sm:gap-7">
                  <div
                    className="relative z-10 mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full border text-[10px] font-bold sm:h-12 sm:w-12 sm:text-xs"
                    style={{
                      borderColor: `${color}66`,
                      background: `${color}1a`,
                      color,
                    }}
                  >
                    {fmt(s.start)}
                  </div>
                  <div className="flex-1 overflow-hidden rounded-2xl border border-white/8 bg-night-800/50 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:bg-night-800/80">
                    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className="rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase"
                            style={{ background: `${color}1f`, color }}
                          >
                            {s.beat}
                          </span>
                          <span className="font-mono text-[11px] text-slate-500">
                            {s.id} · {s.end - s.start}s
                          </span>
                        </div>
                        <h3 className="mt-2 font-display text-lg font-bold text-white">
                          {s.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                          <span className="font-semibold text-gold-300/90">VO: </span>
                          {s.vo}
                        </p>
                      </div>
                      <div className="shrink-0 overflow-hidden rounded-xl border border-white/10 bg-night-900 sm:w-44">
                        <img
                          src={`/assets/${s.bg}`}
                          alt={s.title}
                          loading="lazy"
                          className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
