import { REPO_URL } from "../kit";

const LINKS = [
  { href: "#story", label: "Story" },
  { href: "#scenes", label: "Scenes" },
  { href: "#characters", label: "Characters" },
  { href: "#workflow", label: "Workflow" },
  { href: "#files", label: "Files" },
];

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-night-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="group flex items-center gap-3">
          <img
            src="/assets/logo.svg"
            alt="KalKatha Toons"
            className="h-9 w-9 rounded-lg shadow-lg shadow-gold-500/20 ring-1 ring-gold-400/30 transition-transform duration-300 group-hover:rotate-6"
          />
          <span className="font-display text-lg font-bold text-white">
            KalKatha<span className="text-gold-400">Toons</span>
          </span>
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-slate-300 transition-colors hover:text-gold-300"
            >
              {l.label}
            </a>
          ))}
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-1.5 text-sm font-semibold text-gold-300 transition-all hover:bg-gold-400/20 hover:shadow-[0_0_24px_rgba(251,191,36,0.25)]"
          >
            GitHub ↗
          </a>
        </nav>
        <a
          href="#teaser"
          className="rounded-full bg-gold-400 px-4 py-1.5 text-sm font-bold text-night-950 transition-all hover:bg-gold-300 hover:shadow-[0_0_28px_rgba(251,191,36,0.4)] md:hidden"
        >
          ▶ Teaser
        </a>
      </div>
    </header>
  );
}
