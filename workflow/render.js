#!/usr/bin/env node
/**
 * KalKatha Toons — XML → MP4 render pipeline.
 *
 * Reads an Alight-style project XML (see schema.md) and renders it to an MP4
 * using ffmpeg (binary provided by ffmpeg-static) + sharp (SVG rasterizer).
 *
 * USAGE:
 *   node workflow/render.js --project project/atm-tomorrow-money.xml \
 *     --out output/atm-tomorrow-money.mp4 [--from 0] [--to 600] \
 *     [--width 1280] [--fps 30] [--no-chips] [--silent]
 *
 * EXAMPLES:
 *   Full 10:00 render (1080p):  node workflow/render.js
 *   Quick teaser (first 60s):   node workflow/render.js --to 60 --out output/teaser-60s.mp4 --width 960
 *   Segment 120–240s:           node workflow/render.js --from 120 --to 240 --out output/seg.mp4 --width 1280
 */
import fs from "fs";
import path from "path";
import os from "os";
import { execFileSync } from "child_process";
import { XMLParser } from "fast-xml-parser";
import sharp from "sharp";
import ffmpegPath from "ffmpeg-static";

const __dirname = import.meta.dirname;

/* ------------- make fontconfig find workflow/fonts for sharp ------------- */
const FONT_DIR = path.join(__dirname, "fonts");
if (!fs.existsSync(path.join(FONT_DIR, "fonts.conf"))) {
  fs.writeFileSync(
    path.join(FONT_DIR, "fonts.conf"),
    `<?xml version="1.0"?>\n<!DOCTYPE fontconfig SYSTEM "fonts.dtd">\n<fontconfig>\n  <dir>${FONT_DIR}</dir>\n  <cachedir>${path.join(os.tmpdir(), "fc-cache")}</cachedir>\n</fontconfig>\n`
  );
}
process.env.FONTCONFIG_PATH = FONT_DIR;

const ROOT = path.resolve(__dirname, "..");
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "kalkatha-"));

/* ------------------------------ arg parsing ------------------------------ */
const argv = process.argv.slice(2);
const get = (name, def) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : def;
};
const has = (name) => argv.includes(name);

const PROJECT = path.resolve(ROOT, get("--project", "project/atm-tomorrow-money.xml"));
const OUT = path.resolve(ROOT, get("--out", "output/atm-tomorrow-money.mp4"));
const FROM = Number(get("--from", "0"));
const TO = Number(get("--to", "Infinity"));
const W = Number(get("--width", "1280"));
const FPS = Number(get("--fps", "30"));
const CHIPS = !has("--no-chips");
const WITH_AUDIO = !has("--silent");

const H = even(Math.round((W * 9) / 16));
const CACHE = path.join(ROOT, ".cache", "png");
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.mkdirSync(CACHE, { recursive: true });

function even(n) {
  return Math.round(n) % 2 === 0 ? Math.round(n) : Math.round(n) + 1;
}
const fmt = (s) => {
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
};
const q = (s) => `'${String(s).replace(/'/g, "\\'")}'`;

/* ------------------------------ parse XML ------------------------------ */
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
const project = parser.parse(fs.readFileSync(PROJECT, "utf8")).project;

const width = Number(project["@_width"] || 1920);
const height = Number(project["@_height"] || 1080);
const fps = Number(project["@_fps"] || 30);
const total = Number(project["@_duration"] || 600);

const assetsRaw = Array.isArray(project.assets.asset) ? project.assets.asset : [project.assets.asset];
const assets = {};
for (const a of assetsRaw) assets[a["@_id"]] = path.resolve(ROOT, a["@_src"]);

const scenesRaw = Array.isArray(project.scenes.scene) ? project.scenes.scene : [project.scenes.scene];

