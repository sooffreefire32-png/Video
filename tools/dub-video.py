#!/usr/bin/env python3
"""
Ejen Ali — Roman Urdu dubbing tool (v2 — dubbing-quality fixes).

Fixes vs v1 (user feedback: original audio still audible, speech too fast,
single voice for everyone):

  1. RATE BUG FIXED — v1 passed ``--rate {rate:+.0f}%`` which rounded every
     value (0.88, 1.06, 1.14 …) to "+1%" — so no per-character speed and no
     slowdown. Now rates are real percentages (e.g. -10%) per character.
  2. GLOBAL SLOWDOWN — rates are -4%…-20% so dialogue sounds natural, not
     rushed. Short lines are also gently stretched (atempo, pitch-preserving)
     to fill ~85% of their scene slot.
  3. DISTINCT VOICES — every character now has its own edge-tts voice (v1 had
     Rizwan/Announcer/Villain all on ur-PK-AsadNeural) + own rate/pitch.
  4. HARD DIALOGUE REPLACEMENT — v1 only sidechain-"ducked" the original, so
     the Malay dialogue stayed audible under the dub. v2 builds a slot mask
     (1.0 outside VO, ~0.12 inside with fades) and multiplies it onto the
     original audio: while a character speaks you hear ONLY the dub + a faint
     music bed; outside the slots the original plays at full volume.
  5. Villain gets a dark echo (aecho).

Usage:
  python3 tools/dub-video.py gen      # TTS lines -> /tmp/dub/line-*.wav
  python3 tools/dub-video.py mix      # VO track + mask + mix -> /tmp/dub/final-audio.wav
  python3 tools/dub-video.py mux      # mux with video -> output/ejen-ali-arena-roman-urdu-dub.mp4
"""
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPT = os.path.join(ROOT, "dubbing", "dub-script.json")
WORK = "/tmp/dub"
os.makedirs(WORK, exist_ok=True)

FFMPEG = os.path.join(ROOT, "node_modules", "ffmpeg-static", "ffmpeg")
TOTAL = 21 * 60 + 15  # 21:15 episode

# character -> (edge-tts voice, rate %, pitch half-steps)
# Each character has its OWN voice (v2 fix). Rates are negative (slower) so
# nothing sounds rushed; comot (robot) is the only fast one.
VOICES = {
    "ali": ("hi-IN-MadhurNeural", -4, 2),          # young boy hero
    "rizwan": ("ur-PK-AsadNeural", -10, -3),       # commander/uncle, deep authority
    "papa": ("ur-IN-SalmanNeural", -6, -1),        # gentle father
    "comot": ("hi-IN-SwaraNeural", 8, 6),          # robot sidekick: high + fast
    "gita": ("ur-PK-UzmaNeural", -8, 1),           # female trainer
    "mika": ("ur-IN-GulNeural", 0, 2),             # rival contestant girl
    "announcer": ("en-IN-PrabhatNeural", -8, 0),   # formal arena announcer
    "leon": ("ur-PK-AsadNeural", -6, -1),          # (no lines in this episode)
    "villain": ("hi-IN-MadhurNeural", -20, -6),    # dark shadow voice + echo
}

# characters that get extra post-filters: char -> list of ffmpeg audio filters
EXTRA_FILTERS = {
    "villain": ["aecho=0.9:0.7:80:0.3"],
}


def run(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, **kw)
    if r.returncode != 0:
        print("CMD FAIL:", " ".join(cmd)[:200])
        print(r.stderr[-600:])
    return r


def _probe_dur(path):
    p = subprocess.run([FFMPEG, "-i", path], capture_output=True, text=True)
    m = re.search(r"Duration: (\d+):(\d+):([\d.]+)", p.stderr)
    if m:
        return int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))
    return None


