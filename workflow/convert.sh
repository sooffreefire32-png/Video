#!/usr/bin/env bash
# 🎬 KalKatha Toons — one-command XML → MP4 converter.
#
# Usage (from the repo root or anywhere):
#   ./workflow/convert.sh                    # full 10:00 video @ 1280×720
#   ./workflow/convert.sh --to 60 --width 960   # 60s teaser
#   ./workflow/convert.sh --project workflow/sample.xml --out output/sample.mp4 --width 640 --fps 24
#
# It simply wraps workflow/render.js and picks the right runtime for you.

set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

if command -v bun >/dev/null 2>&1; then
  exec bun workflow/render.js "$@"
elif command -v node >/dev/null 2>&1; then
  exec node workflow/render.js "$@"
else
  echo "✖ Neither 'bun' nor 'node' found. Install Bun: https://bun.sh" >&2
  exit 1
fi
