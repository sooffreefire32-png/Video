#!/usr/bin/env bash
# ------------------------------------------------------------------
# attach-audio.sh — add the Roman Urdu dub track to a video file
#
# Idea: the dub is shipped as an MP3 track (GitHub-friendly size).
# You download the original video yourself, then run this one command
# to mux the new track over it — no re-encoding of the video.
#
# USAGE:
#   bash dubbing/attach-audio.sh <video-file> [output-file] [track-mp3]
#
# EXAMPLES:
#   bash dubbing/attach-audio.sh myvideo.mp4
#       -> myvideo-dubbed.mp4  (uses dubbing/audio/*-track.mp3)
#
#   bash dubbing/attach-audio.sh video.mp4 out.mp4 dubbing/audio/ejen-ali-arena-roman-urdu-track.mp3
# ------------------------------------------------------------------
set -euo pipefail

VIDEO="${1:?usage: attach-audio.sh <video> [output] [track]}" 
OUT="${2:-${VIDEO%.*}-dubbed.mp4}"
TRACK="${3:-$(ls dubbing/audio/*-track.mp3 2>/dev/null | head -1)}"

if [[ -z "$TRACK" || ! -f "$TRACK" ]]; then
  echo "✖ No dub track found. Expected a file matching dubbing/audio/*-track.mp3" >&2
  exit 1
fi
if [[ ! -f "$VIDEO" ]]; then
  echo "✖ Video not found: $VIDEO" >&2
  exit 1
fi

echo "🎙  video : $VIDEO"
echo "🎧  track : $TRACK"
echo "🎬  out   : $OUT"

FFMPEG="$(command -v ffmpeg || echo node_modules/ffmpeg-static/ffmpeg)"
"$FFMPEG" -y -i "$VIDEO" -i "$TRACK" \
  -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k \
  -shortest "$OUT"

echo "✅ Done → $OUT"
