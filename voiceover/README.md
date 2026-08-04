# 🎙️ Voiceover

Drop your narration here and re-render — it gets auto-muxed into the video.

| File | What it is |
|---|---|
| `vo-full.mp3` | The full 10:00 Hinglish narration (matches `story/script.md` timestamps) |
| `bgm.mp3` | Optional background music loop (add a second `<track>` in the project XML `<audio>` block) |

## How to make the voiceover

1. Open `story/script.md` — every narrator line has a timestamp.
2. Record it (phone voice recorder, or TTS like ElevenLabs / Google TTS in a Hinglish voice).
3. Save as `voiceover/vo-full.mp3`.
4. Render:

```bash
bun workflow/render.js   # → output/atm-tomorrow-money.mp4
```

Without a voiceover the renderer adds a soft ambient pad so the video is never silent — but the story lands much harder with narration.
