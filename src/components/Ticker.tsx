import { TICKER_ITEMS } from "../kit";

export function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="relative z-10 -mt-10 border-y-2 border-alert-700 bg-alert-500/95 shadow-[0_0_40px_rgba(239,68,68,0.35)]">
      <div className="flex items-stretch">
        <div className="z-10 flex items-center gap-2 bg-night-950 px-4 py-2.5 text-[11px] font-extrabold tracking-[0.25em] text-alert-500 uppercase sm:px-6">
          <span className="animate-blink inline-block h-2.5 w-2.5 rounded-full bg-alert-500" />
          Breaking
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap py-2.5 pl-8">
            {items.map((t, i) => (
              <span
                key={i}
                className="text-sm font-bold tracking-wider text-night-950 uppercase"
              >
                {t}
                <span className="ml-10 text-night-950/60">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
