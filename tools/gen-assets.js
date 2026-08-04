#!/usr/bin/env node
/**
 * KalKatha Toons — Chroma Toons–style flat vector art generator.
 * Generates ALL original scene backgrounds + character cards as SVGs.
 * No copyrighted images: every pixel is drawn here.
 *
 * Run: bun tools/gen-assets.js
 * Output: public/assets/*.svg
 */
import fs from "fs";
import path from "path";

const __dirname = import.meta.dirname;

const OUT = path.join(__dirname, "..", "public", "assets");
fs.mkdirSync(OUT, { recursive: true });

/* ---------------------------- palette helpers ---------------------------- */
const C = {
  night1: "#0a0f1e", night2: "#16213e",
  night3: "#1b2a4a", dusk1: "#2a1a3e", dusk2: "#5a2a4a",
  gold: "#fbbf24", goldDeep: "#d97706", goldLight: "#fde68a",
  red: "#ef4444", redDeep: "#b91c1c",
  cyan: "#22d3ee", cyanDeep: "#0e7490",
  skin: "#e8b48c", skinDark: "#c98a5a",
  kurta: "#1d4ed8", jeans: "#1e3a5f",
  saree: "#ea580c", sareeB: "#fbbf24",
  khaki: "#a16207", white: "#f5f5f4",
  silver: "#e2e8f0", ink: "#1c1917",
  green: "#16a34a", greenDeep: "#0f6b34",
};

function lin(id, c1, c2, x1 = 0, y1 = 0, x2 = 0, y2 = 1) {
  return `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>`;
}
function rad(id, c1, c2) {
  return `<radialGradient id="${id}"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></radialGradient>`;
}
const rect = (x, y, w, h, fill, rx = 0, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
const circ = (cx, cy, r, fill, extra = "") => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${extra}/>`;
const ellipse = (cx, cy, rx, ry, fill, extra = "") => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;
const poly = (pts, fill, extra = "") => `<polygon points="${pts}" fill="${fill}" ${extra}/>`;

function sky(type) {
  const g = type === "night" ? lin("sky", C.night1, C.night2)
    : type === "dusk" ? lin("sky", C.dusk1, C.dusk2)
    : type === "cyber" ? lin("sky", "#0b0620", "#1b1038")
    : lin("sky", "#fbbf24", "#7c2d12");
  return { defs: g, body: rect(0, 0, 640, 360, "url(#sky)") };
}

function stars(n, seed = 3) {
  let s = "";
  let r = seed;
  const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < n; i++) {
    s += circ(20 + rnd() * 600, 10 + rnd() * 120, 0.8 + rnd() * 1.4, "#e2e8f0", `opacity="${0.3 + rnd() * 0.7}"`);
  }
  return s;
}

const rain = (n = 26) => {
  let s = "";
  for (let i = 0; i < n; i++) {
    const x = (i * 37) % 640, y = (i * 53) % 360;
    s += `<line x1="${x}" y1="${y}" x2="${x - 4}" y2="${y + 14}" stroke="#7dd3fc" stroke-width="1.2" opacity="0.35"/>`;
  }
  return s;
};

/* ---------------------------- character figure ---------------------------- */
function figure(o) {
  const { x, y, skin = C.skin, hair, top, bottom, scale = 1, mood = "worried", flip = 1 } = o;
  const S = (v) => v * scale;
  const s = [];
  // legs
  s.push(rect(x - S(14), y - S(14), S(11), S(46), bottom || "#22303f", S(4)));
  s.push(rect(x + S(3), y - S(14), S(11), S(46), bottom || "#22303f", S(4)));
  // shoes
  s.push(ellipse(x - S(9), y + S(32), S(12), S(6), "#3b3b3b"));
  s.push(ellipse(x + S(9), y + S(32), S(12), S(6), "#3b3b3b"));
  // torso
  s.push(rect(x - S(26), y - S(52), S(52), S(44), top, S(12)));
  // arms
  s.push(rect(x - S(34), y - S(48), S(12), S(38), top, S(6), `transform="rotate(${mood === "run" ? -30 : 8} ${x - S(28)} ${y - S(48)})"`));
  s.push(rect(x + S(22), y - S(48), S(12), S(38), top, S(6), `transform="rotate(${mood === "run" ? 30 : -8} ${x + S(28)} ${y - S(48)})"`));
  // hands
  s.push(circ(x - S(28), y - S(10), S(6), skin));
  s.push(circ(x + S(28), y - S(10), S(6), skin));
  // neck + head
  s.push(rect(x - S(6), y - S(60), S(12), S(10), skin));
  s.push(circ(x, y - S(78), S(24), skin));
  // hair
  if (hair) {
    s.push(ellipse(x, y - S(84), S(25), S(18), hair));
    s.push(rect(x - S(25), y - S(82), S(50), S(12), hair, S(6)));
    if (flip > 0) s.push(circ(x + S(14), y - S(92), S(7), hair));
  }
  // eyes
  const ey = y - S(80);
  const brow = mood === "shock" ? `opacity="0"` : "";
  s.push(`<line x1="${x - S(9)}" y1="${ey - S(7)}" x2="${x - S(3)}" y2="${ey - S(7)}" stroke="#1c1917" stroke-width="2.4" ${brow}/>`);
  s.push(`<line x1="${x + S(3)}" y1="${ey - S(7)}" x2="${x + S(9)}" y2="${ey - S(7)}" stroke="#1c1917" stroke-width="2.4" ${brow}/>`);
  if (mood === "shock") {
    s.push(circ(x - S(6), ey, S(4.4), "#fff"));
    s.push(circ(x + S(6), ey, S(4.4), "#fff"));
    s.push(circ(x - S(6), ey, S(2), "#1c1917"));
    s.push(circ(x + S(6), ey, S(2), "#1c1917"));
  } else {
    s.push(circ(x - S(6), ey, S(2.6), "#1c1917"));
    s.push(circ(x + S(6), ey, S(2.6), "#1c1917"));
  }
  // mouth
  if (mood === "grin") s.push(ellipse(x, y - S(68), S(7), S(5), "#7f1d1d"));
  else if (mood === "sad") s.push(`<path d="M ${x - S(6)} ${y - S(66)} q ${S(6)} ${S(5)} ${S(12)} 0" stroke="#7f1d1d" stroke-width="2.4" fill="none" stroke-linecap="round"/>`);
  else s.push(`<path d="M ${x - S(5)} ${y - S(66)} q ${S(5)} ${S(4)} ${S(10)} 0" stroke="#7f1d1d" stroke-width="2.4" fill="none" stroke-linecap="round"/>`);
  // blush
  if (mood === "sad") {
    s.push(ellipse(x - S(14), y - S(74), S(3.4), S(2), "#fca5a5", `opacity="0.6"`));
    s.push(ellipse(x + S(14), y - S(74), S(3.4), S(2), "#fca5a5", `opacity="0.6"`));
  }
  return s.join("");
}

/* ---------------------------- SVG shell ---------------------------- */
function svg(w, h, defs, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs>${defs}</defs>
${body}
</svg>`;
}

const files = {};
function add(name, content) { files[name] = content; }

