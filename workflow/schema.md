# 📐 Alight-Style Project XML — Format Schema

This repository defines a **documented, renderable XML project format** inspired by mobile editors like Alight Motion / Chroma Toons. The included `workflow/render.js` converts these XML projects **directly to MP4** with ffmpeg — no mobile app needed.

> ⚠️ **Honest note about real `.alight` files:** Alight Motion's own project files are a proprietary format and can only be opened/exported inside the Alight Motion app (Android/iOS). There is no public spec or third-party renderer for them. This repo instead gives you an **open, documented XML format + a working XML→MP4 converter**, which is the practical equivalent for producing Chroma Toons–style videos on a computer.

---

## Root element

```xml
<project
  title="Video title"
  subtitle="Hindi subtitle"
  channel="KalKatha Toons"
  width="1920" height="1080"
  fps="30"
  duration="600"          <!-- total seconds (10:00) -->
  audioDir="voiceover"    <!-- folder for narration MP3s -->
>
```

## Children

### `<info>` — free text notes (not rendered)

### `<assets>` — every image used by scenes

```xml
<asset id="street-night" src="public/assets/street-night.svg" />
```
- `src` is relative to the **repository root** (works for `.svg` or `.png/.jpg`).
- SVGs are auto-rasterized at render time with `sharp`.

### `<audio>` — optional narration

```xml
<audio>
  <track src="voiceover/vo-full.mp3" label="Narration" offset="0" loop="false" />
</audio>
```
- If the file exists at render time it is **muxed as the soundtrack**.
- If missing, the renderer adds a soft ambient pad so the video is never silent.

### `<captions>` — global caption style (1080p coordinates)

```xml
<captions
  font="workflow/fonts/DejaVuSans-Bold.ttf"
  size="64" color="#fde68a"
  boxColor="rgba(0,0,0,0.55)"
  position="0.84"          <!-- vertical position as fraction of height -->
  lineSpacing="1.15" maxLines="2"
/>
```

### `<scenes>` — the timeline

```xml
<scene
  id="s01"
  start="0" end="20"       <!-- seconds (absolute) -->
  bg="street-night"        <!-- must match an <asset id> -->
  motion="zoom-in"         <!-- zoom-in | zoom-out | pan-left | pan-right -->
  grade="#ef4444"          <!-- mood tint color -->
  vignette="0.5"           <!-- 0..1 -->
  transition="fade"        <!-- fade (fade in/out through black) -->
  title="Midnight, Pahadi Road"  <!-- optional storyboard chip -->
>
  <caption>Narration / VO line shown as subtitle</caption>
</scene>
```

Scene segments are rendered independently, then concatenated. Every scene fades in/out over ~0.5 s for smooth Chroma Toons-style cuts.

---

## Rendering

```bash
# full 10-minute render, 1080p
bun workflow/render.js

# teaser: first 60 seconds, 960px wide, with storyboard chips
bun workflow/render.js --to 60 --out output/teaser-60s.mp4 --width 960

# a specific segment
bun workflow/render.js --from 120 --to 240 --out output/seg.mp4 --width 1280

# no caption/chip overlays (final clean video)
bun workflow/render.js --no-chips
```

Options: `--project <xml>` · `--out <mp4>` · `--from s` · `--to s` · `--width px` (16:9) · `--fps n` · `--no-chips` · `--silent`

---

## How a video is assembled

1. **Parse** the XML (`fast-xml-parser`).
2. **Rasterize** every SVG background once (cached in `.cache/png/`) with `sharp`.
3. **Per scene:** Ken Burns motion (`zoompan`), mood grade overlay, vignette, wrapped caption + title chip (`drawtext`), fade in/out → encode segment (H.264).
4. **Concat** segments losslessly.
5. **Mux** narration (or ambient pad) as AAC → `-movflags +faststart` MP4.

Dependencies: `ffmpeg-static`, `sharp`, `fast-xml-parser` — all installed via `bun install`.
