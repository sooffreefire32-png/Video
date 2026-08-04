# 🎬 KalKatha Toons — Chroma Toons–Style Video Production Workflow

Turn a story into a finished MP4 with this repo. Everything is automated except your voice.

## The full pipeline (5 steps)

```
story/scenes.json ──► tools/gen-project.js ──► project/*.xml ──► workflow/render.js ──► output/*.mp4
       ▲                                                            │
   (edit story)                                               (add your VO)
```

### Step 1 — Write / edit the story
Edit `story/scenes.json` — each scene has start/end time, narrator line (`vo`), visual direction, mood and background art. Also keep `story/script.md` as the narration bible.

### Step 2 — Generate the project XML
```bash
bun tools/gen-project.js
```
Rebuilds `project/atm-tomorrow-money.xml` from the scene table. The XML is the single source of truth the renderer reads.

### Step 3 — (Optional) generate new art
`tools/gen-assets.js` draws every background and character as original flat vector SVG (Chroma Toons style). Add scenes → add `bg` entries + SVG files in `public/assets/`. No copyrighted images anywhere.

### Step 4 — Record the narration
Drop your Hinglish voiceover as `voiceover/vo-full.mp3` (record in a phone recorder, or TTS like ElevenLabs/Google TTS). The renderer auto-muxes it. Without it, the video gets a soft ambient pad.

### Step 5 — Render to MP4
```bash
bun install                 # once
bun workflow/render.js      # full 10:00 @ 1080p → output/atm-tomorrow-money.mp4
```
Fast iteration: `bun workflow/render.js --to 60 --width 960 --out output/teaser.mp4`

---

## Making a *new* Chroma Toons video (not just this one)

1. **Story** → write 8–15 min script in `story/script.md` (hook in 30s, cliffhangers at the middle, moral ending).
2. **Scene table** → copy `story/scenes.json`, set your scenes/timings/VO.
3. **Art** → draw simple flat SVGs (bright saturated colors, simple backgrounds, exaggerated faces) or extend `tools/gen-assets.js`.
4. **XML** → `bun tools/gen-project.js` produces the project file.
5. **VO + BGM** → record narration; drop a music loop in `voiceover/bgm.mp3` if you want layering (add a second `<track>` in the XML `<audio>` block).
6. **Render** → `bun workflow/render.js`.

### Style recipe (from Chroma Toons channels)
- Hook with a shocking line in the **first 30–45 seconds**.
- Mid-point twist + cliffhanger right before the climax.
- Keep scenes 15–90 s; fade through black between beats.
- Warm gold grades for heart, red for panic, cyan for future/sci-fi.
- End every video with a moral line + a teaser for the next story.

---

## About real Alight Motion files
Real Alight Motion projects (`.alight`) are **proprietary** — no public spec, no desktop renderer. To edit in Alight Motion, rebuild the same scene visually inside the app (it's a great tool for adding fancy text/effects on top). The XML here is our **open, documented format** that converts to MP4 on any computer. Best of both worlds: produce the base video with this repo, add Alight Motion sparkle on your phone if you want.

## Files
| Path | What it is |
|---|---|
| `story/` | Script, scene table, characters |
| `public/assets/` | All generated SVG art |
| `project/*.xml` | Renderable project files |
| `workflow/render.js` | XML → MP4 converter |
| `workflow/schema.md` | XML format docs |
| `workflow/sample.xml` | 10-second smoke test |
| `output/` | Rendered MP4s |