/* ============================ SCENE: STREET NIGHT ============================ */
add("street-night.svg", (() => {
  const k = sky("night");
  const body = `${k.body}
${stars(60)}
<rect x="0" y="240" width="640" height="120" fill="#0d1424"/>
<rect x="120" y="260" width="640" height="100" fill="#1a2340" transform="skewX(-18)"/>
<rect x="0" y="252" width="120" height="108" fill="#131c33"/>
<rect x="30" y="210" width="60" height="42" fill="#0e1730"/>
<rect x="34" y="216" width="14" height="12" fill="#fbbf24" opacity="0.5"/>
<rect x="56" y="216" width="14" height="12" fill="#fbbf24" opacity="0.5"/>
<rect x="520" y="240" width="120" height="120" fill="#131c33"/>
<rect x="530" y="180" width="52" height="60" fill="#0e1730"/>
<rect x="536" y="188" width="12" height="12" fill="#fbbf24" opacity="0.5"/>
<rect x="556" y="188" width="12" height="12" fill="#fbbf24" opacity="0.5"/>
<rect x="240" y="300" width="400" height="60" fill="#0a0f1e"/>
<rect x="0" y="330" width="640" height="30" fill="#080c18"/>
<line x1="240" y1="300" x2="620" y2="300" stroke="#2b3a5c" stroke-width="2"/>
<!-- ATM booth -->
<rect x="432" y="196" width="96" height="112" fill="#7f1d1d" rx="4"/>
<rect x="436" y="200" width="88" height="40" fill="#1e1b4b" rx="3"/>
<rect x="442" y="206" width="76" height="26" fill="#fef3c7" rx="2" opacity="0.95"/>
<rect x="448" y="210" width="30" height="4" fill="#1e293b" opacity="0.7"/>
<rect x="448" y="218" width="44" height="4" fill="#1e293b" opacity="0.7"/>
<rect x="448" y="226" width="22" height="4" fill="#1e293b" opacity="0.7"/>
<rect x="444" y="252" width="72" height="10" fill="#fbbf24" opacity="0.85"/>
<rect x="444" y="270" width="72" height="28" fill="#b91c1c" rx="3"/>
<line x1="444" y1="278" x2="516" y2="278" stroke="#7f1d1d" stroke-width="3"/>
<rect x="468" y="284" width="24" height="10" fill="#65a30d" rx="2"/>
<!-- booth glow -->
<ellipse cx="480" cy="300" rx="90" ry="26" fill="url(#glowAtm)"/>
<circle cx="480" cy="236" r="46" fill="url(#glowSoft)" opacity="0.5"/>
<!-- lamp -->
<rect x="180" y="150" width="5" height="150" fill="#334155"/>
<path d="M 182 150 q 0 -14 26 -10" stroke="#334155" stroke-width="5" fill="none"/>
<ellipse cx="210" cy="150" rx="16" ry="5" fill="#fde68a"/>
<ellipse cx="210" cy="160" rx="60" ry="34" fill="url(#lampGlow)" opacity="0.4"/>
${rain()}`;
  return svg(640, 360,
    `${k.defs}${rad("glowAtm", "rgba(251,191,36,0.55)", "rgba(251,191,36,0)")}${rad("glowSoft", "rgba(253,230,138,0.5)", "rgba(253,230,138,0)")}${rad("lampGlow", "rgba(253,230,138,0.5)", "rgba(253,230,138,0)")}`,
    body);
})());

/* ============================ SCENE: ATM CLOSEUP ============================ */
add("atm-closeup.svg", (() => {
  const k = sky("night");
  const body = `${k.body}
<rect x="0" y="0" width="640" height="360" fill="url(#redGlow)" opacity="0.35"/>
<rect x="70" y="52" width="500" height="252" fill="#1e1b4b" rx="14"/>
<rect x="86" y="68" width="468" height="150" fill="#fef3c7" rx="8"/>
<rect x="96" y="80" width="90" height="12" fill="#1e293b" opacity="0.8"/>
<rect x="96" y="100" width="150" height="12" fill="#1e293b" opacity="0.5"/>
<rect x="96" y="120" width="120" height="12" fill="#1e293b" opacity="0.5"/>
<rect x="96" y="140" width="200" height="12" fill="#1e293b" opacity="0.35"/>
<rect x="96" y="166" width="300" height="22" fill="#b91c1c" rx="4"/>
<text x="246" y="182" font-family="DejaVu Sans, sans-serif" font-size="17" font-weight="bold" fill="#fee2e2" text-anchor="middle">TRANSACTION FROM TOMORROW</text>
<rect x="120" y="236" width="400" height="26" fill="#0f172a" rx="4"/>
<rect x="150" y="242" width="34" height="6" fill="#22d3ee" opacity="0.9"/>
<rect x="194" y="242" width="90" height="6" fill="#22d3ee" opacity="0.6"/>
<rect x="294" y="242" width="60" height="6" fill="#22d3ee" opacity="0.4"/>
<rect x="150" y="280" width="86" height="12" fill="#334155" rx="2"/>
<rect x="250" y="278" width="120" height="16" fill="#0f766e" rx="3"/>
<rect x="250" y="278" width="40" height="16" fill="#fbbf24" rx="3"/>
<rect x="296" y="278" width="34" height="16" fill="#16a34a" rx="3"/>
<rect x="332" y="278" width="38" height="16" fill="#94a3b8" rx="3"/>
<ellipse cx="320" cy="150" rx="230" ry="120" fill="url(#redGlow2)" opacity="0.25"/>`;
  return svg(640, 360,
    `${k.defs}${rad("redGlow", "rgba(239,68,68,0.5)", "rgba(239,68,68,0)")}${rad("redGlow2", "rgba(239,68,68,0.4)", "rgba(239,68,68,0)")}`,
    body);
})());

/* ============================ SCENE: ROOM NIGHT ============================ */
add("room-night.svg", (() => {
  const k = sky("night");
  const body = `${k.body}
<rect x="0" y="0" width="640" height="360" fill="#10182e"/>
<rect x="430" y="40" width="150" height="110" fill="#0e1730" rx="4"/>
<circle cx="520" cy="70" r="16" fill="#fde68a" opacity="0.9"/>
<circle cx="514" cy="66" r="5" fill="#e8b48c"/>
<rect x="438" y="150" width="134" height="8" fill="#1a2340"/>
<rect x="300" y="0" width="10" height="26" fill="#334155"/>
<rect x="296" y="24" width="18" height="130" fill="#fde68a" opacity="0.85"/>
<ellipse cx="305" cy="160" rx="120" ry="60" fill="url(#lightGlow)" opacity="0.35"/>
<!-- bed + amma -->
<rect x="70" y="190" width="250" height="110" fill="#3b3b3b" rx="10"/>
<rect x="70" y="150" width="250" height="50" fill="#7c6a4f" rx="10"/>
<rect x="70" y="150" width="250" height="18" fill="#fef3c7" opacity="0.9" rx="8"/>
<ellipse cx="120" cy="205" rx="34" ry="24" fill="url(#ammaHead)"/>
<ellipse cx="120" cy="212" rx="24" ry="10" fill="#d6d3d1"/>
<rect x="80" y="212" width="26" height="8" fill="#d6d3d1" rx="4"/>
${figure({ x: 120, y: 212, skin: C.skin, hair: "#cbd5e1", top: C.saree, bottom: "#7c2d12", scale: 0.9, mood: "sad", flip: -1 }).replace(/<rect x="9[0-9]"/g, "").replace(/<circle cx="1[0-4][0-9]"/g, "")}
<rect x="70" y="255" width="250" height="45" fill="#6b5a3e"/>
<rect x="110" y="160" width="40" height="26" fill="#1e293b" rx="4"/>
<rect x="116" y="168" width="28" height="8" fill="#fbbf24" opacity="0.6"/>
<rect x="480" y="270" width="60" height="80" fill="#2a3550"/>
<rect x="490" y="280" width="14" height="18" fill="#16a34a" rx="2"/>
<rect x="510" y="280" width="14" height="18" fill="#ef4444" rx="2"/>
<rect x="500" y="306" width="12" height="16" fill="#fbbf24" rx="2"/>
<rect x="0" y="310" width="640" height="50" fill="#0a0f1e"/>`;
  return svg(640, 360,
    `${k.defs}${rad("lightGlow", "rgba(253,230,138,0.5)", "rgba(253,230,138,0)")}${rad("ammaHead", C.skin, C.skinDark)}`,
    body);
})());