def _gen_line(idx, L):
    """Generate one TTS line -> placed mono wav with pitch/rate/echo + stretch."""
    voice, rate_pct, half = VOICES.get(L["char"], VOICES["rizwan"])
    base = os.path.join(WORK, f"line-{idx:03d}.mp3")
    placed = os.path.join(WORK, f"line-{idx:03d}.wav")
    if os.path.exists(placed):
        return True
    r = run(["edge-tts", "--voice", voice, f"--rate={rate_pct:+d}%",
             "--text", L["ur"], "--write-media", base])
    if not os.path.exists(base):
        # retry once — edge-tts is flaky under load
        run(["edge-tts", "--voice", voice, f"--rate={rate_pct:+d}%",
             "--text", L["ur"], "--write-media", base])
    if not os.path.exists(base):
        print(f"  !! edge-tts failed line {idx}: {L['ur'][:40]}")
        return False
    # pitch shift (duration-preserving): asetrate*factor -> resample -> atempo 1/factor
    factor = 2 ** (half / 12)
    filters = [f"asetrate=44100*{factor:.4f}", "aresample=44100",
               f"atempo={1 / factor:.4f}"]
    filters += EXTRA_FILTERS.get(L["char"], [])
    filters += ["aformat=sample_fmts=fltp:channel_layouts=mono"]
    run([FFMPEG, "-y", "-i", base, "-af", ",".join(filters), placed])
    dur = _probe_dur(placed)
    slot = L["end"] - L["start"]
    if dur:
        # gently stretch short lines so they fill the scene slot naturally
        target = slot * 0.85
        if dur < target * 0.6:
            stretch = max(dur / target, 0.68)  # atempo >= 0.68 (never draggy)
            tmp = placed + ".tmp.wav"
            run([FFMPEG, "-y", "-i", placed, "-af", f"atempo={stretch:.4f}", tmp])
            os.replace(tmp, placed)
            dur = _probe_dur(placed)
        print(f"  line {idx:03d} [{L['char']:9s}] {dur:.1f}s -> slot {slot:.1f}s  {L['ur'][:36]}")
    else:
        print(f"  line {idx:03d} [{L['char']:9s}] dur ? -> slot {slot:.1f}s  {L['ur'][:36]}")
    return True


def gen():
    data = json.load(open(SCRIPT))
    lines = data["lines"]
    for i, L in enumerate(lines, 1):
        _gen_line(i, L)
    print("TTS + placement done.")


def _amix_groups(pairs, kind, out_prefix):
    """Two-stage mix (groups of 8) to avoid ffmpeg 48-input amix failures.

    pairs: list of (delay_ms, filter_chain_str) already applied to a single
           input; kind decides the input construction:
             'vo'   -> line wav files (pairs carry the file path)
             'mask' -> lavfi aevalsrc constants (pairs carry (start, end))
    Returns list of stage file paths.
    """
    groups = [pairs[i:i + 8] for i in range(0, len(pairs), 8)]
    stage_files = []
    for gi, group in enumerate(groups):
        g_inputs = []
        g_filters = []
        g_labels = []
        for j, item in enumerate(group):
            if kind == "vo":
                path, delay_ms, extra = item
                g_inputs += ["-i", path]
                pre = ",".join(extra) if extra else "anull"
                g_filters.append(f"[{j}:a]{pre},adelay={delay_ms}[g{gi}_{j}]")
            else:  # mask
                st, en = item
                dur = en - st
                g_inputs += ["-f", "lavfi", "-t", f"{dur:.3f}",
                             "-i", "aevalsrc=exprs=1.0:s=44100"]
                fade_in = "afade=t=in:st=0:d=0.08"
                fade_out = f"afade=t=out:st={max(0.0, dur - 0.08):.3f}:d=0.08" if dur > 0.2 else ""
                chain = "afade=t=in:st=0:d=0.05" if dur <= 0.2 else f"{fade_in},{fade_out}"
                g_filters.append(f"[{j}:a]{chain},adelay={int(st * 1000)}[g{gi}_{j}]")
            g_labels.append(f"[g{gi}_{j}]")
        joined = "".join(g_labels)
        g_filters.append(joined + f"amix=inputs={len(group)}:normalize=0:duration=longest[g{gi}]")
        stage_path = os.path.join(WORK, f"{out_prefix}-{gi}.wav")
        run([FFMPEG, "-y", *g_inputs, "-filter_complex", ";".join(g_filters),
             "-map", f"[g{gi}]", "-ar", "44100", "-ac", "1", stage_path])
        stage_files.append(stage_path)
    return stage_files


def _final_amix(stage_files, out_path, total):
    s_inputs = []
    for sf in stage_files:
        s_inputs += ["-i", sf]
    s_labels = "".join(f"[{si}:a]" for si in range(len(stage_files)))
    run([FFMPEG, "-y", *s_inputs,
         "-filter_complex",
         f"{s_labels}amix=inputs={len(stage_files)}:normalize=0:duration=longest[vo]",
         "-map", "[vo]", "-t", str(total), "-ar", "44100", "-ac", "1", out_path])


