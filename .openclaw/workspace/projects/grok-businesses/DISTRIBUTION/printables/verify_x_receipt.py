#!/usr/bin/env python3
"""Hard gate: public X post must return HTTP 200 with expected product text.

Used by ship_x.py (2×) before any ship-log append. Exit 0 only when needle is in body.
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path
from urllib import request


def fetch_url(url: str) -> tuple[int, str]:
    req = request.Request(url, headers={"User-Agent": "OpenClawShipVerifier/1.0"})
    with request.urlopen(req, timeout=60) as resp:
        return resp.status, resp.read().decode("utf-8", errors="replace")


def verify(html: str, needle: str) -> tuple[bool, str]:
    if needle not in html:
        return False, f"FAIL missing needle {needle!r} in page body"
    return True, f"OK needle={needle!r} present"


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", help="X status URL to fetch")
    ap.add_argument("--needle", required=True, help="substring that must appear in HTML")
    ap.add_argument("--html-file", type=Path, help="local HTML snapshot (for tests)")
    args = ap.parse_args()
    if not args.url and not args.html_file:
        ap.error("one of --url or --html-file is required")

    if args.html_file:
        body = args.html_file.read_text()
        status = 200
    else:
        status, body = fetch_url(args.url)
        if status != 200:
            print(f"FAIL HTTP {status} for {args.url}")
            sys.exit(1)

    ok, msg = verify(body, args.needle)
    print(msg)
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()