const caps = project.captions || {};
const FONT = path.resolve(ROOT, caps["@_font"] || "workflow/fonts/DejaVuSans-Bold.ttf");
const capColor = caps["@_color"] || "#fde68a";
const capSize = Number(caps["@_size"] || 64);
const capPos = Number(caps["@_position"] || 0.84);
const boxColor = caps["@_boxColor"] || "rgba(0,0,0,0.55)";
const lineSpacingMul = Number(caps["@_lineSpacing"] || 1.15);

const audioTrack =
  project.audio && project.audio.track
    ? Array.isArray(project.audio.track)
      ? project.audio.track[0]
      : project.audio.track
    : null;

/* ------------------------------ helpers ------------------------------ */
async function rasterize(assetId) {
  const src = assets[assetId];
  if (!src) throw new Error(`Unknown asset: ${assetId}`);
  const key = `${assetId}-${Math.round(W * 1.5)}`.replace(/[^a-z0-9]+/gi, "_");
  const outPng = path.join(CACHE, `${key}.png`);
  if (fs.existsSync(outPng)) return outPng;
  const svg = fs.readFileSync(src);
  await sharp(svg, { density: 120 })
    .resize({ width: Math.round(W * 1.5), fit: "inside" })
    .png()
    .toFile(outPng);
  console.log(`  ↳ rasterized ${assetId} → ${path.basename(outPng)}`);
  return outPng;
}

function wrapCaption(text, maxChars) {
  const words = String(text).trim().split(/\s+/);
  const lines = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > maxChars) {
      if (lines.length < 1) lines.push(cur.trim());
      cur = w;
    } else {
      cur = (cur + " " + w).trim();
    }
  }
  if (cur) lines.push(cur.trim());
  let out = lines.slice(0, 2).join("\n");
  if (lines.length > 2) out += "\n…";
  return out;
}