def mix():
    data = json.load(open(SCRIPT))
    lines = data["lines"]

    # ---- 1) VO track: place all line wavs on the timeline ----
    vo_pairs = []
    for i, L in enumerate(lines, 1):
        wav = os.path.join(WORK, f"line-{i:03d}.wav")
        if os.path.exists(wav):
            vo_pairs.append((wav, int(L["start"] * 1000), None))
    if not vo_pairs:
        print("!! no placed lines — run gen first")
        return
    vo_track = os.path.join(WORK, "vo-track.wav")
    if not os.path.exists(vo_track) or os.path.getsize(vo_track) == 0:
        _final_amix(_amix_groups(vo_pairs, "vo", "stage"), vo_track, TOTAL)
    if not os.path.exists(vo_track) or os.path.getsize(vo_track) == 0:
        print("!! vo-track build failed")
        return

    # ---- 2) Slot mask: 1.0 outside VO, ~0.12 inside (dialogue replacement) ----
    # Extend each slot a bit early/late so the original line is fully covered,
    # but never past the neighbour slot (avoid mask overlap summing to 2.0).
    slots = []
    for i, L in enumerate(lines):
        st, en = L["start"], L["end"]
        prev_end = lines[i - 1]["end"] if i > 0 else None
        nxt_start = lines[i + 1]["start"] if i + 1 < len(lines) else TOTAL
        ext_st = min(0.35, (st - (prev_end or 0)) / 2) if prev_end is not None else 0.35
        gap = nxt_start - en
        ext_en = min(0.9, gap / 2) if gap < 2.0 else 0.9
        slots.append((max(0.0, st - ext_st), min(TOTAL, en + ext_en)))
    mask_path = os.path.join(WORK, "mask.wav")
    if not os.path.exists(mask_path) or os.path.getsize(mask_path) == 0:
        _final_amix(_amix_groups(slots, "mask", "mstage"), mask_path, TOTAL)

    # ---- 3) Final mix: bg*(1 - 0.88*mask) + VO ----
    orig = "/tmp/dub-audio.m4a"
    if not os.path.exists(orig):
        print("!! original audio missing — download it to /tmp/dub-audio.m4a")
        return
    final = os.path.join(WORK, "final-audio.wav")
    fc = (
        "[0:a]aformat=sample_fmts=fltp:channel_layouts=stereo[bg];"
        "[1:a]aformat=sample_fmts=fltp:channel_layouts=stereo,volume=1.15[vo];"
        "[2:a]aformat=sample_fmts=fltp:channel_layouts=stereo[mask];"
        # split bg: one copy for the mask multiply, one for the final mix
        "[bg]asplit=2[bgm][bgx];"
        "[bgm][mask]amultiply[masked];"
        # amultiply halves its product, so use -2*bed to keep the bed at ~0.10;
        # negate via negative volume (anegate not in this ffmpeg build)
        "[masked]volume=-1.8[neg];"
        "[bgx][neg][vo]amix=inputs=3:normalize=0:duration=longest[mix]"
    )
    run([FFMPEG, "-y", "-i", orig, "-i", vo_track, "-i", mask_path,
         "-filter_complex", fc, "-map", "[mix]",
         "-ar", "44100", "-ac", "2", "-t", str(TOTAL), final])
    if os.path.exists(final) and os.path.getsize(final) > 0:
        print(f"mix done -> {final} ({_probe_dur(final):.0f}s)")
    else:
        print("!! final mix failed")


def mux():
    vid = "/tmp/dub-video.mp4"
    if not os.path.exists(vid):
        run(["yt-dlp", "-f", "18/best", "-o", vid,
             "https://www.youtube.com/watch?v=BLRPXAw1AwA"])
    out = os.path.join(ROOT, "output", "ejen-ali-arena-roman-urdu-dub.mp4")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    run([FFMPEG, "-y", "-i", vid, "-i", os.path.join(WORK, "final-audio.wav"),
         "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
         "-shortest", out])
    print("mux done ->", out)


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "gen"
    {"gen": gen, "mix": mix, "mux": mux}[cmd]()