/* ============================ SCENE: ATM BOOTH ============================ */
add("atm-booth.svg", (() => {
  const k = sky("night");
  const body = `${k.body}
${stars(40)}
<rect x="0" y="250" width="640" height="110" fill="#0d1424"/>
<rect x="60" y="240" width="520" height="30" fill="#0e1730"/>
<rect x="0" y="268" width="640" height="8" fill="#26335a"/>
<!-- booth -->
<rect x="180" y="90" width="280" height="180" fill="#7f1d1d" rx="6"/>
<rect x="190" y="60" width="260" height="34" fill="#1e3a8a" rx="4"/>
<text x="320" y="83" font-family="DejaVu Sans, sans-serif" font-size="18" font-weight="bold" fill="#fef3c7" text-anchor="middle">MAHALAKSHMI BANK</text>
<text x="320" y="60" font-family="DejaVu Sans, sans-serif" font-size="11" fill="#93c5fd" text-anchor="middle">BRANCH 13</text>
<rect x="196" y="102" width="248" height="120" fill="#1e1b4b" rx="6"/>
<rect x="204" y="110" width="232" height="104" fill="#fef3c7" rx="4"/>
<rect x="214" y="122" width="60" height="10" fill="#1e293b" opacity="0.8"/>
<rect x="214" y="140" width="100" height="10" fill="#1e293b" opacity="0.5"/>
<text x="320" y="176" font-family="DejaVu Sans, sans-serif" font-size="20" font-weight="bold" fill="#b91c1c" text-anchor="middle">12:00 AM</text>
<rect x="214" y="196" width="130" height="10" fill="#1e293b" opacity="0.35"/>
<rect x="206" y="232" width="228" height="8" fill="#fbbf24"/>
<rect x="206" y="248" width="228" height="16" fill="#0f172a" rx="3"/>
<rect x="206" y="248" width="60" height="16" fill="#fbbf24" rx="3"/>
<ellipse cx="320" cy="240" rx="150" ry="40" fill="url(#boothGlow)" opacity="0.5"/>
${figure({ x: 130, y: 262, skin: C.skin, hair: "#201a17", top: C.kurta, bottom: C.jeans, scale: 1.1, mood: "worried", flip: 1 })}
<rect x="420" y="236" width="90" height="70" fill="#1a2340"/>
${rain(18)}`;
  return svg(640, 360,
    `${k.defs}${rad("boothGlow", "rgba(251,191,36,0.55)", "rgba(251,191,36,0)")}`,
    body);
})());

/* ============================ SCENE: NOTE CLOSEUP ============================ */
add("note-closeup.svg", (() => {
  const k = sky("night");
  const body = `${k.body}
<ellipse cx="320" cy="180" rx="280" ry="160" fill="url(#noteGlow)" opacity="0.5"/>
<!-- hand -->
<ellipse cx="120" cy="280" rx="80" ry="46" fill="url(#handSkin)" transform="rotate(-20 120 280)"/>
<rect x="150" y="300" width="60" height="14" rx="7" fill="#c98a5a" transform="rotate(24 150 300)"/>
<!-- note -->
<rect x="150" y="80" width="340" height="210" fill="#0f6b34" rx="14" transform="rotate(-6 320 185)"/>
<rect x="166" y="96" width="308" height="178" fill="#16a34a" rx="10" transform="rotate(-6 320 185)"/>
<rect x="180" y="110" width="280" height="150" fill="#f0fdf4" rx="8" transform="rotate(-6 320 185)"/>
<circle cx="210" cy="150" r="26" fill="#16a34a" opacity="0.15"/>
<circle cx="430" cy="210" r="26" fill="#16a34a" opacity="0.15"/>
<text x="320" y="170" font-family="DejaVu Sans, sans-serif" font-size="64" font-weight="bold" fill="#166534" text-anchor="middle" transform="rotate(-6 320 185)">₹</text>
<text x="320" y="196" font-family="DejaVu Sans, sans-serif" font-size="16" fill="#166534" text-anchor="middle" transform="rotate(-6 320 185)">RESERVE BANK OF KAL</text>
<rect x="196" y="212" width="248" height="6" fill="#166534" opacity="0.5" transform="rotate(-6 320 185)"/>
<rect x="196" y="226" width="180" height="6" fill="#166534" opacity="0.5" transform="rotate(-6 320 185)"/>
<rect x="196" y="240" width="130" height="6" fill="#166534" opacity="0.5" transform="rotate(-6 320 185)"/>
<!-- tomorrow stamp -->
<rect x="330" y="120" width="120" height="56" fill="none" stroke="#b91c1c" stroke-width="5" rx="6" transform="rotate(18 390 148)"/>
<text x="390" y="156" font-family="DejaVu Sans, sans-serif" font-size="24" font-weight="bold" fill="#b91c1c" text-anchor="middle" transform="rotate(18 390 148)">01-01-2087</text>
<text x="390" y="104" font-family="DejaVu Sans, sans-serif" font-size="17" font-weight="bold" fill="#dc2626" text-anchor="middle" transform="rotate(-12 390 104)">KAL</text>`;
  return svg(640, 360,
    `${k.defs}${rad("noteGlow", "rgba(251,191,36,0.35)", "rgba(251,191,36,0)")}${rad("handSkin", C.skin, C.skinDark)}`,
    body);
})());

/* ============================ SCENE: PHARMACY ============================ */
add("pharmacy.svg", (() => {
  const k = sky("night");
  const body = `${k.body}
<rect x="0" y="0" width="640" height="360" fill="#141e33"/>
<rect x="40" y="90" width="560" height="200" fill="#1e293b" rx="10"/>
<rect x="60" y="70" width="60" height="34" fill="#16a34a" rx="6"/>
<rect x="74" y="80" width="32" height="14" fill="#f0fdf4" rx="2"/>
<rect x="56" y="78" width="8" height="8" fill="#16a34a"/><rect x="116" y="78" width="8" height="8" fill="#16a34a"/>
<rect x="56" y="100" width="8" height="8" fill="#16a34a"/><rect x="116" y="100" width="8" height="8" fill="#16a34a"/>
<!-- shelves -->
<rect x="70" y="120" width="120" height="90" fill="#26335a" rx="4"/>
<rect x="76" y="126" width="30" height="20" fill="#fbbf24" rx="2"/><rect x="112" y="126" width="30" height="20" fill="#22d3ee" rx="2"/><rect x="148" y="126" width="34" height="20" fill="#ef4444" rx="2"/>
<rect x="76" y="152" width="30" height="20" fill="#16a34a" rx="2"/><rect x="112" y="152" width="30" height="20" fill="#f59e0b" rx="2"/><rect x="148" y="152" width="34" height="20" fill="#a78bfa" rx="2"/>
<rect x="76" y="178" width="108" height="26" fill="#334155" rx="3"/>
<!-- counter -->
<rect x="250" y="240" width="340" height="60" fill="#78350f" rx="6"/>
<rect x="250" y="228" width="340" height="16" fill="#92400e" rx="4"/>
<!-- cashier -->
${figure({ x: 330, y: 250, skin: C.skin, hair: "#57534e", top: "#0e7490", bottom: "#0f172a", scale: 0.95, mood: "worried", flip: -1 })}
<!-- raghu -->
${figure({ x: 500, y: 260, skin: C.skin, hair: "#201a17", top: C.kurta, bottom: C.jeans, scale: 1.05, mood: "grin", flip: -1 })}
<rect x="470" y="210" width="40" height="26" fill="#0f6b34" rx="4" transform="rotate(-10 490 223)"/>
<rect x="472" y="212" width="36" height="10" fill="#f0fdf4" rx="2" transform="rotate(-10 490 223)"/>
<rect x="0" y="300" width="640" height="60" fill="#0a0f1e"/>`;
  return svg(640, 360, k.defs, body);
})());

