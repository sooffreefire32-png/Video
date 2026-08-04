import { C, L, R, rect, circ, ell, poly, pth, line, txt, dust, person, car, truck, tag, coins, bars, svg } from "./gen-finance-assets.js";

const sky = (t = "night") => {
  if (t === "dusk") return `<rect width="1280" height="720" fill="url(#skyD)"/>`;
  if (t === "day") return `<rect width="1280" height="720" fill="url(#skyDay)"/>`;
  return `<rect width="1280" height="720" fill="url(#skyN)"/>`;
};

export const SCENES_A = [
  /* BEAT 1 — broken car on highway at night */
  ["beat01", () => {
    const defs = `${L("skyN", C.navy3, C.navy2, 90)}${R("glow", "rgba(251,191,36,0.35)", "rgba(251,191,36,0)")}${R("hl", "rgba(253,230,138,0.9)", "rgba(253,230,138,0)")}`;
    const body = `${sky()}
${rect(0, 470, 1280, 250, "#0a1128")}
${rect(0, 500, 1280, 30, "#1a2a55")}
${line(0, 660, 1280, 660, "#fde68a", 4, 'stroke-dasharray="40 26" opacity="0.7"')}
${car(430, 400, { color: "#94a3b8" })}
${rect(470, 330, 14, 70, C.navy3)}
${pth("M 477 330 l 26 12 l -26 12 Z", "#e2e8f0", 'opacity="0.85"')}
${circ(540, 360, 10, "#fff", 'opacity="0.95"')}
${ell(540, 368, 4, 7, "#fde68a")}
${person(320, 420, { shirt: C.navy, hair: "#201a17", scale: 1.15 })}
${txt(318, 350, "??", C.goldLight, 52)}
${ell(980, 300, 220, 130, "url(#glow)", 'opacity="0.5"')}
${dust(46)}`;
    return svg(defs, body);
  }],

  /* BEAT 2 — dealership exterior at dusk */
  ["beat02", () => {
    const defs = `${L("skyD", "#4a1d0e", "#b45309", 90)}${L("glass", "#f59e0b", "#fbbf24", 0)}${R("showGlow", "rgba(253,230,138,0.55)", "rgba(253,230,138,0)")}`;
    const body = `${sky("dusk")}
${circ(1050, 150, 60, "#fde68a", 'opacity="0.95"')}
${rect(0, 480, 1280, 240, "#241a14")}
${rect(120, 210, 1040, 300, "#3b2415", 12)}
${rect(150, 240, 480, 270, "url(#glass)", 8)}
${Array.from({ length: 5 }, (_, i) => rect(170 + i * 92, 262, 54, 30, "#fff", 4, 'opacity="0.7"')).join("")}
${rect(680, 260, 460, 120, "#7c2d12", 8)}
${rect(700, 280, 150, 24, "#fde68a", 4)}
${car(700, 330, { color: "#1e40af" })}
${ell(560, 460, 300, 90, "url(#showGlow)", 'opacity="0.6"')}
${txt(640, 240, "BOB MOTORS", C.goldLight, 44)}
${person(620, 480, { shirt: C.navy, hair: "#201a17", scale: 1.25, arm: "up" })}
${dust(40, 21)}`;
    return svg(defs, body);
  }],

  /* BEAT 3 — dealer office, 6.9% circled in red */
  ["beat03", () => {
    const defs = `${L("wall", "#f3ead6", "#e8dcc0", 90)}${R("lamp", "rgba(251,191,36,0.4)", "rgba(251,191,36,0)")}`;
    const body = `<rect width="1280" height="720" fill="url(#wall)"/>
${rect(0, 520, 1280, 200, "#c9b890")}
${rect(140, 420, 1000, 18, "#8b6f47")}
${rect(200, 180, 880, 260, "#fffdf6", 10)}
${rect(230, 210, 340, 40, C.navy, 6)}
${txt(400, 240, "PURCHASE AGREEMENT", "#fff", 26)}
${rect(240, 280, 620, 8, "#d6cbb0")}
${rect(240, 306, 460, 8, "#d6cbb0")}
${rect(240, 332, 540, 8, "#d6cbb0")}
${txt(600, 402, "APR 6.9%", C.redDark, 46)}
${ell(600, 404, 210, 78, "none", 'stroke="#dc2626" stroke-width="7"')}
${rect(330, 452, 620, 22, "#b45309", 6)}
${person(240, 560, { shirt: "#1e3a8a", hair: "#201a17", scale: 1.2 })}
${person(1020, 560, { shirt: "#111827", hair: "#57534e", scale: 1.2, arm: "up" })}
${dust(34, 13)}`;
    return svg(defs, body);
  }],

  /* BEAT 4 — hand signing, truck through window */
  ["beat04", () => {
    const defs = `${L("wall", "#f3ead6", "#e6d9ba", 90)}${R("winGlow", "rgba(253,230,138,0.5)", "rgba(253,230,138,0)")}`;
    const body = `<rect width="1280" height="720" fill="url(#wall)"/>
${rect(700, 60, 500, 380, "#16254d", 10)}
${rect(730, 90, 440, 320, "#1e3a5f", 6)}
${truck(800, 220, { color: "#b45309", w: 300, h: 110 })}
${rect(1040, 130, 130, 70, "#fff", 6)}
${txt(1105, 172, "$35,000", C.redDark, 30)}
${rect(180, 400, 900, 22, "#8b6f47")}
${rect(120, 150, 760, 300, "#fffdf6", 12)}
${rect(160, 200, 640, 10, "#d6cbb0")}
${rect(160, 230, 520, 10, "#d6cbb0")}
${rect(160, 260, 680, 10, "#d6cbb0")}
${rect(160, 290, 400, 10, "#d6cbb0")}
${ell(420, 420, 90, 46, "url(#hand)", 'transform="rotate(-18 420 420)"')}
${rect(430, 440, 120, 14, "#7c2d12", 7, 'transform="rotate(10 490 447)"')}
${txt(640, 620, "SIGN HERE ➜", C.navy, 30)}
${dust(36, 27)}`;
    return svg(defs, body);
  }],

  /* BEAT 5 — calculator chalkboard */
  ["beat05", () => {
    const defs = `${L("board", "#1e3a5f", "#16254d", 90)}`;
    const body = `<rect width="1280" height="720" fill="#0e1b3e"/>
${rect(240, 90, 800, 400, "url(#board)", 16)}
${line(300, 180, 980, 180, C.goldLight, 5)}
${txt(640, 260, "6.9%  ×  72 months", C.goldLight, 58)}
${line(300, 300, 980, 300, C.goldLight, 5)}
${rect(520, 330, 240, 90, "#0a1330", 8)}
${txt(640, 390, "$8,080", "#fbbf24", 42)}
${rect(280, 540, 240, 60, C.gray, 10)}
${rect(560, 540, 200, 60, "#f5f5f4", 10)}
${rect(800, 540, 180, 60, C.red, 10)}
${circ(320, 660, 6, C.goldLight, 'opacity="0.7"')}
${circ(760, 660, 8, C.goldLight, 'opacity="0.6"')}
${dust(40, 5)}`;
    return svg(defs, body);
  }],

  /* BEAT 6 — giant red $8,000 tag over car */
  ["beat06", () => {
    const defs = `${L("skyN", C.navy3, C.navy2, 90)}${R("spot", "rgba(251,191,36,0.45)", "rgba(251,191,36,0)")}`;
    const body = `${sky()}
${rect(0, 520, 1280, 200, "#0a1128")}
${ell(640, 500, 500, 200, "url(#spot)", 'opacity="0.55"')}
${truck(430, 420, { color: "#7c2d12" })}
${tag(500, 120, "$8,000", C.red, 'transform="rotate(-8 595 164)"')}
${circ(700, 120, 26, C.red, 'stroke="#fff" stroke-width="5"')}
${dust(44, 9)}`;
    return svg(defs, body);
  }],

  /* BEAT 7 — new truck with shrinking value bar */
  ["beat07", () => {
    const defs = `${L("skyN", C.navy3, C.navy2, 90)}`;
    const body = `${sky()}
${rect(0, 500, 1280, 220, "#0a1128")}
${truck(120, 380, { color: "#b45309", w: 300 })}
${rect(760, 240, 90, 300, "#1a2a55", 8)}
${rect(775, 380, 60, 160, C.red, 6)}
${rect(775, 380, 60, 6, "rgba(255,255,255,0.4)", 3)}
${rect(900, 240, 90, 300, "#1a2a55", 8)}
${rect(915, 460, 60, 80, "#b45309", 6)}
${txt(810, 215, "NEW", C.cream, 30)}
${txt(945, 215, "1 YR", C.cream, 30)}
${line(640, 200, 640, 560, C.goldLight, 5)}
${pth("M 700 220 l -26 0 q -8 30 -4 62 l 6 90 q 4 40 -2 84", "none", 'stroke="#dc2626" stroke-width="7" stroke-linecap="round"')}
${dust(38, 31)}`;
    return svg(defs, body);
  }],

  /* BEAT 8 — split illustration $28K → $21K */
  ["beat08", () => {
    const defs = `${L("g2r", C.green, C.red, 0)}${L("skyN", C.navy3, C.navy2, 90)}`;
    const body = `${sky()}
${rect(0, 460, 1280, 260, "#0a1128")}
${truck(90, 340, { color: "#475569", w: 260 })}
${truck(700, 340, { color: "#7c2d12", w: 260 })}
${rect(150, 130, 120, 220, "#14532d", 8)}
${txt(210, 110, "YEAR 1", C.green, 32)}
${txt(210, 320, "$28K", "#fff", 44)}
${rect(760, 250, 120, 100, "#991b1b", 8)}
${txt(820, 230, "YEAR 3", C.red, 32)}
${txt(820, 320, "$21K", "#fff", 44)}
${rect(480, 300, 320, 12, "url(#g2r)", 6, 'opacity="0.9"')}
${dust(36, 17)}`;
    return svg(defs, body);
  }],

  /* BEAT 9 — truck sinking, anchor LOAN */
  ["beat09", () => {
    const defs = `${L("sea", "#0e3a5f", "#0a1c33", 90)}${L("skyN", "#3b1d0e", "#7c2d12", 90)}${R("bub", "rgba(255,255,255,0.35)", "rgba(255,255,255,0)")}`;
    const body = `${sky()}
${rect(0, 330, 1280, 390, "url(#sea)")}
${truck(400, 300, { color: "#991b1b", w: 300 })}
${ell(520, 250, 60, 18, "#0a1330", 'opacity="0.5"')}
${line(640, 140, 640, 380, C.goldLight, 8)}
${poly("600,140 680,140 640,196", "#e2e8f0")}
${circ(640, 220, 18, "#e2e8f0")}
${rect(616, 236, 48, 60, "#991b1b", 6)}
${rect(626, 244, 28, 20, "#fff", 3)}
${txt(640, 270, "LOAN", "#fff", 22)}
${line(600, 296, 680, 296, "#991b1b", 8)}
${line(600, 296, 588, 318, "#991b1b", 8)}
${line(680, 296, 692, 318, "#991b1b", 8)}
${circ(300, 500, 12, "url(#bub)")}
${circ(940, 600, 16, "url(#bub)")}
${circ(700, 640, 9, "url(#bub)")}
${dust(32, 23)}`;
    return svg(defs, body);
  }],

  /* BEAT 10 — cash side, paid in full, golden hour */
  ["beat10", () => {
    const defs = `${L("skyD", "#b45309", "#fbbf24", 90)}${R("sun", "rgba(253,230,138,0.9)", "rgba(253,230,138,0)")}`;
    const body = `${sky("dusk")}
${circ(640, 620, 130, "url(#sun)", 'opacity="0.7"')}
${rect(0, 540, 1280, 180, "#3b2415")}
${truck(150, 380, { color: "#1e40af", w: 320 })}
${rect(760, 420, 320, 90, "#fffdf6", 10)}
${rect(790, 445, 260, 12, "#d6cbb0")}
${rect(790, 472, 200, 12, "#d6cbb0")}
${coins(920, 520, 4, 30)}
${rect(240, 180, 380, 80, "#fffdf6", 10, 'transform="rotate(-6 430 220)"')}
${txt(430, 230, "PAID IN FULL", C.greenDark, 40, 'transform="rotate(-6 430 220)"')}
${dust(40, 11)}`;
    return svg(defs, body);
  }],

  /* BEAT 11 — savings jar with green up-arrow */
  ["beat11", () => {
    const defs = `${L("wall", "#faf5ea", "#f3ead6", 90)}${R("jarGlow", "rgba(22,163,74,0.3)", "rgba(22,163,74,0)")}`;
    const body = `<rect width="1280" height="720" fill="url(#wall)"/>
${ell(640, 470, 340, 60, "#e8dcc0")}
${pth("M 480 220 q -40 0 -40 60 l 20 190 q 6 30 60 30 l 240 0 q 54 0 60 -30 l 20 -190 q 0 -60 -40 -60 Z", "rgba(255,255,255,0.55)", 'stroke="#c9b890" stroke-width="6"')}
${rect(540, 400, 200, 90, "#e8dcc0", 8)}
${coins(640, 380, 6, 46)}
${pth("M 640 180 l -44 74 l 28 0 l 0 60 l 32 0 l 0 -60 l 28 0 Z", C.green)}
${txt(640, 160, "+", C.greenDark, 60)}
${txt(640, 640, "savings keep earning", C.navy, 34)}
${dust(40, 19)}`;
    return svg(defs, body);
  }],
];
