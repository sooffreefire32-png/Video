# 🎙️ Roman Urdu Dubbing Pipeline (Marvel-Style Localization)

Dub any video's dialogue into **Roman Urdu** with per-character voices — the way Marvel dubs its movies: **localized, natural dialogue that matches the scene's emotion and theme** (not a literal Google-Translate-style word-for-word translation).

## What was built (Ejen Ali — ARENA episode)

| Step | Tool | Result |
|---|---|---|
| 1. Download audio | yt-dlp | `/tmp/dub-audio.m4a` |
| 2. Transcribe (Malay, timestamps) | faster-whisper `small` | 54 segments → timeline JSON |
| 3. Marvel-style Roman Urdu script | human/AI localization | `dubbing/dub-script.json` — 48 lines |
| 4. Per-character TTS | edge-tts (free, no API key) | 48 line WAVs, pitch/rate per character |
| 5. Timeline placement | ffmpeg adelay + amix | VO track, synced to original timing |
| 6. Mix + duck | ffmpeg sidechaincompress | original music/SFX kept under the VO |
| 7. Mux | ffmpeg | `output/ejen-ali-arena-roman-urdu-dub.mp4` (21:14) |

## Character voices used (edge-tts, all free)

| Character | Voice | Adjustment |
|---|---|---|
| Ali (hero boy) | hi-IN-MadhurNeural | rate 1.06, pitch +3 |
| Rizwan (commander/uncle) | ur-PK-AsadNeural | default |
| Papa | ur-IN-SalmanNeural | rate 0.97, pitch −1 |
| Comot (robot sidekick) | hi-IN-SwaraNeural | rate 1.14, pitch +5 |
| Gita (trainer, female) | ur-PK-UzmaNeural | default |
| Mika (rival, female) | hi-IN-SwaraNeural | rate 1.08, pitch +2 |
| Announcer / Datuk | ur-PK-AsadNeural | rate 0.93, pitch −2 |
| Leon | ur-IN-SalmanNeural | rate 0.95, pitch −1 |
| Villain (shadow voice) | ur-PK-AsadNeural | rate 0.88, pitch −4 |

## How the dub script works (Marvel style)

`dubbing/dub-script.json` maps each scene slot to a **localized Roman Urdu line** + character.
Key: the lines are *rewritten* for natural Urdu rhythm and emotion — not translated word-for-word.
Example: Malay *"Jangan biarkan dia access mainframe!"* → *"Usay mainframe tak pohanchne mat dena!"*

## Re-run the whole pipeline

```bash
# 0) deps (Python)
pip install edge-tts faster-whisper

# 1) fetch a video + its audio
yt-dlp -f '18/best' -o /tmp/dub-video.mp4 "<URL>"
yt-dlp -f 'bestaudio[ext=m4a]' -o /tmp/dub-audio.m4a "<URL>"

# 2) transcribe (chunked to fit the 175s terminal cap)
ffmpeg -i /tmp/dub-audio.m4a -ac 1 -ar 16000 /tmp/dub-full.wav
for i in $(seq 0 21); do ffmpeg -ss $((i*60)) -t 60 -i /tmp/dub-full.wav /tmp/dc-$i.wav; done
python3 tools/dub-video.py transcribe   # runs faster-whisper per 60s chunk

# 3) write/translate the dub script into dubbing/dub-script.json
# 4) generate TTS + place lines
python3 tools/dub-video.py gen
# 5) mix (VO + ducked original) then mux
python3 tools/dub-video.py mix
python3 tools/dub-video.py mux
```

## ⚠️ Honest notes

- **Voice cloning of the original actors is NOT possible for free.** These are fresh, gender/age-matched neural voices (same tech as Chrome/Edge TTS), not the original performers' voices.
- **Lip-sync is approximate** — lines are placed on the original timing (voice-over style), not frame-perfect lip-synced.
- **Personal use only** — dubbing a full copyrighted episode is for private study/practice; don't re-upload.
- The 360p source (format 18) keeps the file small; use `-f 'bestvideo+bestaudio'` + merge for 720p+.
