#!/usr/bin/env node
/**
 * Finance video — 16:9 flat-vector scene generator.
 * One original SVG per script beat (see content-engine/state7-image-prompts.md).
 * Visual style profile: warm amber + deep navy + cream, cinematic soft light,
 * dust particles, clean minimal detail, 16:9 (1280x720 canvas).
 *
 * Run: bun tools/gen-finance-assets.js
 * Output: public/assets/finance/*.svg  (22 scenes)
 */
import fs from "fs";
import path from "path";
import { SCENES_A } from "./finance-scenes-a.js";
import { SCENES_B } from "./finance-scenes-b.js";

const __dirname = import.meta.dirname;
const OUT = path.join(__dirname, "..", "public", "assets", "finance");
fs.mkdirSync(OUT, { recursive: true });

/* ---------------------------- palette ---------------------------- */
export const C = {
  navy: "#0e1b3e", navy2: "#16254d", navy3: "#0a1330",
  amber: "#f59e0b", gold: "#fbbf24", goldLight: "#fde68a",
  cream: "#faf5ea", cream2: "#f3ead6",
  red: "#dc2626", redDark: "#991b1b",
  green: "#16a34a", greenDark: "#14532d",
  ink: "#1c1917", gray: "#475569", silver: "#cbd5e1",
  skin: "#e8b48c", skinDark: "#c98a5a",
};

/* ---------------------------- helpers ---------------------------- */
const A = Math.PI / 180;
export const L = (id, c1, c2, angle = 90) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="${Math.cos(angle * A)}" y2="${Math.sin(angle * A)}"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>`;
export const R = (id, c1, c2) =>
  `<radialGradient id="${id}"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></radialGradient>`;
export const rect = (x, y, w, h, f, rx = 0, extra = "") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${f}" ${extra}/>`;
export const circ = (cx, cy, r, f, extra = "") =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${f}" ${extra}/>`;
export const ell = (cx, cy, rx, ry, f, extra = "") =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${f}" ${extra}/>`;
export const poly = (pts, f, extra = "") =>
  `<polygon points="${pts}" fill="${f}" ${extra}/>`;
export const pth = (d, f, extra = "") =>
  `<path d="${d}" fill="${f}" ${extra}/>`;
export const line = (x1, y1, x2, y2, st, w, extra = "") =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${st}" stroke-width="${w}" ${extra}/>`;
export const txt = (x, y, s, f, sz, extra = "") =>
  `<text x="${x}" y="${y}" font-family="DejaVu Sans, sans-serif" font-size="${sz}" font-weight="bold" fill="${f}" text-anchor="middle" ${extra}>${s}</text>`;

/* deterministic dust particles */
export const dust = (n = 42, seed = 7) => {
  let r = seed;
  const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
  let s = "";
  for (let i = 0; i < n; i++) {
    s += circ(20 + rnd() * 1240, 20 + rnd() * 680, 1.4 + rnd() * 2.6, "#fde68a",
      `opacity="${(0.15 + rnd() * 0.4).toFixed(2)}"`);
  }
  return s;
};

/* simple flat person: head + torso + arms */
export const person = (x, y, o = {}) => {
  const {
    skin = C.skin, hair = "#201a17", shirt = C.navy, pants = "#334155",
    scale = 1, arm = "down", look = "front",
  } = o;
  const S = (v) => v * scale;
  const armL = arm === "up" ? `transform="rotate(-40 ${x - S(34)} ${y - S(10)})"` : "";
  const armR = arm === "up" ? `transform="rotate(40 ${x + S(34)} ${y - S(10)})"` : "";
  return [
    rect(x - S(14), y - S(6), S(11), S(52), pants, S(4)),
    rect(x + S(3), y - S(6), S(11), S(52), pants, S(4)),
    rect(x - S(26), y - S(52), S(52), S(52), shirt, S(12)),
    rect(x - S(36), y - S(50), S(12), S(42), shirt, S(6), armL),
    rect(x + S(24), y - S(50), S(12), S(42), shirt, S(6), armR),
    circ(x - S(30), y - S(8), S(6), skin),
    circ(x + S(30), y - S(8), S(6), skin),
    rect(x - S(6), y - S(62), S(12), S(12), skin),
    circ(x, y - S(80), S(24), skin),
    ell(x, y - S(86), S(25), S(17), hair),
    circ(x - S(7), y - S(81), S(3), "#1c1917"),
    circ(x + S(7), y - S(81), S(3), "#1c1917"),
    look === "smile"
      ? pth(`M ${x - S(7)} ${y - S(69)} q ${S(7)} ${S(6)} ${S(14)} 0`, "none",
          `stroke="#7f1d1d" stroke-width="2.4" stroke-linecap="round"`)
      : pth(`M ${x - S(5)} ${y - S(69)} q ${S(5)} ${S(4)} ${S(10)} 0`, "none",
          `stroke="#7f1d1d" stroke-width="2.4" stroke-linecap="round"`),
  ].join("");
};

