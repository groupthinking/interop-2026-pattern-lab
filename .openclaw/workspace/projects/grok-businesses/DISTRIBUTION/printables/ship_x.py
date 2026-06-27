#!/usr/bin/env python3
"""X-channel ship: generate PDF → publish_to_x.py → verify X receipt 2× → ship-log.

Per-slug copy is loaded from output/<slug>/manifest.json (title + page count).
Plain-language tweets only — avoid PDF/pipeline/reportlab phrasing (X spam filter).

Usage:
  python3 ship_x.py --slug solopreneur-cash-flow-planner --live [--skip-log]
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
GROK = Path.home() / ".openclaw/workspace/projects/grok-businesses"
PLANNERS_PIPELINE = GROK / "ai-printables-planners" / "pipeline"
PUBLISH_X = Path.home() / ".openclaw/bin/publish_to_x.py"
PYTHON_X = Path.home() / ".openclaw/runtime/venv-grok-mail/bin/python3"
VERIFY_X = HERE / "verify_x_receipt.py"
SHIP_LOG = Path.home() / ".openclaw/workspace/memory/ship-log.md"
OUTPUT = GROK / "ai-printables-planners" / "output"

# Short hook per slug — plain language for X (no file-format keywords)
_SLUG_HOOKS: dict[str, str] = {
    "adhd-professional-focus-planner": "low-energy workdays",
    "solopreneur-cash-flow-planner": "feast-or-famine income months",
}


def _tweet_from_manifest(slug: str) -> tuple[str, str]:
    manifest_path = OUTPUT / slug / "manifest.json"
    if not manifest_path.is_file():
        raise SystemExit(f"ERROR: manifest missing: {manifest_path}")
    manifest = json.loads(manifest_path.read_text())
    title = manifest["title"]
    pages = manifest["render"]["page_count"]
    hook = _SLUG_HOOKS.get(slug, "focused planning")
    needle = title
    tweet = f"{title} — {pages} pages for {hook}. Shipped today."
    return needle, tweet


def _next_row_num(text: str) -> int:
    rows = [int(m) for m in re.findall(r"^\| (\d+) \|", text, re.M)]
    return max(rows, default=0) + 1


def _append_ship_log(slug: str, tweet_id: str, tweet_url: str, pdf_bytes: int) -> None:
    utc = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    n = _next_row_num(SHIP_LOG.read_text())
    row = (
        f"| {n} | {utc} | ai-printables-planners: {slug} ({pdf_bytes}B PDF) — "
        f"ship_x.py: generate.py → publish_to_x.py → verify_x_receipt.py 2× | "
        f"X @kkgot_It | tweet id {tweet_id} · {tweet_url} · "
        f"ship_x.py exit 0 · HTTP 200 (2× fetch) | LIVE |\n"
    )
    text = SHIP_LOG.read_text()
    marker = "\n### Unlogged posts"
    if marker in text:
        SHIP_LOG.write_text(text.replace(marker, "\n" + row + marker))
    else:
        SHIP_LOG.write_text(text.rstrip() + "\n" + row)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", required=True)
    ap.add_argument("--live", action="store_true", help="post to X and append ship-log")
    ap.add_argument("--skip-log", action="store_true")
    args = ap.parse_args()

    gen = subprocess.run(
        [sys.executable, str(PLANNERS_PIPELINE / "generate.py"), "--slug", args.slug],
        cwd=PLANNERS_PIPELINE,
        capture_output=True,
        text=True,
    )
    print(gen.stdout, end="")
    if gen.returncode != 0:
        print(gen.stderr, file=sys.stderr)
        sys.exit(gen.returncode)

    pdf_path = OUTPUT / args.slug / f"{args.slug}.pdf"
    if not pdf_path.is_file():
        print(f"ERROR: PDF missing: {pdf_path}", file=sys.stderr)
        sys.exit(1)
    pdf_bytes = pdf_path.stat().st_size
    print(f"PDF_BYTES: {pdf_bytes}")

    if not args.live:
        print("DRY-RUN: would post to X and verify receipt (pass --live)")
        return

    needle, tweet_text = _tweet_from_manifest(args.slug)
    print(f"TWEET_TEXT: {tweet_text}")
    pub = subprocess.run(
        [str(PYTHON_X), str(PUBLISH_X), tweet_text],
        capture_output=True,
        text=True,
    )
    print(pub.stdout, end="")
    if pub.stderr:
        print(pub.stderr, file=sys.stderr)
    if pub.returncode != 0:
        sys.exit(pub.returncode)

    try:
        data = json.loads(pub.stdout.strip().splitlines()[-1])
    except (json.JSONDecodeError, IndexError) as e:
        print(f"ERROR: could not parse publish_to_x output: {e}", file=sys.stderr)
        sys.exit(1)
    if not data.get("success"):
        sys.exit(1)

    tweet_id = data["tweet_data"]["data"]["id"]
    tweet_url = f"https://x.com/kkgot_It/status/{tweet_id}"
    print(f"TWEET_URL: {tweet_url}")

    for i in range(2):
        v = subprocess.run(
            [
                sys.executable,
                str(VERIFY_X),
                "--url",
                tweet_url,
                "--needle",
                needle,
            ],
            capture_output=True,
            text=True,
        )
        print(f"verify_{i + 1}: {v.stdout.strip()}")
        if v.returncode != 0:
            print("ERROR: X receipt gate failed", file=sys.stderr)
            sys.exit(1)

    if not args.skip_log:
        _append_ship_log(args.slug, tweet_id, tweet_url, pdf_bytes)
        print(f"SHIP_LOG: appended X-channel row for {args.slug}")

    print(json.dumps({"success": True, "tweet_id": tweet_id, "url": tweet_url}))


if __name__ == "__main__":
    main()