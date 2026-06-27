#!/usr/bin/env bash
# Pre-flight: exit 0 only when every REQUIRED ship path appears in git status --porcelain.
set -euo pipefail

ROOT="${SHIP_DELTA_ROOT:-}"
if [[ -z "$ROOT" ]]; then
  ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
fi
cd "$ROOT"

REQUIRED=(
  ".openclaw/workspace/memory/ship-log.md"
  ".openclaw/workspace/projects/grok-businesses/DISTRIBUTION/printables/ship_x.py"
  ".openclaw/workspace/projects/grok-businesses/DISTRIBUTION/printables/verify_x_receipt.py"
  ".openclaw/workspace/projects/grok-businesses/ai-printables-planners/tests/test_generate_ship.py"
)

if [[ -n "${GIT_STATUS_FIXTURE:-}" ]]; then
  status="$(cat "$GIT_STATUS_FIXTURE")"
else
  status="$(git status --porcelain)"
fi

paths="$(echo "$status" | awk '{print $2}')"
missing=()
for path in "${REQUIRED[@]}"; do
  if ! echo "$paths" | grep -Fxq "$path"; then
    missing+=("$path")
  fi
done

if ((${#missing[@]} > 0)); then
  echo "FAIL: required paths absent from git status --porcelain:"
  printf '  - %s\n' "${missing[@]}"
  exit 1
fi

echo "OK: all ${#REQUIRED[@]} required ship paths present in git delta"