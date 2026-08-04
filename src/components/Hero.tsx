import { STATS } from "../kit";
import { Reveal } from "./Reveal";

export function Hero() {
  return (
    <section id="top" className="grain relative min-h-screen overflow-hidden">
      {/* backdrop art */}
      <div className="absolute inset-0">
        <img
          src="/assets/street-night.svg"
          alt=""
          className="h-full w-full scale-105 object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night-950/60 via-night-950/40 to-night-950" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_70%_30%,rgba(251,191,36,0.12),transparent_60%)]" />
      </div>

      {/* floating notes */}
      <img
        src="/assets/note.svg"
        alt=""
        className="animate-float absolute top-[18%] right-[6%] hidden w-28 opacity-80 drop-shadow-[0_0_18px_rgba(251,191,36,0.35)] lg:block"
      />
      <img
        src="/assets/note.svg"
        alt=""
        className="animate-float-slow absolute top-[52%] left-[4%] hidden w-20 -rotate-12 opacity-60 drop-shadow-[0_0_14px_rgba(34,211,238,0.3)] lg:block"
      />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 pt-24 pb-16 text-center sm:px-6">
        <Reveal>
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold tracking-wider">
            {["10:00 DURATION", "18 SCENES", "XML → MP4", "HINGLISH VO", "1080p"].map((b) => (
              <span
                key={b}
                className="rounded-full border border-cyber-400/30 bg-cyber-400/10 px-3 py-1 text-cyber-300"
              >
                {b}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={80}>
          <p className="mb-3 font-display text-sm font-semibold tracking-[0.35em] text-gold-300/90 uppercase">
            KalKatha Toons presents
          </p>
          <h1 className="font-display text-5xl leading-[1.02] font-extrabold text-white sm:text-7xl md:text-8xl">
            The ATM That Printed
            <span className="text-gold-grad mt-2 block pb-2 drop-shadow-[0_0_30px_rgba(251,191,36,0.25)]">
              Tomorrow&apos;s Money
            </span>
          </h1>
          <p className="mt-4 font-display text-lg font-semibold text-slate-300 sm:text-2xl">
            ATM Jo <span className="text-cyber-300">Kal Ka</span> Paisa Deti Thi
          </p>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            Midnight. A dead ATM on Pahadi Road. Five thousand rupees — every note stamped{" "}
            <span className="font-semibold text-alert-500">01-01-2087</span>. The money works… until
            the clock strikes twelve and it becomes the most wanted paper in the city. And then the
            machine starts talking.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <a
              href="#teaser"
              className="group inline-flex items-center gap-2 rounded-full bg-gold-400 px-7 py-3.5 font-bold text-night-950 transition-all hover:bg-gold-300 hover:shadow-[0_0_40px_rgba(251,191,36,0.45)]"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-night-950 text-[10px] text-gold-400 transition-transform group-hover:scale-110">
                ▶
              </span>
              Watch the teaser
            </a>
            <a
              href="#story"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 font-semibold text-slate-100 backdrop-blur transition-all hover:border-gold-400/40 hover:text-gold-300"
            >
              📖 Read the story
            </a>
            <a
              href="#workflow"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 font-semibold text-slate-100 backdrop-blur transition-all hover:border-cyber-400/40 hover:text-cyber-300"
            >
              ⚙️ The production kit
            </a>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <dl className="mt-14 grid grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center">
                <dt className="font-display text-3xl font-extrabold text-gold-300 sm:text-4xl">
                  {s.value}
                </dt>
                <dd className="mt-1 text-xs font-semibold tracking-[0.25em] text-slate-500 uppercase">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      {/* bottom fade into next section */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-night-950 to-transparent" />
    </section>
  );
}
