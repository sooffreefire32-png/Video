# 🏧 The ATM That Printed Tomorrow's Money

**KalKatha Toons** — *"Har kahani mein ek kal chhupa hai."*

A complete **Chroma Toons–style animated story video kit**: full 10-minute Hinglish script, 24 original SVG scenes & characters, an open Alight-style project XML, and a working **XML → MP4** render pipeline (ffmpeg + sharp). No mobile app needed, no copyrighted images — everything is generated from scratch.

> **Idea:** A boy withdraws money from an ATM, but every note is dated *tomorrow*. The next day those notes are declared illegal. The final twist: the ATM was connected to the future.

---

## 🎬 The Story (10:00)

| Beat | Time | Emotion |
|---|---|---|
| Hook — the note from tomorrow | 00:00–00:45 | Shock |
| Raghu's world & Amma's sickness | 00:45–02:00 | Empathy |
| The ATM & first withdrawal | 02:00–03:00 | Mystery |
| The money works — greed grows | 03:00–04:15 | Wonder |
| Midnight — notes declared illegal | 04:15–05:45 | Panic |
| Return to the ATM — 2087 revealed | 05:45–07:15 | Revelation |
| Kavya & the truth about Raghav | 07:15–08:45 | Twist |
| The choice — tear the notes | 08:45–09:30 | Climax |
| One note from the future self | 09:30–10:00 | Warmth + hook |

**Twist:** The ATM is a time-bank built in 2087 by its richest man — so he could save his own mother. That man is Raghu. Every note he spends steals someone else's tomorrow. His choice: *paisa… ya Amma.*

---

## 🚀 Quickstart

### ☁️ No-install option — render on GitHub (recommended)

The repo has a **GitHub Actions workflow** (`.github/workflows/render.yml`) that converts the XML project to MP4 **in the cloud**:

1. Open this repo on GitHub → **Actions** → **🎬 Render XML → MP4**.
2. **Run workflow** → pick width / fps / seconds (600 = full 10:00 video) → run.
3. Download the finished MP4 from the job's **Artifacts**. Done — no software needed.

A 10s smoke-test render also runs on every push, so you always know the pipeline works.

### 💻 Local option — one command

```bash
bun install                    # ffmpeg-static + sharp + fast-xml-parser
./workflow/convert.sh          # full 10:00 @ 1280×720 → output/atm-tomorrow-money.mp4
```

Faster smoke tests:

```bash
bun workflow/render.js --project workflow/sample.xml --out output/sample.mp4 --width 640 --fps 24   # 10s test
bun workflow/render.js --to 60 --out output/teaser-60s.mp4 --width 960                              # 60s teaser
bun workflow/render.js --from 120 --to 240 --out output/seg.mp4 --width 1280                        # one segment
```

---

## 🗂️ Repository Map

```
story/                          the story, scene table & characters
  script.md                       full 10:00 Hinglish narration script (timestamps)
  scenes.json                     source of truth for the renderer (18 scenes)
  characters.md                   character sheets & style guide
project/
  atm-tomorrow-money.xml          the 600-second Alight-style project XML
public/assets/                    24 original flat-vector SVG scenes, characters & props
workflow/
  render.js                       XML → MP4 converter (Ken Burns, grade, captions, fades)
  convert.sh                      one-command local converter (wraps render.js)
  schema.md                       the XML project format, fully documented
  sample.xml                      10-second smoke-test project
.github/workflows/
  render.yml                      cloud render: full MP4 on demand, smoke test on push
tools/
  gen-assets.js                   regenerates every SVG asset from scratch
  gen-project.js                  scenes.json → project XML
voiceover/                        drop vo-full.mp3 here (auto-muxed, optional)
output/                           rendered MP4s land here
```

## 🎨 The 5-step workflow (make *any* Chroma Toons video)

1. **Story** → 8–15 min script in `story/script.md` — hook in 30s, cliffhanger mid-way, moral ending.
2. **Scene table** → copy `story/scenes.json`, set your scenes, timings and VO lines.
3. **Art** → extend `tools/gen-assets.js` — it draws every background & character as original flat SVG (bright saturated colors, exaggerated faces, simple backgrounds). No copyrighted images anywhere.
4. **Project XML** → `bun tools/gen-project.js` builds the Alight-style XML from the scene table.
5. **Render** → `bun workflow/render.js` → MP4. Record narration to `voiceover/vo-full.mp3` and it's muxed in.

### Style recipe (borrowed from Chroma Toons channels)
- Hook with a shocking line in the **first 30–45 seconds**
- Mid-point twist + cliffhanger right before the climax
- Scenes 15–90 s; fade through black between beats
- Warm gold grades for heart, red for panic, cyan for future/sci-fi
- End every video with a moral line + a teaser for the next story

## 📄 About the XML (and real `.alight` files)

Real Alight Motion project files are a **proprietary format** with no public spec or desktop renderer. So this repo defines an **open, documented XML format** (`workflow/schema.md`) that converts **directly to MP4** on any computer via `workflow/render.js`. Same idea as Alight (scenes, assets, captions, audio, motion), fully scriptable and version-controllable. If you want Alight Motion sparkle on top, rebuild the finished scene visually in the app — this pipeline gives you the base video in minutes.

## 🖥️ Landing page

The repo also includes a styled Vite + React + Tailwind landing page (`src/`) that presents the story, characters, timeline, twists and the workflow. Run `bun run dev` to preview it locally.