/* simple flat car */
export const car = (x, y, o = {}) => {
  const { color = "#dc2626", w = 240, h = 90 } = o;
  return [
    rect(x, y + h - 26, w, 26, C.navy3, 8),
    pth(
      `M ${x + 18} ${y + h - 26} L ${x + 52} ${y + h - 64} Q ${x + 66} ${y + h - 78} ${x + 88} ${y + h - 78} ` +
      `L ${x + w - 62} ${y + h - 78} Q ${x + w - 40} ${y + h - 78} ${x + w - 24} ${y + h - 58} ` +
      `L ${x + w - 14} ${y + h - 26} Z`,
      color
    ),
    rect(x + 40, y + h - 60, w - 118, 26, "#9fc5e8", 4),
    circ(x + 46, y + h - 12, 17, "#1c1917"),
    circ(x + 46, y + h - 12, 8, "#e2e8f0"),
    circ(x + w - 46, y + h - 12, 17, "#1c1917"),
    circ(x + w - 46, y + h - 12, 8, "#e2e8f0"),
  ].join("");
};

/* simple truck (boxy) */
export const truck = (x, y, o = {}) => {
  const { color = "#b45309", w = 260, h = 110 } = o;
  return [
    rect(x, y + h - 28, w, 28, C.navy3, 8),
    rect(x, y + h - 88, w * 0.62, 60, color, 6),
    pth(
      `M ${x + w * 0.66} ${y + h - 28} L ${x + w * 0.66} ${y + h - 74} ` +
      `L ${x + w * 0.8} ${y + h - 74} L ${x + w * 0.88} ${y + h - 54} L ${x + w} ${y + h - 54} L ${x + w} ${y + h - 28} Z`,
      color
    ),
    rect(x + w * 0.7, y + h - 70, w * 0.18, 22, "#9fc5e8", 3),
    circ(x + w * 0.16, y + h - 14, 18, "#1c1917"),
    circ(x + w * 0.16, y + h - 14, 8, "#e2e8f0"),
    circ(x + w * 0.84, y + h - 14, 18, "#1c1917"),
    circ(x + w * 0.84, y + h - 14, 8, "#e2e8f0"),
  ].join("");
};

/* tag */
export const tag = (x, y, label, color = C.red, extra = "") =>
  `<g ${extra}>${poly(`${x},${y} ${x + 190},${y} ${x + 190},${y + 64} ${x + 130},${y + 88} ${x + 60},${y + 88} ${x},${y + 64}`, color)}
  ${rect(x + 26, y + 16, 138, 8, "rgba(255,255,255,0.55)", 4)}
  ${txt(x + 95, y + 40, label, "#fff", 34)}</g>`;

/* coin stack */
export const coins = (x, y, n = 5, r = 26, color = C.gold) => {
  let s = "";
  for (let i = 0; i < n; i++) {
    const cy = y - i * (r * 0.62);
    s += ell(x, cy, r, r * 0.42, color);
    s += ell(x, cy - 3, r, r * 0.42, "#fff", `opacity="0.25"`);
    s += circ(x, cy - 3, r * 0.28, "#b45309", `opacity="0.5"`);
  }
  return s;
};

/* bar chart helper */
export const bars = (items, x0, y0, bw = 60, gap = 90, hmax = 260) =>
  items
    .map(([label, h, color], i) => {
      const x = x0 + i * gap;
      return `${rect(x, y0 - h, bw, h, color, 6)}
      ${rect(x, y0 - h, bw, 6, "rgba(255,255,255,0.35)", 3)}
      ${txt(x + bw / 2, y0 - h - 22, label, C.cream, 30)}`;
    })
    .join("");

/* frame helper */
export const svg = (defs, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
<defs>${defs}</defs>
${body}
</svg>`;

/* ------------------------------------------------------------------ */
let wrote = 0;
for (const [id, make] of [...SCENES_A, ...SCENES_B]) {
  const file = path.join(OUT, `${id}.svg`);
  fs.writeFileSync(file, make());
  wrote++;
  console.log(`  ↳ ${id}.svg`);
}
console.log(`✅ Generated ${wrote} finance scenes → public/assets/finance/`);
