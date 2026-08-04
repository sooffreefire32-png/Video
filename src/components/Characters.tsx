import { CHARACTERS } from "../kit";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Characters() {
  return (
    <section
      id="characters"
      className="relative border-y border-white/5 bg-night-900/60 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="The Cast"
          title="Five faces, zero copyrighted pixels"
          subtitle="All character art is original flat-vector SVG drawn by tools/gen-assets.js — the Chroma Toons look without any image-scraping."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-5">
          {CHARACTERS.map((c, i) => (
            <Reveal key={c.name} delay={i * 70}>
              <article className="group relative overflow-hidden rounded-2xl border border-white/8 bg-night-800/60 p-4 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-white/15">
                <div
                  className="absolute inset-x-0 top-0 h-1 opacity-60 transition-opacity group-hover:opacity-100"
                  style={{ background: `linear-gradient(90deg, transparent, ${c.accent}, transparent)` }}
                />
                <div
                  className="mx-auto aspect-square w-full overflow-hidden rounded-xl"
                  style={{ background: "radial-gradient(120px 120px at 50% 35%, rgba(251,191,36,0.12), transparent 70%)" }}
                >
                  <img
                    src={c.img}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-108"
                  />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-white">{c.name}</h3>
                <p
                  className="mt-0.5 text-[11px] font-bold tracking-[0.2em] uppercase"
                  style={{ color: c.accent }}
                >
                  {c.tag}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{c.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
