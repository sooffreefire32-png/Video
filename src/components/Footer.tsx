import { REPO_URL } from "../kit";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-night-950">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex flex-col items-center gap-8 text-center">
          <a href="#top" className="flex items-center gap-3">
            <img
              src="/assets/logo.svg"
              alt="KalKatha Toons"
              className="h-12 w-12 rounded-xl shadow-lg shadow-gold-500/20 ring-1 ring-gold-400/30"
            />
            <span className="font-display text-2xl font-bold text-white">
              KalKatha<span className="text-gold-400">Toons</span>
            </span>
          </a>
          <p className="max-w-xl text-sm leading-relaxed text-slate-500">
            “Har kahani mein ek kal chhupa hai.” — This project is a full production kit: story,
            art, Alight-style XML and an XML→MP4 pipeline. Build the video, then open the same
            scenes in Alight Motion for extra sparkle.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-2 font-semibold text-gold-300 transition-all hover:bg-gold-400/20"
            >
              GitHub ↗
            </a>
            <a
              href="#workflow"
              className="rounded-full border border-white/15 px-4 py-2 font-semibold text-slate-300 transition-all hover:border-cyber-400/40 hover:text-cyber-300"
            >
              XML → MP4 workflow
            </a>
            <a
              href="#scenes"
              className="rounded-full border border-white/15 px-4 py-2 font-semibold text-slate-300 transition-all hover:border-cyber-400/40 hover:text-cyber-300"
            >
              18-scene timeline
            </a>
          </div>
          <p className="text-[11px] tracking-wider text-slate-600 uppercase">
            © 2026 KalKatha Toons · The ATM That Printed Tomorrow&apos;s Money · Like · Share ·
            Subscribe
          </p>
        </div>
      </div>
    </footer>
  );
}