/* ============================ SCENE: SHOP DUSK ============================ */
add("shop-dusk.svg", (() => {
  const k = sky("dusk");
  const body = `${k.body}
<circle cx="540" cy="80" r="34" fill="#fde68a" opacity="0.9"/>
<rect x="0" y="240" width="640" height="120" fill="#1c1230"/>
<rect x="60" y="110" width="520" height="140" fill="#2a1a3e" rx="8"/>
<rect x="80" y="90" width="480" height="24" fill="#7c2d12" rx="4"/>
<rect x="560" y="70" width="40" height="30" fill="#f59e0b" opacity="0.8" rx="3"/>
<rect x="100" y="126" width="70" height="50" fill="#334155" rx="4"/>
<rect x="106" y="132" width="28" height="14" fill="#fbbf24" rx="2"/><rect x="138" y="132" width="26" height="14" fill="#22d3ee" rx="2"/>
<rect x="106" y="152" width="26" height="14" fill="#ef4444" rx="2"/><rect x="136" y="152" width="28" height="14" fill="#a78bfa" rx="2"/>
<rect x="180" y="126" width="70" height="50" fill="#334155" rx="4"/>
<rect x="186" y="132" width="58" height="14" fill="#fde68a" rx="2"/>
<rect x="186" y="152" width="58" height="14" fill="#86efac" rx="2"/>
<rect x="260" y="126" width="70" height="50" fill="#334155" rx="4"/>
<rect x="266" y="132" width="30" height="14" fill="#f472b6" rx="2"/><rect x="300" y="132" width="24" height="14" fill="#fb923c" rx="2"/>
<!-- string lights -->
<path d="M 60 96 q 65 18 130 0 q 65 -18 130 0 q 65 18 130 0 q 65 -18 130 0" stroke="#7c2d12" stroke-width="2" fill="none"/>
<circle cx="90" cy="100" r="4" fill="#fde68a"/><circle cx="140" cy="105" r="4" fill="#fbbf24"/><circle cx="190" cy="100" r="4" fill="#fde68a"/><circle cx="240" cy="96" r="4" fill="#fbbf24"/><circle cx="290" cy="100" r="4" fill="#fde68a"/><circle cx="340" cy="105" r="4" fill="#fbbf24"/><circle cx="390" cy="100" r="4" fill="#fde68a"/><circle cx="440" cy="96" r="4" fill="#fbbf24"/><circle cx="490" cy="100" r="4" fill="#fde68a"/><circle cx="540" cy="104" r="4" fill="#fbbf24"/>
<!-- kalu chacha -->
${figure({ x: 260, y: 252, skin: C.skinDark, hair: "#e7e5e4", top: C.white, bottom: "#44403c", scale: 1.05, mood: "worried", flip: -1 })}
<circle cx="236" cy="176" r="7" fill="#fef3c7" opacity="0.9"/><circle cx="244" cy="176" r="7" fill="#fef3c7" opacity="0.9"/>
<rect x="232" y="182" width="16" height="3" fill="#78716c" rx="1.5"/>
<rect x="238" y="186" width="8" height="12" fill="#78716c" rx="2"/>
<!-- note in hand -->
<rect x="300" y="214" width="44" height="26" fill="#0f6b34" rx="4" transform="rotate(14 322 227)"/>
<rect x="302" y="216" width="40" height="8" fill="#f0fdf4" rx="2" transform="rotate(14 322 227)"/>
<text x="322" y="244" font-family="DejaVu Sans, sans-serif" font-size="12" fill="#fde68a" text-anchor="middle">"Beta... yeh note kal ka hai?"</text>
<rect x="0" y="300" width="640" height="60" fill="#140d26"/>`;
  return svg(640, 360, k.defs, body);
})());

/* ============================ SCENE: NEWSROOM ============================ */
add("newsroom.svg", (() => {
  const k = sky("night");
  const body = `${k.body}
<rect x="0" y="0" width="640" height="360" fill="#120a1e"/>
<rect x="0" y="0" width="640" height="360" fill="url(#redGlow)" opacity="0.4"/>
<!-- TV -->
<rect x="80" y="40" width="480" height="270" fill="#0f172a" rx="16"/>
<rect x="96" y="56" width="448" height="200" fill="#1e1b4b" rx="8"/>
<rect x="110" y="70" width="120" height="30" fill="#dc2626" rx="4"/>
<text x="170" y="91" font-family="DejaVu Sans, sans-serif" font-size="20" font-weight="bold" fill="#fff" text-anchor="middle">BREAKING</text>
<text x="320" y="130" font-family="DejaVu Sans, sans-serif" font-size="19" fill="#fca5a5" text-anchor="middle">SAARE KAL-DATE WALE NOTE ILLEGAL!</text>
<rect x="130" y="150" width="380" height="10" fill="#334155" opacity="0.6"/>
<rect x="130" y="168" width="300" height="10" fill="#334155" opacity="0.5"/>
<rect x="130" y="186" width="340" height="10" fill="#334155" opacity="0.4"/>
<rect x="96" y="256" width="448" height="34" fill="#111827"/>
<rect x="104" y="264" width="26" height="6" fill="#ef4444" rx="3"/><rect x="104" y="276" width="26" height="6" fill="#ef4444" rx="3"/>
<rect x="140" y="264" width="120" height="6" fill="#94a3b8" opacity="0.9" rx="3"/><rect x="140" y="276" width="200" height="6" fill="#94a3b8" opacity="0.7" rx="3"/>
<!-- phone pings -->
<rect x="520" y="40" width="70" height="130" fill="#0f172a" rx="8"/>
<circle cx="555" cy="60" r="6" fill="#22d3ee"/>
<rect x="528" y="74" width="54" height="8" fill="#334155" rx="3"/>
<rect x="528" y="88" width="40" height="8" fill="#334155" rx="3"/>
<circle cx="555" cy="112" r="6" fill="#ef4444"/>
<rect x="528" y="126" width="54" height="8" fill="#334155" rx="3"/>
<rect x="528" y="140" width="40" height="8" fill="#334155" rx="3"/>
<!-- siren flashes -->
<rect x="0" y="330" width="80" height="30" fill="#0f172a"/>
<circle cx="30" cy="318" r="10" fill="#ef4444" opacity="0.9"/><circle cx="56" cy="318" r="10" fill="#3b82f6" opacity="0.9"/>
<circle cx="30" cy="318" r="26" fill="url(#sirenGlow)" opacity="0.5"/>`;
  return svg(640, 360,
    `${k.defs}${rad("redGlow", "rgba(239,68,68,0.45)", "rgba(239,68,68,0)")}${rad("sirenGlow", "rgba(239,68,68,0.5)", "rgba(239,68,68,0)")}`,
    body);
})());

