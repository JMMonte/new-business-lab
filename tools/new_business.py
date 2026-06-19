#!/usr/bin/env python3
"""Scaffold a new business idea folder from the templates.

Usage:
    python3 tools/new_business.py "AI bookkeeping for solo landlords"
    python3 tools/new_business.py "Idea" --slug custom-slug

Creates businesses/<slug>/ with all numbered templates copied in (and the idea
name + today's date substituted), plus assumptions.json from the example.
Refuses to overwrite an existing folder.
"""
from __future__ import annotations

import argparse
import datetime
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent          # the plugin/repo root
TEMPLATES = ROOT / "templates"                          # templates ship with the plugin
# Output goes into the USER's current working directory, not the plugin dir, so the
# scaffolder works the same whether run from a checkout or an installed plugin.
BUSINESSES = Path.cwd() / "businesses"


def slugify(text: str) -> str:
    s = text.lower().strip()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return re.sub(r"-+", "-", s).strip("-")[:60]


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("idea", help="the idea, in a few words (used as the name)")
    ap.add_argument("--slug", help="override the auto-generated folder slug")
    args = ap.parse_args()

    slug = args.slug or slugify(args.idea)
    if not slug:
        print("error: could not derive a slug from the idea", file=sys.stderr)
        return 1

    dest = BUSINESSES / slug
    if dest.exists():
        print(f"error: {dest.relative_to(ROOT)} already exists — refusing to "
              "overwrite", file=sys.stderr)
        return 1

    today = datetime.date.today().isoformat()
    dest.mkdir(parents=True)

    copied = []
    for tpl in sorted(TEMPLATES.glob("*.md")):
        # README is docs; *.template.md (e.g. the founder profile) are not per-idea docs
        if tpl.name == "README.md" or tpl.name.endswith(".template.md"):
            continue
        text = tpl.read_text()
        text = text.replace("<Business name>", args.idea)
        text = text.replace("<date>", today)
        (dest / tpl.name).write_text(text)
        copied.append(tpl.name)

    # assumptions.json from the example, with the name filled in
    example = TEMPLATES / "assumptions.example.json"
    if example.exists():
        text = example.read_text().replace("Example Business", args.idea)
        (dest / "assumptions.json").write_text(text)
        copied.append("assumptions.json")

    # evidence.jsonl seeded with the schema header only (no sample data rows),
    # so /research and tools/evidence.py have the format to append to.
    ev_example = TEMPLATES / "evidence.example.jsonl"
    if ev_example.exists():
        header = [ln for ln in ev_example.read_text().splitlines()
                  if ln.startswith("//") or not ln.strip()]
        (dest / "evidence.jsonl").write_text("\n".join(header) + "\n")
        copied.append("evidence.jsonl")

    print(f"✓ Created businesses/{slug}/ with {len(copied)} files:")
    for name in copied:
        print(f"    {name}")
    print(f"\nNext: start the Think stage — fill in "
          f"businesses/{slug}/00-one-pager.md")
    print("(With Claude Code: just say `think about businesses/"
          f"{slug}` or run `/audit {slug}` once Think is done.)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
