#!/usr/bin/env python3
"""Score a business folder's *completeness and evidence*, not its idea quality.

This is a mechanical proxy for the readiness rubric (frameworks/scoring-rubric.md):
it can tell you how filled-in and how evidenced the documents are, but it cannot
judge whether the idea is good — that's the auditor's job. Use it to see what's
still missing and how much of the analysis still rests on guesses.

Usage:
    python3 tools/score.py businesses/<slug>/
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

STAGE_DOCS = {
    "Think": ["00-one-pager.md", "01-lean-canvas.md",
              "02-market-and-customer.md", "03-business-model.md"],
    "Audit": ["04-audit-report.md"],
    "Simulate": ["05-financial-model.md", "assumptions.json"],
    "Test": ["06-experiment-plan.md"],
    "Decision": ["07-decision-memo.md"],
}

# unfilled <…> slots, excluding HTML tags like <br>, <b>, </td> used for layout
_HTML_TAG = re.compile(r"^/?(br|b|i|em|strong|code|td|tr|table|sub|sup|hr)\s*/?$",
                       re.IGNORECASE)


def _count_placeholders(text: str) -> int:
    return sum(1 for m in re.findall(r"<([^>\n]{0,60})>", text)
               if not _HTML_TAG.match(m.strip()))


def doc_completeness(path: Path) -> float:
    """Fraction of the doc that looks filled in (0..1), via placeholder density."""
    text = path.read_text()
    # crude: ratio of non-placeholder content lines
    placeholders = _count_placeholders(text)
    content_lines = [l for l in text.splitlines()
                     if l.strip() and not l.strip().startswith("#")
                     and not l.strip().startswith(">")]
    if not content_lines:
        return 0.0
    # penalize by placeholder count relative to content
    score = max(0.0, 1.0 - placeholders / max(len(content_lines), 1))
    return round(score, 2)


def assumptions_filled(path: Path) -> bool:
    """Heuristic: assumptions.json differs from the shipped example values."""
    try:
        data = json.loads(path.read_text())
    except Exception:
        return False
    example = ROOT / "templates" / "assumptions.example.json"
    if example.exists():
        try:
            if json.loads(example.read_text())["scenarios"] == data.get("scenarios"):
                return False  # untouched copy of the example
        except Exception:
            pass
    return "scenarios" in data and "base" in data["scenarios"]


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("business_dir", help="path to businesses/<slug>/")
    args = ap.parse_args()

    d = Path(args.business_dir)
    if not d.is_dir():
        print(f"error: not a directory: {d}", file=sys.stderr)
        return 1

    print("=" * 60)
    print(f"  Completeness report — {d.name}")
    print("=" * 60)
    print("  (mechanical proxy for readiness; not a judgment of the idea)\n")

    guess_total = measured_total = benchmarked_total = 0
    reached_stage = None

    for stage, docs in STAGE_DOCS.items():
        print(f"  {stage}")
        stage_complete = True
        for doc in docs:
            path = d / doc
            if not path.exists():
                print(f"    ✗ {doc:<28} missing")
                stage_complete = False
                continue
            if doc == "assumptions.json":
                ok = assumptions_filled(path)
                print(f"    {'✓' if ok else '○'} {doc:<28} "
                      f"{'filled' if ok else 'still the example defaults'}")
                stage_complete = stage_complete and ok
                continue
            comp = doc_completeness(path)
            text = path.read_text()
            guess_total += len(re.findall(r"\[guess\]", text))
            measured_total += len(re.findall(r"\[measured\]", text))
            benchmarked_total += len(re.findall(r"\[benchmarked\]", text))
            bar = "█" * int(comp * 10) + "░" * (10 - int(comp * 10))
            mark = "✓" if comp >= 0.8 else ("○" if comp >= 0.3 else "✗")
            print(f"    {mark} {doc:<28} {bar} {comp*100:.0f}% filled")
            stage_complete = stage_complete and comp >= 0.5
        if stage_complete:
            reached_stage = stage
        print()

    print("  ── Evidence tags across all docs ──")
    total_tags = guess_total + measured_total + benchmarked_total
    print(f"    [measured]    {measured_total}")
    print(f"    [benchmarked] {benchmarked_total}")
    print(f"    [guess]       {guess_total}")
    if total_tags:
        guess_pct = 100 * guess_total / total_tags
        print(f"\n    {guess_pct:.0f}% of tagged claims are still [guess].")
        if guess_pct > 60:
            print("    → Mostly unvalidated. This is a hypothesis, not a forecast.")
        elif guess_pct > 30:
            print("    → Partially evidenced. Target the load-bearing guesses next.")
        else:
            print("    → Well evidenced. Close to a real decision.")
    else:
        print("\n    No confidence tags found — add [measured]/[benchmarked]/[guess].")

    print(f"\n  Furthest fully-complete stage: {reached_stage or 'none yet'}")
    print("=" * 60)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