/* ============================ SCENE: CHASE NIGHT ============================ */
add("chase-night.svg", (() => {
  const k = sky("night");
  const body = `${k.body}
${stars(30)}
<rect x="0" y="250" width="640" height="110" fill="#0d1424"/>
<rect x="0" y="300" width="640" height="60" fill="#080c18"/>
<rect x="120" y="150" width="80" height="120" fill="#131c33"/>
<rect x="480" y="170" width="70" height="100" fill="#131c33"/>
<rect x="560" y="120" width="80" height="150" fill="#0e1730"/>
<!-- raghu running -->
${figure({ x: 180, y: 262, skin: C.skin, hair: "#201a17", top: C.kurta, bottom: C.jeans, scale: 1.1, mood: "run", flip: 1 })}
<!-- inspector -->
${figure({ x: 320, y: 266, skin: C.skinDark, hair: "#292524", top: C.khaki, bottom: "#3f3f46", scale: 1.12, mood: "shock", flip: 1 })}
<rect x="296" y="196" width="44" height="12" fill="#3f3f46" rx="3"/>
<rect x="380" y="230" width="46" height="10" fill="#7c2d12" rx="3" transform="rotate(38 403 235)"/>
<!-- flying notes -->
<rect x="120" y="180" width="34" height="20" fill="#0f6b34" rx="3" transform="rotate(-24 137 190)"/>
<rect x="200" y="160" width="30" height="18" fill="#16a34a" rx="3" transform="rotate(30 215 169)"/>
<rect x="250" y="200" width="30" height="18" fill="#0f6b34" rx="3" transform="rotate(-14 265 209)"/>
<rect x="160" y="220" width="28" height="17" fill="#16a34a" rx="3" transform="rotate(44 174 228)"/>
<text x="240" y="150" font-family="DejaVu Sans, sans-serif" font-size="15" font-weight="bold" fill="#fca5a5" text-anchor="middle">RUUK JAA!</text>
<ellipse cx="180" cy="120" rx="200" ry="60" fill="url(#carGlow)" opacity="0.35"/>
${rain(20)}`;
  return svg(640, 360,
    `${k.defs}${rad("carGlow", "rgba(251,191,36,0.35)", "rgba(251,191,36,0)")}`,
    body);
})());

/* ============================ SCENE: CITY 2087 ============================ */
add("city2087.svg", (() => {
  const k = sky("cyber");
  const body = `${k.body}
${stars(50)}
<circle cx="90" cy="60" r="26" fill="#22d3ee" opacity="0.8"/>
<!-- towers -->
<rect x="60" y="140" width="60" height="160" fill="#0e1b3e"/>
<rect x="140" y="90" width="80" height="210" fill="#12214d"/>
<rect x="240" y="60" width="100" height="240" fill="#0e1b3e"/>
<rect x="360" y="110" width="70" height="190" fill="#12214d"/>
<rect x="450" y="70" width="90" height="230" fill="#0e1b3e"/>
<rect x="560" y="150" width="60" height="150" fill="#12214d"/>
<!-- windows -->
${Array.from({ length: 6 }, (_, i) => `<rect x="${70 + i * 60}" y="150" width="10" height="10" fill="#22d3ee" opacity="0.7"/>`).join("")}
${Array.from({ length: 5 }, (_, i) => `<rect x="${150 + i * 70}" y="110" width="12" height="12" fill="#22d3ee" opacity="0.6"/>`).join("")}
${Array.from({ length: 4 }, (_, i) => `<rect x="${270 + i * 90}" y="90" width="14" height="14" fill="#fbbf24" opacity="0.8"/>`).join("")}
<!-- flying cars -->
<ellipse cx="200" cy="120" rx="26" ry="9" fill="#fbbf24" opacity="0.9"/>
<line x1="228" y1="120" x2="280" y2="104" stroke="#fbbf24" stroke-width="2" opacity="0.5"/>
<ellipse cx="430" cy="180" rx="22" ry="8" fill="#22d3ee" opacity="0.9"/>
<line x1="454" y1="180" x2="500" y2="166" stroke="#22d3ee" stroke-width="2" opacity="0.5"/>
<ellipse cx="330" cy="60" rx="20" ry="7" fill="#a78bfa" opacity="0.9"/>
<line x1="352" y1="60" x2="396" y2="50" stroke="#a78bfa" stroke-width="2" opacity="0.5"/>
<!-- 2087 -->
<text x="320" y="340" font-family="DejaVu Sans, sans-serif" font-size="64" font-weight="bold" fill="#22d3ee" text-anchor="middle" opacity="0.9">2087</text>
<rect x="0" y="300" width="640" height="60" fill="#070418"/>
<line x1="0" y1="300" x2="640" y2="300" stroke="#22d3ee" stroke-width="2" opacity="0.5"/>
${Array.from({ length: 20 }, (_, i) => `<line x1="${i * 32}" y1="300" x2="${i * 32 + 20}" y2="340" stroke="#22d3ee" stroke-width="1.5" opacity="0.3"/>`).join("")}`;
  return svg(640, 360, k.defs, body);
})());

/* ============================ SCENE: PORTAL ============================ */
add("portal.svg", (() => {
  const k = sky("cyber");
  const body = `${k.body}
${stars(35)}
<ellipse cx="320" cy="200" rx="170" ry="150" fill="url(#portalGlow)" opacity="0.6"/>
<circle cx="320" cy="200" r="110" fill="url(#portalSpin)"/>
${Array.from({ length: 9 }, (_, i) => `<path d="M 320 200 l ${Math.cos((i / 9) * Math.PI * 2) * 110} ${Math.sin((i / 9) * Math.PI * 2) * 110} l ${Math.cos((i / 9) * Math.PI * 2 + 1.2) * 40} ${Math.sin((i / 9) * Math.PI * 2 + 1.2) * 40} Z" fill="#fde68a" opacity="0.35"/>`).join("")}
<circle cx="320" cy="200" r="74" fill="#0b0620"/>
<circle cx="320" cy="200" r="60" fill="url(#portalCore)"/>
<!-- kavya stepping out -->
${figure({ x: 320, y: 300, skin: C.skin, hair: "#e2e8f0", top: C.silver, bottom: "#475569", scale: 1.15, mood: "worried", flip: 1 })}
<ellipse cx="320" cy="252" rx="34" ry="12" fill="#22d3ee" opacity="0.85"/>
<!-- light rays -->
${Array.from({ length: 6 }, (_, i) => `<path d="M 320 200 L ${320 + Math.cos(((i + 0.5) / 6) * Math.PI) * 340} ${200 + Math.sin(((i + 0.5) / 6) * Math.PI) * 240} L ${320 + Math.cos(((i + 0.5) / 6) * Math.PI) * 300} ${200 + Math.sin(((i + 0.5) / 6) * Math.PI) * 210} Z" fill="#fde68a" opacity="0.12"/>`).join("")}
<!-- timeline cracks -->
<path d="M 40 40 l 60 90 l -20 60" stroke="#ef4444" stroke-width="3" fill="none" opacity="0.6"/>
<path d="M 600 30 l -40 80 l 16 50" stroke="#ef4444" stroke-width="3" fill="none" opacity="0.6"/>
<text x="120" y="70" font-family="DejaVu Sans, sans-serif" font-size="13" fill="#fca5a5">TIME POLICE</text>`;
  return svg(640, 360,
    `${k.defs}${rad("portalGlow", "rgba(251,191,36,0.6)", "rgba(251,191,36,0)")}${rad("portalSpin", "rgba(251,191,36,0.9)", "rgba(34,211,238,0.15)")}${rad("portalCore", "rgba(34,211,238,0.8)", "rgba(11,6,32,0.9)")}`,
    body);
})());

