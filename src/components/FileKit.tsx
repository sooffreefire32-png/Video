import { FILES } from "../kit";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function FileKit() {
  return (
    <section
      id="files"
      className="relative border-t border-white/5 bg-night-900/60 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="The Kit"
          title="Everything, in the repo"
          subtitle="Script, scene table, XML project, converter, art and docs — all committed and versioned."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FILES.map((f, i) => (
            <Reveal key={f.path} delay={Math.min(i * 50, 300)}>
              <div className="group flex h-full items-start gap-4 rounded-2xl border border-white/8 bg-night-800/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/30 hover:bg-night-800/80">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-night-950 text-xl ring-1 ring-white/10">
                  {f.icon}
                </span>
                <div className="min-w-0">
                  <code className="block truncate font-mono text-sm font-semibold text-gold-300">
                    {f.path}
                  </code>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{f.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
