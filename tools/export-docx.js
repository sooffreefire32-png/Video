#!/usr/bin/env node
/**
 * State 12 — Export everything into a Word document (.docx).
 *
 * Generates a genuine .docx (Office Open XML) containing the full content
 * pack: Style DNA, script with beats, image prompts, video prompts,
 * thumbnails and SEO metadata.
 *
 * Run: bun tools/export-docx.js
 * Output: content-engine/KalKatha-Toons-Finance-Content-Pack.docx
 */
import fs from "fs";
import path from "path";
import os from "os";
import { execFileSync } from "child_process";

const __dirname = import.meta.dirname;
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "content-engine");
const OUT = path.join(OUT_DIR, "KalKatha-Toons-Finance-Content-Pack.docx");
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "docx-"));

fs.mkdirSync(OUT_DIR, { recursive: true });

/* ------------------------------ XML escaping ------------------------------ */
const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const BOLD_RUN = (t) =>
  `<w:r><w:rPr><w:b/></w:rPr><w:t xml:space="preserve">${esc(t)}</w:t></w:r>`;
const NORM_RUN = (t) =>
  `<w:r><w:t xml:space="preserve">${esc(t)}</w:t></w:r>`;

const para = (runs) => `<w:p>${runs}</w:p>`;
const heading = (t, sz) =>
  `<w:p><w:pPr><w:spacing w:before="240" w:after="120"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="${sz}"/><w:color w:val="B45309"/></w:rPr><w:t xml:space="preserve">${esc(t)}</w:t></w:r></w:p>`;
const sub = (t) => heading(t, 30);

/* ------------------------------- content ------------------------------- */
const parts = [];
parts.push(
  heading("KalKatha Toons — Viral Finance Video Content Pack", 36),
  para(NORM_RUN("Topic: The True Cost of a Car Loan vs Cash: Running the Seven-Year Math")),
  para(NORM_RUN("Workflow: 12-State YouTube Content Engine · Reference channel: Bob Invests (style only, all content original)")),
  para(NORM_RUN("Script word count: 462 · Estimated runtime: ~3:05 · Voice: US male, calm American accent"))
);

parts.push(sub("1. Style DNA"));
[
  "Niche: Behavioral personal finance",
  "Target audience: Working middle-class adults (25–45)",
  "Hook style: Open mid-scene on a relatable dilemma",
  "Script flow: Story → smart-sounding decision → hidden cost reveal → the math → lesson",
  "Sentence rhythm: Short punchy sentences, numbers dropped hard",
  "Tone: Calm, matter-of-fact, dramatic on reveals",
  "Curiosity gaps + emotional triggers: fear of being taken advantage of, relief of clarity",
  "Direct address: heavy 'you'",
  "Visual: images + AI voiceover, slow zoom on every shot, dust particles, always-on subtitles",
].forEach((l) => parts.push(para(NORM_RUN("• " + l))));

parts.push(sub("2. Script — 22 beats (462 words)"));
const beats = [
  ["1", "Marcus needed a car. Not wanted. Needed. His old one had died on the highway, and his job was forty minutes away."],
  ["2", "So Marcus walked into a dealership, credit score 720, and twenty-two thousand dollars sitting in savings. The dealer smiled, ran the numbers, and told him something that sounded smart."],
  ["3", "\u201CDon't touch your savings. Finance it. You're approved at 6.9% for 72 months.\u201D Marcus thought about it. It sounded perfect."],
  ["4", "So he signed. A thirty-five-thousand-dollar truck, financed at 6.9%, for six long years. But today, we run the numbers."],
  ["5", "Here's the seven-year math. Total price: thirty-five thousand. But over 72 months at 6.9%, Marcus pays interest on every single one of them."],
  ["6", "By the time the loan is done, he's paid more than eight thousand dollars — just in interest. That's a second car. Two years of groceries."],
  ["7", "And that's only the part with the interest rate on it. That brand-new truck loses about a fifth of its value the second it leaves the lot."],
  ["8", "Year one, it's worth twenty-eight thousand. Year three, twenty-one. Meanwhile the loan balance barely moves — you pay interest first."],
  ["9", "So for most of the loan, Marcus owes more than the truck is worth. That's called being underwater."],
  ["10", "Now let's do the cash side. Same truck. Thirty-five thousand, paid in full. Marcus keeps the interest too."],
  ["11", "Because that twenty-two thousand in savings? It was earning him money. And he kept earning on it, every single year."],
  ["12", "Over seven years, that difference compounds. The financed truck costs about forty-seven thousand all-in. The cash truck? Thirty-five."],
  ["13", "The gap: more than twelve thousand dollars. For the same truck. Same roads. Same commute. The only difference is who kept the money."],
  ["14", "But wait — financing isn't always wrong. If the rate is low, and the money can grow faster than the loan costs, financing can win."],
  ["15", "Marcus's rate was 6.9%. His savings were earning a fraction of that. He was paying 6.9% to keep money that made him almost nothing."],
  ["16", "So here's the rule: can my money make more than this loan costs? If not — pay cash, or wait."],
  ["17", "And never finance a thing that loses value. Financing a home, education, or business can build wealth. A car is a tool, not an investment."],
  ["18", "Marcus's mistake wasn't buying the truck. It was never seeing the real number. The sticker said $35,000. The real number was $47,000."],
  ["19", "One spreadsheet, ten minutes, and he'd have seen the whole thing. That's the entire trick to money: just running the numbers."],
  ["20", "So before you sign the next loan, ask your dealer what the truck really costs — over seven years. If he hesitates, you already know."],
  ["21", "Run the seven-year math. Keep your interest. Let compound work for you — not against you."],
  ["22", "Because the best financial decision you ever make isn't about getting more. It's about keeping what you already have."],
];
beats.forEach(([n, t]) => parts.push(para(BOLD_RUN(`Beat ${n}: `) + NORM_RUN(t))));