/* ============================ SCENE: REFLECTION ============================ */
add("reflection.svg", (() => {
  const k = sky("night");
  const body = `${k.body}
<rect x="0" y="0" width="640" height="360" fill="#0b1026"/>
<!-- split frame -->
<rect x="20" y="30" width="600" height="300" fill="#0f172a" rx="12"/>
<rect x="34" y="44" width="280" height="272" fill="#131c33" rx="8"/>
<rect x="326" y="44" width="280" height="272" fill="#0e1b3e" rx="8"/>
<line x1="320" y1="40" x2="320" y2="320" stroke="#fbbf24" stroke-width="3" opacity="0.8"/>
<!-- raghu (present) -->
${figure({ x: 170, y: 250, skin: C.skin, hair: "#201a17", top: C.kurta, bottom: C.jeans, scale: 1.05, mood: "shock", flip: 1 })}
<text x="174" y="330" font-family="DejaVu Sans, sans-serif" font-size="14" fill="#93c5fd" text-anchor="middle">AAJ · 2026</text>
<!-- raghav (future) -->
${figure({ x: 470, y: 250, skin: C.skinDark, hair: "#e2e8f0", top: C.silver, bottom: "#475569", scale: 1.05, mood: "sad", flip: -1 })}
<rect x="440" y="180" width="60" height="16" fill="#22d3ee" opacity="0.85" rx="4"/>
<text x="466" y="330" font-family="DejaVu Sans, sans-serif" font-size="14" fill="#67e8f9" text-anchor="middle">KAL · 2087</text>
<!-- timeline cracks -->
${Array.from({ length: 6 }, (_, i) => `<path d="M ${80 + i * 100} 320 l ${14} ${26} l ${-6} ${14}" stroke="#ef4444" stroke-width="2.4" fill="none" opacity="0.7"/>`).join("")}
<text x="320" y="60" font-family="DejaVu Sans, sans-serif" font-size="15" fill="#fca5a5" text-anchor="middle">"WO AADMI... TU HAI, RAGHU."</text>`;
  return svg(640, 360, k.defs, body);
})());

/* ============================ SCENE: CHOICE NIGHT ============================ */
add("choice-night.svg", (() => {
  const k = sky("night");
  const body = `${k.body}
${stars(25)}
<rect x="0" y="250" width="640" height="110" fill="#0d1424"/>
<!-- ATM back -->
<rect x="380" y="130" width="150" height="140" fill="#7f1d1d" rx="6"/>
<rect x="392" y="100" width="126" height="34" fill="#1e3a8a" rx="4"/>
<rect x="396" y="140" width="118" height="80" fill="#1e1b4b" rx="5"/>
<rect x="404" y="148" width="102" height="64" fill="#fef3c7" rx="3"/>
<text x="455" y="180" font-family="DejaVu Sans, sans-serif" font-size="15" font-weight="bold" fill="#b91c1c" text-anchor="middle">12:00 AM</text>
<ellipse cx="455" cy="220" rx="90" ry="26" fill="url(#choiceGlow)" opacity="0.5"/>
<!-- raghu from behind -->
${figure({ x: 220, y: 264, skin: C.skin, hair: "#201a17", top: C.kurta, bottom: C.jeans, scale: 1.15, mood: "sad", flip: -1 }).replace(/<circle cx="22[0-9]" cy="18[0-9]"/g, "<circle cx='999' cy='999'")}
<ellipse cx="220" cy="176" rx="26" ry="18" fill="#201a17"/>
<rect x="180" y="196" width="80" height="64" fill="#b45309" rx="6"/>
<rect x="188" y="204" width="64" height="10" fill="#0f6b34" rx="3"/>
<rect x="188" y="220" width="48" height="10" fill="#16a34a" rx="3"/>
<rect x="188" y="236" width="56" height="10" fill="#0f6b34" rx="3"/>
<text x="220" y="150" font-family="DejaVu Sans, sans-serif" font-size="15" fill="#fde68a" text-anchor="middle">PAISA... YA AMMA?</text>
<!-- phone glow -->
<rect x="80" y="190" width="40" height="60" fill="#0f172a" rx="6"/>
<rect x="86" y="200" width="28" height="30" fill="#22d3ee" opacity="0.6" rx="3"/>
<ellipse cx="100" cy="240" rx="50" ry="30" fill="url(#phoneGlow)" opacity="0.4"/>
${rain(16)}`;
  return svg(640, 360,
    `${k.defs}${rad("choiceGlow", "rgba(251,191,36,0.5)", "rgba(251,191,36,0)")}${rad("phoneGlow", "rgba(34,211,238,0.5)", "rgba(34,211,238,0)")}`,
    body);
})());

/* ============================ SCENE: TEARING NOTES ============================ */
add("tearing-notes.svg", (() => {
  const k = sky("night");
  const body = `${k.body}
<ellipse cx="320" cy="200" rx="280" ry="150" fill="url(#tearGlow)" opacity="0.35"/>
<!-- hands -->
<ellipse cx="220" cy="180" rx="70" ry="42" fill="url(#handSkin)" transform="rotate(-24 220 180)"/>
<ellipse cx="420" cy="180" rx="70" ry="42" fill="url(#handSkin)" transform="rotate(24 420 180)"/>
<!-- torn note -->
<rect x="230" y="140" width="180" height="110" fill="#0f6b34" rx="10"/>
<rect x="242" y="152" width="156" height="86" fill="#16a34a" rx="7"/>
<path d="M 242 152 L 398 238 L 398 152 Z" fill="#0f6b34"/>
<path d="M 242 152 L 242 238 L 398 238 Z" fill="#0c5829"/>
<line x1="242" y1="152" x2="398" y2="238" stroke="#fde68a" stroke-width="4" stroke-dasharray="8 6"/>
<rect x="270" y="170" width="90" height="14" fill="#f0fdf4" opacity="0.9" rx="2" transform="rotate(-28 315 177)"/>
<rect x="280" y="196" width="70" height="10" fill="#f0fdf4" opacity="0.8" rx="2" transform="rotate(-28 315 201)"/>
<!-- flying scraps -->
${Array.from({ length: 8 }, (_, i) => `<rect x="${40 + i * 70}" y="${60 + ((i * 37) % 80)}" width="26" height="16" fill="#16a34a" rx="3" transform="rotate(${(i - 4) * 16} ${40 + i * 70 + 13} ${60 + ((i * 37) % 80) + 8})"/>`).join("")}
<text x="320" y="80" font-family="DejaVu Sans, sans-serif" font-size="17" font-weight="bold" fill="#fde68a" text-anchor="middle">KAL KA PAISA, AAJ KI BAARISH MEIN</text>
${rain(18)}`;
  return svg(640, 360,
    `${k.defs}${rad("tearGlow", "rgba(251,191,36,0.4)", "rgba(251,191,36,0)")}${rad("handSkin", C.skin, C.skinDark)}`,
    body);
})());

