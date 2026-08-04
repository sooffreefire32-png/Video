#!/usr/bin/env python3
"""
Ejen Ali — Roman Urdu dubbing tool.
Reads dubbing/dub-script.json, generates per-line TTS via edge-tts with
character-matched voices, applies pitch/rate tweaks, time-stretches each line
to its scene slot, and lays all lines onto one VO track.

Usage:
  python3 tools/dub-video.py gen      # generate + place lines -> /tmp/dub/vo-track.wav
  python3 tools/dub-video.py mix      # mix VO with ducked original audio
  python3 tools/dub-video.py mux      # mux final audio with the downloaded video
"""
import json
import os
import subprocess
import sys
import math

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPT = os.path.join(ROOT, "dubbing", "dub-script.json")
WORK = "/tmp/dub"
os.makedirs(WORK, exist_ok=True)

FFMPEG = os.path.join(ROOT, "node_modules", "ffmpeg-static", "ffmpeg")

# voice -> (edge voice, rate, pitch-halfstep)
VOICES = {
    "ali": ("hi-IN-MadhurNeural", 1.06, 3),
    "rizwan": ("ur-PK-AsadNeural", 1.0, 0),
    "papa": ("ur-IN-SalmanNeural", 0.97, -1),
    "comot": ("hi-IN-SwaraNeural", 1.14, 5),
    "gita": ("ur-PK-UzmaNeural", 1.02, 0),
    "mika": ("hi-IN-SwaraNeural", 1.08, 2),
    "announcer": ("ur-PK-AsadNeural", 0.93, -2),
    "leon": ("ur-IN-SalmanNeural", 0.95, -1),
    "villain": ("ur-PK-AsadNeural", 0.88, -4),
}


def run(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, **kw)
    if r.returncode != 0:
        print("CMD FAIL:", " ".join(cmd)[:200])
        print(r.stderr[-600:])
    return r


def gen():
    data = json.load(open(SCRIPT))
    meta = data["meta"]
    lines = data["lines"]
    idx = 0
    for L in lines:
        idx += 1
        voice, rate, half = VOICES.get(L["char"], VOICES["rizwan"])
        base = os.path.join(WORK, f"line-{idx:03d}.mp3")
        placed = os.path.join(WORK, f"line-{idx:03d}.wav")
        if os.path.exists(placed):
            continue
        r = run(["edge-tts", "--voice", voice, "--rate", f"{rate:+.0f}%",
                 "--text", L["ur"], "--write-media", base])
        if not os.path.exists(base):
            print("  !! edge-tts failed line", idx, L["ur"][:40])
            continue
        # pitch shift (halfsteps) via asetrate + atempo, then normalize to mono 44.1k
        filter_str = "aresample=44100,aformat=sample_fmts=fltp:channel_layouts=mono"
        if half:
            factor = 2 ** (half / 12)
            filter_str = f"asetrate=44100*{factor:.4f},aresample=44100,atempo={1/factor:.4f},aformat=sample_fmts=fltp:channel_layouts=mono"
        else:
            filter_str = "asetrate=44100*1.0,aresample=44100,atempo=1.0,aformat=sample_fmts=fltp:channel_layouts=mono"
        slot = L["end"] - L["start"]
        run([FFMPEG, "-y", "-i", base, "-af", filter_str, placed])
        # measure duration
        r = run([FFMPEG, "-i", placed, "-f", "null", "-"], )
        dur = None
        # probe duration
        p = subprocess.run([FFMPEG, "-i", placed], capture_output=True, text=True)
        import re
        m = re.search(r"Duration: (\d+):(\d+):([\d.]+)", p.stderr)
        if m:
            dur = int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))
        print(f"  line {idx:03d} [{L['char']:9s}] {dur:.1f}s -> slot {slot:.1f}s  {L['ur'][:36]}")
    print("TTS + placement done.")


def mix():
    """Lay all placed line wavs onto a 21:15 timeline, duck original audio under VO."""
    data = json.load(open(SCRIPT))
    lines = data["lines"]
    total = 21 * 60 + 15
    inputs = []
    filters = []
    placed = []
    n = 0
    for i, L in enumerate(lines, 1):
        wav = os.path.join(WORK, f"line-{i:03d}.wav")
        if not os.path.exists(wav):
            continue
        idx = n  # 0-based input index
        inputs += ["-i", wav]
        filters.append(
            f"[{idx}:a]adelay={int(L['start']*1000)}[v{idx}]"
        )
        placed.append(f"[v{idx}]")
        n += 1
    # Two-stage mix: groups of 8 lines -> short stage files, then mix stages.
    # No apad anywhere: each stage only runs as long as its longest delayed line.
    pairs = [(os.path.join(WORK, f"line-{i:03d}.wav"), L) for i, L in enumerate(lines, 1)
             if os.path.exists(os.path.join(WORK, f"line-{i:03d}.wav"))]
    groups = [pairs[i:i + 8] for i in range(0, len(pairs), 8)]
    stage_files = []
    for gi, group in enumerate(groups):
        g_inputs = []
        g_filters = []
        g_labels = []
        for j, (wav, L) in enumerate(group):
            g_inputs += ["-i", wav]
            g_filters.append(f"[{j}:a]adelay={int(L['start']*1000)}[g{gi}_{j}]")
            g_labels.append(f"[g{gi}_{j}]")
        joined = "".join(g_labels)
        g_filters.append(joined + f"amix=inputs={len(group)}:normalize=0:duration=longest[g{gi}]")
        stage_path = os.path.join(WORK, f"stage-{gi}.wav")
        run([FFMPEG, "-y", *g_inputs, "-filter_complex", ";".join(g_filters),
             "-map", f"[g{gi}]", "-ar", "44100", "-ac", "1", stage_path])
        stage_files.append(stage_path)
    # Final: mix all stages
    s_inputs = []
    for si, sf in enumerate(stage_files):
        s_inputs += ["-i", sf]
    s_labels = "".join(f"[{si}:a]" for si in range(len(stage_files)))
    run([FFMPEG, "-y", *s_inputs,
         "-filter_complex", f"{s_labels}amix=inputs={len(stage_files)}:normalize=0:duration=longest[vo]",
         "-map", "[vo]", "-t", str(total), "-ar", "44100", "-ac", "1",
         os.path.join(WORK, "vo-track.wav")])
    if not os.path.exists(os.path.join(WORK, "vo-track.wav")) or \
       os.path.getsize(os.path.join(WORK, "vo-track.wav")) == 0:
        print("!! vo-track build failed")
        return
    # original audio (from downloaded m4a) -> duck under VO via sidechaincompress
    orig = "/tmp/dub-audio.m4a"
    run([FFMPEG, "-y", "-i", orig, "-i", os.path.join(WORK, "vo-track.wav"),
         "-filter_complex",
         "[0:a]volume=1.0[bg];[bg][1:a]sidechaincompress=threshold=0.02:ratio=8:attack=20:release=400[duck];"
         "[duck][1:a]amix=inputs=2:normalize=0:duration=first[mix]",
         "-map", "[mix]", "-ar", "44100", "-ac", "2", "-t", str(total),
         os.path.join(WORK, "final-audio.wav")])
    print("mix done -> /tmp/dub/final-audio.wav")


def mux():
    """Attach final audio to the video stream (download video first if needed)."""
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