parts.push(sub("3. Image Prompts (one per beat)"));
[
  "B1: Night highway, broken car, steam, wide establishing shot, quiet urgency",
  "B2: Dealership at dusk, showroom glow, buyer walking in, hopeful",
  "B3: Dealer's office, 6.9% APR circled in red on contract, persuasive tension",
  "B4: Hand signing, $35,000 truck through window, decisive",
  "B5: Calculator chalkboard '6.9% × 72 months', analytical",
  "B6: Red $8,000 price tag over car silhouette, alarm",
  "B7: Truck with shrinking value bar, sobering",
  "B8: Split illustration $28K→$21K descending chart, declining",
  "B9: Truck sinking, anchor labeled LOAN, being underwater",
  "B10: Paid-in-full truck at golden hour, relief",
  "B11: Savings jar with green up-arrow, quiet optimism",
  "B12: Exponential chart $47K vs $35K, revelation",
  "B13: Two identical trucks, −$12,000 tag, stark contrast",
  "B14: Balanced scale, 3% loan vs growing plant, fair",
  "B15: 6.9% red bar vs tiny green savings bar, aha",
  "B16: Coin question mark, cash + pause clock, thoughtful",
  "B17: Wrench + truck, red X on stock arrow, house rising, clear-eyed",
  "B18: Price tag peeling $35,000 → $47,000, reveal",
  "B19: Laptop spreadsheet, ten-minute clock, clarity",
  "B20: Buyer showing '7-YEAR COST?' paper, salesman frozen, empowered",
  "B21: Hand with calculator, glowing green dollar, victorious",
  "B22: Man + paid truck at golden hour holding savings jar, peaceful success",
].forEach((l) => parts.push(para(NORM_RUN("• " + l))));

parts.push(sub("4. Video Prompts (optional)"));
[
  "Universal: 16:9, 24fps, slow push-in (Ken Burns), dust particles, warm grade, no text.",
  "B1 steam rises · B3 6.9% circled pulses · B6 tag swings · B9 truck sinks, ripples · B12 bars tower · B18 tag peels · B22 golden fade",
].forEach((l) => parts.push(para(NORM_RUN("• " + l))));

parts.push(sub("5. Thumbnails (5)"));
[
  "1. THE 7-YEAR MATH — orange calculator, red arrow to shrinking car, navy bg",
  "2. $8,000 GONE — red price tag slamming car, cash flying, fear of loss",
  "3. CASH vs LOAN — green stack vs red contract, giant VS badge",
  "4. DEALER'S SECRET — whispering salesman, suspicious buyer",
  "5. UNDERWATER — truck sinking with LOAN anchor, shock",
].forEach((l) => parts.push(para(NORM_RUN("• " + l))));

parts.push(sub("6. SEO Metadata"));
parts.push(
  para(NORM_RUN("Title: The True Cost of a Car Loan vs Cash: 7-Year Math Nobody Shows You")),
  para(NORM_RUN("Hashtags: #CarLoanMath #PersonalFinance #MoneyTips")),
  para(NORM_RUN("Tags: car loan vs cash, true cost of a car loan, finance or pay cash, APR explained, car depreciation, underwater on car loan, personal finance, money mistakes, compound interest, car buying tips, dealer tricks"))
);

parts.push(sub("7. Production Notes (from the tutorial workflow)"));
[
  "Images: generate 16:9 per beat (Flow AI / Kling / this repo's SVG generator) → download.",
  "Voiceover: ElevenLabs (custom/cloned voice) or Google AI Studio — paste script, pick US male voice (e.g. 'Charon'), American accent, natural pace → download audio.",
  "Edit (CapCut or this repo's render.js): import audio → add images in beat order → trim each to 3–5s → add zoom-in keyframe (diamond button, scale up at end) on every image → add transitions between clips → overlay dust/snow particles (Pinterest + downloader, blend mode: Screen, opacity ~40%) → auto-captions → export 16:9 MP4.",
  "This repository's workflow/render.js reproduces the same result automatically from project/finance-car-loan.xml.",
].forEach((l) => parts.push(para(NORM_RUN("• " + l))));

/* ------------------------------ build docx ------------------------------ */
const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>${parts.join("")}
<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134"/></w:sectPr>
</w:body></w:document>`;

const files = {
  "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`,
  "_rels/.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`,
  "word/document.xml": documentXml,
};

for (const [name, content] of Object.entries(files)) {
  const p = path.join(TMP, name);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
}

// zip via python3 (available on the sandbox; produces a genuine docx)
const py = `import zipfile, sys, os
base = sys.argv[1]; out = sys.argv[2]
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    for root, _, files in os.walk(base):
        for f in files:
            full = os.path.join(root, f)
            rel = os.path.relpath(full, base)
            z.write(full, rel)
`;
try {
  execFileSync("python3", ["-c", py, TMP, OUT]);
  console.log(`✅ Exported → ${path.relative(ROOT, OUT)} (${fs.statSync(OUT).size} bytes)`);
} catch (e) {
  console.error("python3 zip failed, writing plain text fallback", e.message);
  fs.writeFileSync(OUT.replace(/\.docx$/, ".txt"), documentXml);
}