/* ============================ SCENE: MORNING ============================ */
add("morning.svg", (() => {
  const k = sky("night");
  const body = `${k.body}
<rect x="0" y="0" width="640" height="360" fill="url(#mornGlow)"/>
<rect x="0" y="0" width="640" height="360" fill="#fde68a" opacity="0.18"/>
<rect x="440" y="40" width="140" height="100" fill="#fde68a" opacity="0.9" rx="4"/>
<rect x="448" y="140" width="124" height="8" fill="#d97706" opacity="0.5"/>
<!-- kitchen -->
<rect x="40" y="200" width="240" height="110" fill="#a16207" rx="8"/>
<circle cx="160" cy="230" r="26" fill="#78350f"/>
<rect x="130" y="222" width="60" height="14" fill="#fde68a" opacity="0.9" rx="4"/>
<path d="M 150 210 q 4 -16 10 -20 q -2 14 -8 20" stroke="#e2e8f0" stroke-width="2.4" fill="none" opacity="0.8"/>
<path d="M 168 212 q 6 -20 14 -24 q -4 16 -12 22" stroke="#e2e8f0" stroke-width="2.4" fill="none" opacity="0.7"/>
<rect x="60" y="250" width="90" height="30" fill="#92400e" rx="4"/>
<rect x="100" y="200" width="40" height="26" fill="#fbbf24" rx="4"/>
<!-- amma happy -->
${figure({ x: 300, y: 250, skin: C.skin, hair: "#d6d3d1", top: C.saree, bottom: "#7c2d12", scale: 1.05, mood: "grin", flip: 1 })}
<rect x="286" y="180" width="28" height="20" fill="#fef3c7" opacity="0.9" rx="3"/>
<text x="330" y="160" font-family="DejaVu Sans, sans-serif" font-size="16" fill="#7c2d12" text-anchor="middle">"Beta! Halwa bana liya!"</text>
<!-- light rays -->
${Array.from({ length: 5 }, (_, i) => `<path d="M ${560 + i * 16} 0 L ${540 + i * 20} 360 L ${580 + i * 16} 360 Z" fill="#fde68a" opacity="0.14"/>`).join("")}
<rect x="0" y="310" width="640" height="50" fill="#7c2d12" opacity="0.4"/>`;
  return svg(640, 360,
    `${k.defs}${rad("mornGlow", "rgba(251,191,36,0.55)", "rgba(124,45,18,0.35)")}`,
    body);
})());

/* ============================ SCENE: NOTE SIGNED ============================ */
add("note-signed.svg", (() => {
  const k = sky("night");
  const body = `${k.body}
<ellipse cx="320" cy="180" rx="290" ry="160" fill="url(#signedGlow)" opacity="0.6"/>
<!-- note -->
<rect x="140" y="90" width="360" height="210" fill="#0f6b34" rx="14" transform="rotate(4 320 195)"/>
<rect x="156" y="106" width="328" height="178" fill="#16a34a" rx="10" transform="rotate(4 320 195)"/>
<rect x="170" y="120" width="300" height="150" fill="#f0fdf4" rx="8" transform="rotate(4 320 195)"/>
<circle cx="206" cy="160" r="26" fill="#16a34a" opacity="0.15"/>
<circle cx="434" cy="226" r="26" fill="#16a34a" opacity="0.15"/>
<text x="320" y="182" font-family="DejaVu Sans, sans-serif" font-size="58" font-weight="bold" fill="#166534" text-anchor="middle" transform="rotate(4 320 195)">₹</text>
<text x="320" y="206" font-family="DejaVu Sans, sans-serif" font-size="15" fill="#166534" text-anchor="middle" transform="rotate(4 320 195)">AAJ KI DATE</text>
<rect x="196" y="222" width="240" height="6" fill="#166534" opacity="0.5" transform="rotate(4 320 195)"/>
<rect x="196" y="236" width="180" height="6" fill="#166534" opacity="0.5" transform="rotate(4 320 195)"/>
<!-- signature -->
<path d="M 220 258 q 30 -26 52 -6 q 16 16 38 -8 q 14 -14 30 -4" stroke="#64748b" stroke-width="3.4" fill="none" stroke-linecap="round" transform="rotate(4 320 195)"/>
<path d="M 210 262 q 6 -20 12 -2 q 4 14 10 0" stroke="#64748b" stroke-width="3" fill="none" transform="rotate(4 320 195)"/>
<text x="320" y="284" font-family="DejaVu Sans, sans-serif" font-size="13" fill="#475569" text-anchor="middle" transform="rotate(4 320 195)">"Amma theek hai — Tumhara Kal wala Khud"</text>
<!-- sparkles -->
${Array.from({ length: 7 }, (_, i) => {
  const x = 60 + ((i * 97) % 520), y = 40 + ((i * 61) % 280);
  return `<path d="M ${x} ${y - 6} l 2.4 3.6 4.2 0.6 -3 3 0.8 4.2 -3.6 -1.9 -3.6 1.9 0.8 -4.2 -3 -3 4.2 -0.6 Z" fill="#fde68a" opacity="0.9"/>`;
}).join("")}`;
  return svg(640, 360,
    `${k.defs}${rad("signedGlow", "rgba(251,191,36,0.5)", "rgba(251,191,36,0)")}`,
    body);
})());