/* -------- ASS subtitle generation (libass — the only text renderer in ffmpeg-static) -------- */
function assBbgr(rgb) {
  const hex = String(rgb).replace(/^#/, "").replace(/^0x/, "").slice(0, 6);
  return `${hex.slice(4, 6)}${hex.slice(2, 4)}${hex.slice(0, 2)}`.toUpperCase();
}
function assTime(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}:${String(m).padStart(2, "0")}:${(s % 60).toFixed(2).padStart(5, "0")}`;
}
function escapeAss(text) {
  return String(text).replace(/\{/g, "（").replace(/\}/g, "）");
}
function buildAss(idx, caption, title, clipDur, fsScale) {
  const capSizePx = Math.round(capSize * fsScale);
  const chipSizePx = Math.round(34 * fsScale);
  const capMargin = Math.round(H * (1 - capPos));
  const styles =
    `Style: Cap,DejaVu Sans,${capSizePx},&H00${assBbgr(capColor)},&H00${assBbgr(capColor)},&H00000000,&H8C000000,-1,0,0,0,100,100,0,0,3,0,0,2,40,40,${capMargin},1\n` +
    `Style: Chip,DejaVu Sans,${chipSizePx},&H00${assBbgr("#e2e8f0")},&H00${assBbgr("#e2e8f0")},&H00000000,&H8C0A0F1E,0,0,0,0,100,100,0,0,3,0,0,7,26,26,26,1\n`;
  let out =
    `[Script Info]\nScriptType: v4.00+\nPlayResX: ${W}\nPlayResY: ${H}\nWrapStyle: 2\n\n` +
    `[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n` +
    styles +
    `[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n`;
  const startT = assTime(0);
  const endT = assTime(clipDur);
  if (caption) {
    const txt = escapeAss(caption).replace(/\n/g, "\\N");
    out += `Dialogue: 0,${startT},${endT},Cap,,0,0,0,,{\\fad(250,250)}${txt}\n`;
  }
  if (title) {
    out += `Dialogue: 1,${startT},${endT},Chip,,0,0,0,,{\\fad(150,150)}${escapeAss(title)}\n`;
  }
  const f = path.join(TMP, `ass-${idx}.ass`);
  fs.writeFileSync(f, out, "utf8");
  return f;
}

function motionFilter(motion, frames) {
  const Z1 = 1.02;
  const Z2 = 1.14;
  const step = ((Z2 - Z1) / frames).toFixed(6);
  let z, x, y;
  switch (motion) {
    case "zoom-in":
      z = `'min(${Z1}+${step}*on,${Z2})'`;
      x = `'(iw-iw/zoom)/2'`;
      y = `'(ih-ih/zoom)/2'`;
      break;
    case "zoom-out":
      z = `'max(${Z2}-${step}*on,${Z1})'`;
      x = `'(iw-iw/zoom)/2'`;
      y = `'(ih-ih/zoom)/2'`;
      break;
    case "pan-left":
      z = `${Z2}`;
      x = `'(iw-iw/zoom)*(1-on/${Math.max(frames - 1, 1)})'`;
      y = `'(ih-ih/zoom)/2'`;
      break;
    case "pan-right":
      z = `${Z2}`;
      x = `'(iw-iw/zoom)*(on/${Math.max(frames - 1, 1)})'`;
      y = `'(ih-ih/zoom)/2'`;
      break;
    default:
      z = `'min(${Z1}+${step}*on,${Z2})'`;
      x = `'(iw-iw/zoom)/2'`;
      y = `'(ih-ih/zoom)/2'`;
  }
  return `scale=${even(W * 1.4)}:${even(H * 1.4)},zoompan=z=${z}:x=${x}:y=${y}:d=1:s=${W}x${H}:fps=${FPS}`;
}

function writeFilter(str) {
  const f = path.join(TMP, `filter-${Math.random().toString(36).slice(2)}.txt`);
  fs.writeFileSync(f, str, "utf8");
  return f;
}

function runFfmpeg(args, label) {
  console.log(`  ffmpeg: ${label}`);
  execFileSync(ffmpegPath, args, { stdio: ["ignore", "inherit", "pipe"] });
}

/* ------------------------------ scene render ------------------------------ */
const segmentPaths = [];

async function renderScene(scene, idx) {
  const start = Number(scene["@_start"]);
  const end = Number(scene["@_end"]);
  if (end <= FROM || start >= TO) return null;
  const clipDur = Math.min(end, TO) - Math.max(start, FROM);
  if (clipDur <= 0.5) return null;

  const id = scene["@_id"];
  const bg = await rasterize(scene["@_bg"]);
  const motion = scene["@_motion"] || "zoom-in";
  const grade = (scene["@_grade"] || "#fbbf24").replace("#", "0x");
  const title = scene["@_title"] || "";
  const caption = scene.caption ? String(scene.caption) : "";

  const frames = Math.round(clipDur * FPS);
  const fade = Math.min(0.5, clipDur / 4);
  const fsScale = W / width;

  const chain = [];
  chain.push(`[0:v]${motionFilter(motion, frames)}[base]`);
  chain.push(
    `color=c=${grade}:s=${W}x${H}:r=${FPS}:d=${clipDur.toFixed(3)},format=rgba,colorchannelmixer=aa=0.10[gradev]`
  );
  chain.push(`[base][gradev]overlay=0:0[g0]`);
  chain.push(`[g0]vignette=angle=PI/4.6:mode=forward[g1]`);
  let last = "g1";

  if ((caption || title) && CHIPS) {
    const wrapped = caption ? wrapCaption(caption, 62) : "";
    const assFile = buildAss(idx, wrapped, title, clipDur, fsScale);
    chain.push(`[${last}]ass='${assFile}'[cap]`);
    last = "cap";
  }

  chain.push(
    `[${last}]fade=t=in:st=0:d=${fade.toFixed(2)},fade=t=out:st=${(clipDur - fade).toFixed(2)}:d=${fade.toFixed(2)},format=yuv420p[v${idx}]`
  );

  const segPath = path.join(TMP, `seg-${idx}.mp4`);
  const args = [
    "-y",
    "-loop", "1",
    "-framerate", String(FPS),
    "-t", clipDur.toFixed(3),
    "-i", bg,
    "-filter_complex_script", writeFilter(chain.join(";")),
    "-map", `[v${idx}]`,
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
    "-pix_fmt", "yuv420p", "-r", String(FPS),
    "-an",
    segPath,
  ];
  runFfmpeg(args, `scene ${id} (${fmt(start)}→${fmt(end)})`);
  console.log(`  ✔ ${id}  ${fmt(start)}–${fmt(end)}  ${clipDur}s  motion=${motion}`);
  return { path: segPath, start };
}

/* ------------------------------ main ------------------------------ */
async function main() {
  console.log("🎬 KalKatha Toons render");
  console.log(`   project : ${PROJECT}`);
  console.log(`   output  : ${OUT}`);
  console.log(`   window  : ${FROM}s–${TO}s · ${W}x${H} @ ${FPS}fps · chips=${CHIPS}`);
  console.log(`   scenes  : ${scenesRaw.length} total`);

  const ordered = scenesRaw
    .map((s, i) => ({ s, i }))
    .sort((a, b) => Number(a.s["@_start"]) - Number(b.s["@_start"]));

  let firstStart = Infinity;
  let lastEnd = -Infinity;
  let sceneIdx = 0;
  for (const { s } of ordered) {
    const start = Number(s["@_start"]);
    const end = Number(s["@_end"]);
    if (end <= FROM || start >= TO) continue;
    firstStart = Math.min(firstStart, Math.max(start, FROM));
    lastEnd = Math.max(lastEnd, Math.min(end, TO));
    const seg = await renderScene(s, sceneIdx++);
    if (seg) segmentPaths.push(seg);
  }

  if (segmentPaths.length === 0) {
    console.error(`✖ No scenes in window ${FROM}–${TO}.`);
    process.exit(1);
  }
  if (firstStart > FROM) firstStart = FROM;

  segmentPaths.sort((a, b) => a.start - b.start);
  const listFile = path.join(TMP, "concat.txt");
  fs.writeFileSync(
    listFile,
    segmentPaths.map((s) => `file '${s.path.replace(/'/g, "'\\''")}'`).join("\n"),
    "utf8"
  );

  const concatOut = path.join(TMP, "concat.mp4");
  runFfmpeg(
    ["-y", "-f", "concat", "-safe", "0", "-i", listFile, "-c", "copy", concatOut],
    "concat segments"
  );
  const videoDur = lastEnd - firstStart;
  console.log(`  ✔ concat → ${fmt(videoDur)} of video`);

  /* audio */
  const audioArgs = ["-y", "-i", concatOut];
  let voPath = null;
  if (audioTrack && WITH_AUDIO) {
    const p = path.resolve(ROOT, audioTrack["@_src"]);
    if (fs.existsSync(p)) voPath = p;
  }

  if (voPath) {
    audioArgs.push("-i", voPath);
    audioArgs.push("-map", "0:v", "-map", "1:a");
    audioArgs.push("-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest");
    console.log(`  ♪ muxing narration: ${voPath}`);
  } else {
    const pad = `aevalsrc='0.016*sin(2*PI*55*t)+0.008*sin(2*PI*82.5*t)+0.0012*random(0)':s=44100:d=${videoDur.toFixed(2)},lowpass=f=240,volume=0.9`;
    audioArgs.push("-f", "lavfi", "-i", pad);
    audioArgs.push("-map", "0:v", "-map", "1:a");
    audioArgs.push("-c:v", "copy", "-c:a", "aac", "-b:a", "128k", "-shortest");
    console.log("  ♪ ambient pad (no voiceover — drop voiceover/vo-full.mp3 and re-render)");
  }

  audioArgs.push("-movflags", "+faststart", OUT);
  runFfmpeg(audioArgs, "final mux");

  console.log(`✅ Done → ${OUT}`);
  console.log(`   duration : ${fmt(videoDur)} · ${W}x${H} @ ${FPS}fps · ${total}s project`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
