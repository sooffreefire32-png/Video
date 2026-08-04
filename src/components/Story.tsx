import { TWISTS } from "../kit";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Story() {
  return (
    <section id="story" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeading
        eyebrow="The Story"
        title="Paisa jo kal se aata hai"
        subtitle="A full 10-minute Hinglish narration — hook in 45 seconds, three layers of twist, one moral. Written from scratch in story/script.md."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {TWISTS.map((t, i) => (
          <Reveal key={t.title} delay={i * 90}>
            <article
              className="group relative h-full overflow-hidden rounded-2xl border border-white/8 bg-night-800/60 p-7 backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:border-white/15 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
              style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05)` }}
            >
              <div
                className="absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
                style={{ background: t.accent }}
              />
              <div className="relative">
                <div
                  className="mb-5 grid h-14 w-14 place-items-center rounded-xl text-2xl"
                  style={{ background: `${t.accent}1a`, border: `1px solid ${t.accent}40` }}
                >
                  {t.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-white">{t.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{t.body}</p>
                <p className="mt-5 text-xs font-bold tracking-[0.25em] text-slate-600 uppercase">
                  Twist {i + 1} / 3
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <blockquote className="relative mx-auto mt-16 max-w-3xl overflow-hidden rounded-2xl border border-gold-400/25 bg-gradient-to-br from-gold-400/10 to-transparent p-8 text-center sm:p-10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />
          <p className="font-display text-xl leading-relaxed font-semibold text-gold-200 sm:text-2xl">
            “Kal koi jagah nahi hai jo milti hai…
            <br />
            kal ek jagah hai jo <span className="text-gold-grad">banti hai.</span>”
          </p>
          <footer className="mt-4 text-xs font-semibold tracking-[0.3em] text-slate-500 uppercase">
            — end card · KalKatha Toons
          </footer>
        </blockquote>
      </Reveal>
    </section>
  );
}
