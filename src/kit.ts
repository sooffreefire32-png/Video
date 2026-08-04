export const REPO_URL = "https://github.com/sooffreefire32-png/Video";

export const MOOD_COLORS: Record<string, string> = {
  shock: "#ef4444",
  empathy: "#fbbf24",
  mystery: "#f59e0b",
  wonder: "#22d3ee",
  panic: "#dc2626",
  revelation: "#22d3ee",
  twist: "#a78bfa",
  climax: "#f97316",
  warm: "#fde68a",
};

export const CHARACTERS = [
  {
    name: "Raghu",
    tag: "The Hero · 2026",
    img: "/assets/raghu.svg",
    accent: "#1d4ed8",
    desc: "B.Com student, delivery boy by day. Desperate enough to try a dead ATM at midnight.",
  },
  {
    name: "Amma",
    tag: "The Mother",
    img: "/assets/amma.svg",
    accent: "#ea580c",
    desc: "Widow with chronic asthma. Her ₹8,000 medicine bill is what starts everything.",
  },
  {
    name: "Kalu Chacha",
    tag: "The Wise Eye",
    img: "/assets/kalu.svg",
    accent: "#a8a29e",
    desc: "Corner-shop owner. The first to notice: “Beta… yeh note kal ka hai?”",
  },
  {
    name: "Sher Singh",
    tag: "Inspector",
    img: "/assets/inspector.svg",
    accent: "#a16207",
    desc: "Old-school cop chasing the city's first ever time-stamped counterfeit case.",
  },
  {
    name: "Kavya",
    tag: "Time-Police · 2087",
    img: "/assets/kavya.svg",
    accent: "#22d3ee",
    desc: "The officer who reveals the truth: the richest man of 2087… is Raghu.",
  },
];

export const TWISTS = [
  {
    icon: "💸",
    title: "The notes work",
    accent: "#22d3ee",
    body: "Pharmacy accepts them. Shopkeepers accept them. Tomorrow's money spends exactly like today's — no alarm, no questions.",
  },
  {
    icon: "🚨",
    title: "Midnight ban",
    accent: "#ef4444",
    body: "At 12:00 AM sharp the RBI declares every note dated beyond today illegal. Overnight, Raghu's fortune becomes a criminal's evidence.",
  },
  {
    icon: "🕰️",
    title: "The ATM is you",
    accent: "#a78bfa",
    body: "The ATM is a time-bank from 2087, built by its richest man — so he could save his own mother. That man… is Raghu. And every note he spends steals someone else's tomorrow.",
  },
];

export const TICKER_ITEMS = [
  "BREAKING — KAL KI DATE WALE NOTE ILLEGAL",
  "₹5000 · PRINTED: 01-01-2087",
  "TIME POLICE · UNIT 2087 ARRIVES",
  "“BETA… YEH NOTE KAL KA HAI?”",
  "AMMA THEEK HAI — TUMHARA KAL WALA KHUD",
  "TRANSACTION FROM TOMORROW",
  "KAL EK JAGAH HAI JO BANTI HAI",
  "LIKE · SHARE · SUBSCRIBE",
];

export const WORKFLOW_STEPS = [
  {
    n: "01",
    icon: "📖",
    title: "Story",
    desc: "Write the 8–15 min script in story/scenes.json — hook in 30s, cliffhangers, moral ending.",
  },
  {
    n: "02",
    icon: "🎨",
    title: "Art",
    desc: "tools/gen-assets.js draws every scene + character as original flat vector SVG. No copyrighted images.",
  },
  {
    n: "03",
    icon: "🧩",
    title: "Project XML",
    desc: "tools/gen-project.js builds the 600s Alight-style project XML from the scene table.",
  },
  {
    n: "04",
    icon: "🎙️",
    title: "Voiceover",
    desc: "Drop your Hinglish narration in voiceover/vo-full.mp3 — auto-muxed. Ambient pad fills silence.",
  },
  {
    n: "05",
    icon: "🎬",
    title: "Render MP4",
    desc: "bun workflow/render.js — Ken Burns motion, mood grades, captions, fades. H.264 + AAC out.",
  },
];

export const FILES = [
  { icon: "📜", path: "story/script.md", desc: "Full 10:00 Hinglish narration script with timestamps" },
  { icon: "🗂️", path: "story/scenes.json", desc: "18-scene table — the source of truth for the renderer" },
  { icon: "👥", path: "story/characters.md", desc: "Character sheets & Chroma Toons style guide" },
  { icon: "🧩", path: "project/atm-tomorrow-money.xml", desc: "The 600-second project XML (Alight-style)" },
  { icon: "🎬", path: "workflow/render.js", desc: "XML → MP4 converter (ffmpeg + sharp)" },
  { icon: "📐", path: "workflow/schema.md", desc: "XML project format documentation" },
  { icon: "🧪", path: "workflow/sample.xml", desc: "10-second smoke-test project" },
  { icon: "🎨", path: "public/assets/", desc: "26 original SVG scenes, characters & props" },
  { icon: "🎙️", path: "voiceover/", desc: "Drop vo-full.mp3 here for narration (optional)" },
  { icon: "⚙️", path: "tools/", desc: "gen-assets.js + gen-project.js generators" },
];

export const STATS = [
  { value: "10:00", label: "runtime" },
  { value: "18", label: "scenes" },
  { value: "26", label: "SVG assets" },
  { value: "3", label: "twists" },
];
