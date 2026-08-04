import { C, L, R, rect, circ, ell, poly, pth, line, txt, dust, person, car, truck, tag, coins, bars, svg } from "./gen-finance-assets.js";

const sky = (t = "night") => {
  if (t === "dusk") return `<rect width="1280" height="720" fill="url(#skyD)"/>`;
  if (t === "day") return `<rect width="1280" height="720" fill="url(#skyDay)"/>`;
  return `<rect width="1280" height="720" fill="url(#skyN)"/>`;
};

export const SCENES_B = [
  /* BEAT 12 — exponential chart $47K vs $35K */
  ["beat12", () => {
    const defs = `${L("skyN", C.navy3, C.navy2, 90)}${L("grow", C.green, "#65a30d", 90)}`;
    const body = `${sky()}
${rect(140, 140, 1000, 440, "#0a1330", 12)}
${line(220, 480, 1080, 480, "#334155", 4)}
${line(260, 160, 260, 480, "#334155", 4)}
${pth("M 280 470 Q 500 430 620 340 T 1060 180", "none", 'stroke="url(#grow)" stroke-width="9"')}
${rect(300, 300, 130, 180, C.green, 8)}
${txt(365, 280, "$47K", "#fff", 40)}
${rect(560, 380, 130, 100, "#1e40af", 8)}
${txt(625, 360, "$35K", "#fff", 40)}
${txt(980, 560, "financed", C.cream, 30)}
${txt(700, 590, "cash", C.cream, 30)}
${dust(38, 15)}`;
    return svg(defs, body);
  }],

  /* BEAT 13 — two identical trucks, −$12,000 */
  ["beat13", () => {
    const defs = `${L("wall", "#f3ead6", "#e6d9ba", 90)}${L("skyDay", "#a7c8e8", "#d9e6f2", 90)}`;
    const body = `${sky("day")}
${rect(0, 460, 640, 260, "#cbbfa0")}
${rect(640, 460, 640, 260, "#0a1330")}
${truck(80, 320, { color: "#475569", w: 280 })}
${truck(720, 320, { color: "#475569", w: 280 })}
${coins(220, 340, 4, 34)}
${tag(700, 110, "−$12,000", C.red, 'transform="rotate(-6 850 154)"')}
${txt(320, 640, "CASH — kept it", C.navy, 32)}
${txt(960, 640, "LOAN — paid it", C.cream, 32)}
${line(640, 60, 640, 460, C.goldLight, 6, 'opacity="0.8"')}
${dust(34, 29)}`;
    return svg(defs, body);
  }],

  /* BEAT 14 — balanced scale, 3% loan vs growing plant */
  ["beat14", () => {
    const defs = `${L("wall", "#faf5ea", "#f3ead6", 90)}`;
    const body = `<rect width="1280" height="720" fill="url(#wall)"/>
${rect(600, 340, 80, 260, "#8b6f47", 6)}
${poly("560,350 720,350 640,420", "#8b6f47")}
${ell(640, 350, 300, 14, "#6b4f2a")}
${line(430, 320, 430, 380, "#6b4f2a", 8)}
${line(850, 320, 850, 380, "#6b4f2a", 8)}
${rect(330, 360, 200, 120, "#fffdf6", 10)}
${txt(430, 420, "3% loan", C.greenDark, 36)}
${poly("750,470 950,470 880,520 820,520", "#6b4f2a")}
${rect(760, 380, 26, 90, "#14532d", 6)}
${pth("M 760 420 Q 800 360 850 380 Q 890 396 900 380", "none", 'stroke="#16a34a" stroke-width="7" stroke-linecap="round"')}
${circ(850, 370, 16, "#16a34a")}
${txt(640, 660, "low rate + growing money = win", C.navy, 34)}
${dust(36, 25)}`;
    return svg(defs, body);
  }],

  /* BEAT 15 — 6.9% red bar vs tiny green savings bar */
  ["beat15", () => {
    const defs = `${L("skyN", C.navy3, C.navy2, 90)}`;
    const body = `${sky()}
${rect(200, 120, 300, 420, "#0a1330", 12)}
${rect(250, 220, 200, 320, C.red, 10)}
${txt(350, 190, "6.9%", "#fff", 52)}
${txt(350, 500, "loan rate", C.red, 32)}
${rect(780, 120, 300, 420, "#0a1330", 12)}
${rect(830, 460, 200, 80, C.green, 10)}
${txt(930, 430, "~1.2%", "#fff", 52)}
${txt(930, 500, "savings", C.green, 32)}
${pth("M 480 260 l -70 0 q -10 60 6 130", "none", 'stroke="#fbbf24" stroke-width="6" stroke-dasharray="18 14"')}
${dust(38, 7)}`;
    return svg(defs, body);
  }],

  /* BEAT 16 — coin question mark, cash + pause clock */
  ["beat16", () => {
    const defs = `${L("wall", "#faf5ea", "#f3ead6", 90)}${R("qGlow", "rgba(245,158,11,0.4)", "rgba(245,158,11,0)")}`;
    const body = `<rect width="1280" height="720" fill="url(#wall)"/>
${ell(640, 620, 460, 80, "#e8dcc0")}
${ell(700, 180, 180, 90, "url(#qGlow)", 'opacity="0.6"')}
${txt(700, 240, "?", C.amber, 300)}
${coins(320, 470, 5, 40)}
${rect(980, 360, 180, 180, "#fffdf6", 16)}
${circ(1070, 450, 64, "#fffdf6", 'stroke="#b45309" stroke-width="10"')}
${rect(1062, 448, 16, 52, "#b45309")}
${rect(1078, 448, 16, 52, "#b45309")}
${txt(330, 660, "PAY CASH?", C.navy, 34)}
${txt(1070, 620, "OR WAIT?", C.navy, 34)}
${dust(38, 33)}`;
    return svg(defs, body);
  }],

  /* BEAT 17 — wrench + truck, red X on stock arrow, house rising */
  ["beat17", () => {
    const defs = `${L("skyDay", "#a7c8e8", "#d9e6f2", 90)}${L("grow", C.green, "#65a30d", 90)}`;
    const body = `${sky("day")}
${rect(0, 500, 1280, 220, "#cbbfa0")}
${truck(100, 340, { color: "#7c2d12", w: 300 })}
${line(430, 380, 640, 380, "#6b4f2a", 10)}
${rect(620, 300, 60, 80, "#b45309", 6, 'transform="rotate(45 650 340)"')}
${rect(612, 318, 76, 16, "#7c2d12", 4, 'transform="rotate(45 650 340)"')}
${pth("M 520 420 L 580 360 L 620 400 L 700 320", "none", 'stroke="url(#grow)" stroke-width="8" stroke-linecap="round"')}
${line(520, 420, 546, 446, C.red, 12)}
${line(546, 420, 520, 446, C.red, 12)}
${poly("620,500 720,500 690,380 650,380", "#b45309")}
${rect(640, 380, 60, 120, "#d9b26a", 0)}
${rect(660, 300, 20, 40, "#8b6f47")}
${txt(670, 280, "HOME", C.navy, 30)}
${dust(34, 37)}`;
    return svg(defs, body);
  }],

  /* BEAT 18 — price tag peeling $35,000 → $47,000 */
  ["beat18", () => {
    const defs = `${L("wall", "#f3ead6", "#e6d9ba", 90)}${R("spot", "rgba(251,191,36,0.5)", "rgba(251,191,36,0)")}`;
    const body = `<rect width="1280" height="720" fill="url(#wall)"/>
${ell(640, 360, 460, 260, "url(#spot)", 'opacity="0.5"')}
${rect(320, 200, 640, 320, "#fffdf6", 16, 'transform="rotate(-5 640 360)"')}
${txt(640, 330, "$35,000", C.navy, 76, 'transform="rotate(-5 640 360)"')}
${txt(640, 400, "STICKER PRICE", C.gray, 30, 'transform="rotate(-5 640 360)"')}
${pth("M 620 160 L 700 210 L 668 320 L 556 300 L 540 200 Z", "rgba(220,38,38,0.85)", 'transform="rotate(-5 640 360)"')}
${txt(600, 268, "$47,000", "#fff", 52, 'transform="rotate(-5 640 360)"')}
${pth("M 640 180 l 18 26 l -18 -6 l -18 6 Z", "#fff", 'opacity="0.7" transform="rotate(-5 640 360)"')}
${dust(40, 43)}`;
    return svg(defs, body);
  }],

  /* BEAT 19 — laptop spreadsheet, 10-minute clock */
  ["beat19", () => {
    const defs = `${L("wall", "#faf5ea", "#f3ead6", 90)}`;
    const body = `<rect width="1280" height="720" fill="url(#wall)"/>
${rect(240, 160, 620, 380, "#0a1330", 10)}
${rect(260, 180, 580, 40, "#16254d")}
${txt(550, 210, "7-YEAR MATH", "#fde68a", 30)}
${Array.from({ length: 4 }, (_, i) => rect(270, 240 + i * 44, 560, 34, i % 2 ? "#12214d" : "#0e1b3e")).join("")}
${rect(270, 420, 560, 60, "#14532d", 6)}
${txt(550, 458, "TOTAL: $47,080", "#fff", 34)}
${rect(940, 160, 220, 220, "#fffdf6", 16)}
${circ(1050, 250, 74, "#fffdf6", 'stroke="#b45309" stroke-width="9"')}
${rect(1046, 248, 9, 44, "#b45309")}
${rect(1046, 248, 38, 9, "#b45309")}
${txt(1050, 350, "10 min", C.navy, 28)}
${person(200, 520, { shirt: C.navy, hair: "#201a17", scale: 1.1 })}
${dust(34, 41)}`;
    return svg(defs, body);
  }],

  /* BEAT 20 — buyer showing "7-YEAR COST?" paper, salesman frozen */
  ["beat20", () => {
    const defs = `${L("wall", "#f3ead6", "#e8dcc0", 90)}${R("lamp", "rgba(251,191,36,0.35)", "rgba(251,191,36,0)")}`;
    const body = `<rect width="1280" height="720" fill="url(#wall)"/>
${rect(0, 520, 1280, 200, "#c9b890")}
${rect(140, 420, 1000, 18, "#8b6f47")}
${person(300, 560, { shirt: "#1e3a8a", hair: "#201a17", scale: 1.3, arm: "up" })}
${rect(360, 340, 300, 120, "#fffdf6", 8, 'transform="rotate(-6 510 400)"')}
${txt(510, 400, "7-YEAR COST?", C.redDark, 44, 'transform="rotate(-6 510 400)"')}
${person(960, 560, { shirt: "#111827", hair: "#57534e", scale: 1.3 })}
${ell(1040, 400, 60, 60, "#fff", 'opacity="0.5"')}
${dust(32, 47)}`;
    return svg(defs, body);
  }],

  /* BEAT 21 — hand with calculator, glowing green dollar */
  ["beat21", () => {
    const defs = `${L("wall", "#faf5ea", "#f3ead6", 90)}${R("dGlow", "rgba(22,163,74,0.5)", "rgba(22,163,74,0)")}`;
    const body = `<rect width="1280" height="720" fill="url(#wall)"/>
${ell(640, 560, 460, 90, "#e8dcc0")}
${rect(340, 220, 340, 240, "#0a1330", 14)}
${rect(370, 250, 280, 44, "#16254d", 6)}
${txt(510, 282, "7-YEAR MATH", "#fde68a", 28)}
${Array.from({ length: 4 }, (_, i) => rect(370, 310 + i * 32, 60, 24, "#1e3a5f", 4)).join("")}
${rect(450, 310, 60, 24, "#1e3a5f", 4)}
${rect(530, 310, 60, 24, "#1e3a5f", 4)}
${rect(450, 342, 60, 24, "#1e3a5f", 4)}
${rect(530, 342, 60, 24, "#1e3a5f", 4)}
${ell(300, 520, 90, 50, C.skin, 'transform="rotate(-18 300 520)"')}
${ell(900, 300, 150, 150, "url(#dGlow)", 'opacity="0.7"')}
${txt(900, 340, "$", C.green, 200)}
${coins(880, 520, 6, 44)}
${dust(40, 51)}`;
    return svg(defs, body);
  }],

  /* BEAT 22 — man + paid truck at golden hour, holding savings jar */
  ["beat22", () => {
    const defs = `${L("skyD", "#b45309", "#fbbf24", 90)}${R("sun", "rgba(253,230,138,0.95)", "rgba(253,230,138,0)")}${R("glow", "rgba(253,230,138,0.4)", "rgba(253,230,138,0)")}`;
    const body = `${sky("dusk")}
${circ(1080, 300, 110, "url(#sun)", 'opacity="0.85"')}
${rect(0, 540, 1280, 180, "#3b2415")}
${rect(0, 520, 1280, 26, "#241a14")}
${truck(140, 380, { color: "#1e40af", w: 320 })}
${person(700, 500, { shirt: C.navy, hair: "#201a17", scale: 1.4, look: "smile" })}
${pth("M 780 430 l -30 60 q 10 26 44 30 q 40 4 52 -34 Z", "rgba(255,255,255,0.5)", 'stroke="#c9b890" stroke-width="5"')}
${coins(820, 470, 5, 22)}
${ell(640, 460, 420, 120, "url(#glow)", 'opacity="0.4"')}
${txt(640, 690, "KEEP WHAT YOU EARN", C.cream, 44)}
${dust(46, 53)}`;
    return svg(defs, body);
  }],
];