/* ============================ CHARACTER CARDS ============================ */
function charCard(o) {
  const { name, tag, figureSvg, accent } = o;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="560" viewBox="0 0 480 560">
<defs>${lin("bg1", "#0a0f1e", "#16213e")}</defs>
<rect x="0" y="0" width="480" height="560" fill="url(#bg1)"/>
<circle cx="240" cy="210" r="150" fill="url(#ccGlow)" opacity="0.5"/>
${figureSvg}
<rect x="60" y="470" width="360" height="60" rx="14" fill="${accent}22"/>
<rect x="60" y="470" width="360" height="60" rx="14" fill="none" stroke="${accent}" stroke-width="2" opacity="0.6"/>
<text x="240" y="500" font-family="DejaVu Sans, sans-serif" font-size="26" font-weight="bold" fill="#fef3c7" text-anchor="middle">${name}</text>
<text x="240" y="522" font-family="DejaVu Sans, sans-serif" font-size="14" fill="#cbd5e1" text-anchor="middle">${tag}</text>
</svg>`;
}
const CC_GLOW = rad("ccGlow", "rgba(251,191,36,0.35)", "rgba(251,191,36,0)");

add("raghu.svg", charCard({
  name: "RAGHU", tag: "Hero · 2026 · Blue Kurta", accent: "#1d4ed8",
  figureSvg: `${CC_GLOW}${figure({ x: 240, y: 330, skin: C.skin, hair: "#201a17", top: C.kurta, bottom: C.jeans, scale: 2.3, mood: "worried", flip: 1 })}`,
}));
add("amma.svg", charCard({
  name: "AMMA", tag: "Mother · Orange Saree", accent: "#ea580c",
  figureSvg: `${CC_GLOW}${figure({ x: 240, y: 330, skin: C.skin, hair: "#d6d3d1", top: C.saree, bottom: "#7c2d12", scale: 2.3, mood: "sad", flip: 1 })}`,
}));
add("kalu.svg", charCard({
  name: "KALU CHACHA", tag: "Shopkeeper · The Wise Eye", accent: "#a8a29e",
  figureSvg: `${CC_GLOW}${figure({ x: 240, y: 330, skin: C.skinDark, hair: "#e7e5e4", top: C.white, bottom: "#44403c", scale: 2.3, mood: "worried", flip: 1 })}
<circle cx="222" cy="252" r="9" fill="#fef3c7" opacity="0.9"/><circle cx="240" cy="252" r="9" fill="#fef3c7" opacity="0.9"/>
<rect x="222" y="260" width="18" height="3" fill="#78716c" rx="1.5"/>`,
}));
add("inspector.svg", charCard({
  name: "SHER SINGH", tag: "Inspector · Khaki Force", accent: "#a16207",
  figureSvg: `${CC_GLOW}${figure({ x: 240, y: 330, skin: C.skinDark, hair: "#292524", top: C.khaki, bottom: "#3f3f46", scale: 2.3, mood: "shock", flip: 1 })}
<rect x="196" y="210" width="88" height="20" fill="#3f3f46" rx="5"/>
<rect x="210" y="198" width="60" height="16" fill="#292524" rx="4"/>`,
}));
add("kavya.svg", charCard({
  name: "KAVYA", tag: "Time-Police · 2087", accent: "#22d3ee",
  figureSvg: `${CC_GLOW}${figure({ x: 240, y: 330, skin: C.skin, hair: "#e2e8f0", top: C.silver, bottom: "#475569", scale: 2.3, mood: "worried", flip: 1 })}
<ellipse cx="240" cy="268" rx="40" ry="14" fill="#22d3ee" opacity="0.9"/>
<text x="240" y="273" font-family="DejaVu Sans, sans-serif" font-size="11" font-weight="bold" fill="#0e7490" text-anchor="middle">TIME POLICE</text>`,
}));

/* ============================ PROPS ============================ */
add("atm.svg", (() => {
  const body = `<rect x="0" y="0" width="480" height="520" fill="#0a0f1e"/>
<ellipse cx="240" cy="260" rx="180" ry="160" fill="url(#pGlow)" opacity="0.5"/>
<rect x="80" y="120" width="320" height="300" fill="#7f1d1d" rx="10"/>
<rect x="96" y="70" width="288" height="52" fill="#1e3a8a" rx="6"/>
<text x="240" y="102" font-family="DejaVu Sans, sans-serif" font-size="22" font-weight="bold" fill="#fef3c7" text-anchor="middle">MAHALAKSHMI BANK</text>
<rect x="100" y="134" width="280" height="150" fill="#1e1b4b" rx="8"/>
<rect x="112" y="146" width="256" height="126" fill="#fef3c7" rx="6"/>
<rect x="124" y="158" width="70" height="12" fill="#1e293b" opacity="0.8"/>
<rect x="124" y="178" width="110" height="12" fill="#1e293b" opacity="0.5"/>
<text x="240" y="220" font-family="DejaVu Sans, sans-serif" font-size="26" font-weight="bold" fill="#b91c1c" text-anchor="middle">12:00 AM</text>
<rect x="124" y="240" width="140" height="12" fill="#1e293b" opacity="0.35"/>
<rect x="112" y="296" width="256" height="10" fill="#fbbf24"/>
<rect x="112" y="314" width="256" height="22" fill="#0f172a" rx="4"/>
<rect x="112" y="314" width="70" height="22" fill="#fbbf24" rx="4"/>
<rect x="120" y="352" width="120" height="20" fill="#334155" rx="4"/>
<rect x="120" y="382" width="120" height="20" fill="#334155" rx="4"/>
<rect x="280" y="352" width="80" height="50" fill="#0f172a" rx="4"/>
<text x="320" y="380" font-family="DejaVu Sans, sans-serif" font-size="13" fill="#22d3ee" text-anchor="middle">2087</text>`;
  return svg(480, 520, `${rad("pGlow", "rgba(251,191,36,0.5)", "rgba(251,191,36,0)")}`, body);
})());

add("note.svg", (() => {
  const body = `<rect x="0" y="0" width="480" height="520" fill="#0a0f1e"/>
<ellipse cx="240" cy="260" rx="190" ry="170" fill="url(#pGlow)" opacity="0.45"/>
<rect x="80" y="140" width="320" height="240" fill="#0f6b34" rx="14"/>
<rect x="96" y="156" width="288" height="208" fill="#16a34a" rx="10"/>
<rect x="110" y="170" width="260" height="180" fill="#f0fdf4" rx="8"/>
<circle cx="146" cy="214" r="30" fill="#16a34a" opacity="0.15"/>
<circle cx="334" cy="300" r="30" fill="#16a34a" opacity="0.15"/>
<text x="240" y="248" font-family="DejaVu Sans, sans-serif" font-size="72" font-weight="bold" fill="#166534" text-anchor="middle">₹</text>
<text x="240" y="282" font-family="DejaVu Sans, sans-serif" font-size="18" fill="#166534" text-anchor="middle">RESERVE BANK OF KAL</text>
<rect x="130" y="300" width="220" height="7" fill="#166534" opacity="0.5"/>
<rect x="130" y="316" width="160" height="7" fill="#166534" opacity="0.5"/>
<rect x="300" y="180" width="90" height="46" fill="none" stroke="#b91c1c" stroke-width="5" rx="5" transform="rotate(16 345 203)"/>
<text x="345" y="210" font-family="DejaVu Sans, sans-serif" font-size="19" font-weight="bold" fill="#b91c1c" text-anchor="middle" transform="rotate(16 345 203)">2087</text>`;
  return svg(480, 520, `${rad("pGlow", "rgba(251,191,36,0.5)", "rgba(251,191,36,0)")}`, body);
})());

add("logo.svg", (() => {
  const body = `<rect x="0" y="0" width="480" height="480" fill="#0a0f1e"/>
<circle cx="240" cy="240" r="200" fill="url(#lg1)"/>
<circle cx="240" cy="240" r="180" fill="none" stroke="#fbbf24" stroke-width="6"/>
<circle cx="240" cy="240" r="160" fill="none" stroke="#fbbf24" stroke-width="2" opacity="0.5"/>
<rect x="150" y="170" width="180" height="160" fill="#7f1d1d" rx="10"/>
<rect x="160" y="140" width="160" height="34" fill="#1e3a8a" rx="5"/>
<rect x="164" y="182" width="152" height="90" fill="#1e1b4b" rx="6"/>
<rect x="172" y="190" width="136" height="74" fill="#fef3c7" rx="4"/>
<text x="240" y="226" font-family="DejaVu Sans, sans-serif" font-size="21" font-weight="bold" fill="#b91c1c" text-anchor="middle">12:00 AM</text>
<rect x="172" y="278" width="136" height="8" fill="#fbbf24"/>
<rect x="172" y="292" width="136" height="16" fill="#0f172a" rx="3"/>
<rect x="200" y="340" width="80" height="22" fill="#0f6b34" rx="4"/>
<rect x="204" y="342" width="72" height="8" fill="#f0fdf4" rx="2"/>
<text x="240" y="410" font-family="DejaVu Sans, sans-serif" font-size="30" font-weight="bold" fill="#fde68a" text-anchor="middle">KAL KATHA</text>
<text x="240" y="436" font-family="DejaVu Sans, sans-serif" font-size="15" fill="#cbd5e1" text-anchor="middle">TOONS · HAR KAHANI MEIN EK KAL CHHUPA HAI</text>`;
  return svg(480, 480, `${lin("lg1", "#16213e", "#0a0f1e")}`, body);
})());

/* ---------------------------- write all ---------------------------- */
let count = 0;
for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(OUT, name), content);
  count++;
}
const manifest = Object.keys(files).map((f) => `/assets/${f}`);
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`✔ Generated ${count} SVG assets → public/assets/`);
console.log(manifest.join("\n"));
