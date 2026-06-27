"""Ship verification: ai-printables-planners generate pipeline produces real PDF artifacts."""
from __future__ import annotations

import json
import os
import subprocess
import sys
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PIPELINE = os.path.join(ROOT, "pipeline")
SLUG = "adhd-professional-focus-planner"
SLUG_SOLO = "solopreneur-cash-flow-planner"
MIN_PDF_BYTES = 1000


def _run_generate(slug: str) -> tuple[int, str, str]:
    proc = subprocess.run(
        [sys.executable, "generate.py", "--slug", slug],
        cwd=PIPELINE,
        capture_output=True,
        text=True,
    )
    return proc.returncode, proc.stdout, proc.stderr


class TestGenerateShip(unittest.TestCase):
    def test_generate_produces_non_stub_pdf(self):
        rc, out, err = _run_generate(SLUG)
        self.assertEqual(rc, 0, err or out)

        pdf_path = os.path.join(ROOT, "output", SLUG, f"{SLUG}.pdf")
        manifest_path = os.path.join(ROOT, "output", SLUG, "manifest.json")

        self.assertTrue(os.path.isfile(pdf_path))
        size = os.path.getsize(pdf_path)
        self.assertGreaterEqual(size, MIN_PDF_BYTES, "PDF must be non-stub")

        with open(manifest_path, encoding="utf-8") as f:
            manifest = json.load(f)
        self.assertEqual(manifest["slug"], SLUG)
        self.assertGreaterEqual(manifest["render"]["bytes"], MIN_PDF_BYTES)
        self.assertIn("gumroad", manifest["platforms"])

    def test_solopreneur_generate_produces_non_stub_pdf(self):
        rc, out, err = _run_generate(SLUG_SOLO)
        self.assertEqual(rc, 0, err or out)

        pdf_path = os.path.join(ROOT, "output", SLUG_SOLO, f"{SLUG_SOLO}.pdf")
        manifest_path = os.path.join(ROOT, "output", SLUG_SOLO, "manifest.json")

        self.assertTrue(os.path.isfile(pdf_path))
        size = os.path.getsize(pdf_path)
        self.assertGreaterEqual(size, MIN_PDF_BYTES)

        with open(manifest_path, encoding="utf-8") as f:
            manifest = json.load(f)
        self.assertEqual(manifest["slug"], SLUG_SOLO)
        self.assertEqual(manifest["title"], "Solopreneur Cash-Flow Planner")
        self.assertGreaterEqual(manifest["render"]["page_count"], 7)


if __name__ == "__main__":
    unittest.main()