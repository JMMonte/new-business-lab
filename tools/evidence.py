#!/usr/bin/env python3
"""Grade research claims from an evidence ledger.

Reads an evidence.jsonl (one finding per line; schema in
templates/evidence.example.jsonl), groups findings by claim, and computes an
Evidence Strength (0-100) and a [measured]/[benchmarked]/[guess] tag per claim,
using the model in frameworks/source-valuation.md.

It values formal sources (Axis 1, credibility tiers) and "what people say"
(Axis 2, voice-of-customer signal) on separate axes, rewards independent
corroboration and source-type diversity (Axis 3), rewards revealed preference,
penalizes contradictions and echo chambers, and flags load-bearing claims that
are still weakly evidenced.

Usage:
    python3 tools/evidence.py businesses/<slug>/evidence.jsonl
    python3 tools/evidence.py <file> --json
"""
from __future__ import annotations

import argparse
import json
import sys
from collections import defaultdict

TIER_BASE = {"T1": 5, "T2": 4, "T3": 3, "T4": 2, "T5": 1, "T6": 0}
KIND_REVEAL = {"revealed": 5, "measured": 5, "intent": 3, "stated": 1, "factual": 0}


def voc_signal(entry: dict) -> float:
    """Voice-of-customer signal strength 0-5 (Axis 2)."""
    voc = entry.get("voc") or {}
    reveal = KIND_REVEAL.get(entry.get("kind", "stated"), 1)
    auth = voc.get("authenticity", 3)
    spec = voc.get("specificity", 3)
    inten = voc.get("intensity", 3)
    # revealed-vs-stated weighted x2
    raw = (2 * reveal + auth + spec + inten) / 5.0
    if voc.get("in_segment", True) is False:
        raw *= 0.5
    return max(0.0, min(5.0, raw))


def entry_contribution(entry: dict) -> float:
    """A single finding's 0-60 contribution to strength.

    VoC entries are scored on signal; everything else on source credibility.
    Community sources thus *can* score high — but only for demand/pain claims
    where they carry a voc block.
    """
    if entry.get("voc") is not None:
        return voc_signal(entry) * 12.0
    cred = TIER_BASE.get(entry.get("source_type", "T6"), 0) + entry.get("adjust", 0)
    cred = max(0, min(5, cred))
    return cred * 12.0


def strength(entries: list[dict]) -> dict:
    supports = [e for e in entries if e.get("stance", "supports") == "supports"]
    against = [e for e in entries if e.get("stance") == "contradicts"]

    best = max((entry_contribution(e) for e in supports), default=0.0)

    sup_origins = {e.get("origin") or e.get("url") or id(e) for e in supports}
    against_origins = {e.get("origin") or e.get("url") or id(e) for e in against}
    types = {e.get("source_type") for e in supports if e.get("source_type")}

    corroboration = min(24, 8 * max(0, len(sup_origins) - 1))
    diversity = min(12, 6 * max(0, len(types) - 1))
    revealed = 10 if any(e.get("kind") in ("revealed", "measured") for e in supports) else 0
    contradiction = 12 * len(against_origins)
    echo = -15 if (len(supports) >= 4 and len(sup_origins) <= 1) else 0

    s = best + corroboration + diversity + revealed - contradiction + echo
    s = max(0, min(100, round(s)))

    # Strength of the DISconfirming case, scored the same way. Without this, a
    # claim backed only by solid "contradicts" findings shows 0/100 — reading as
    # "no evidence" when it's actually well-sourced bad news.
    contra_best = max((entry_contribution(e) for e in against), default=0.0)
    contra = max(0, min(100, round(contra_best + min(24, 8 * max(0, len(against_origins) - 1)))))
    refuted = contra >= 40 and contra >= s

    if refuted:
        tag = "[refuted]"
    elif s >= 70:
        tag = "[measured]"
    elif s >= 40:
        tag = "[benchmarked]"
    else:
        tag = "[guess]"

    return {
        "strength": s,
        "contra_strength": contra,
        "rank": max(s, contra),
        "refuted": refuted,
        "tag": tag,
        "supporting": len(supports),
        "independent_sources": len(sup_origins),
        "type_diversity": len(types),
        "revealed": bool(revealed),
        "contradictions": len(against_origins),
        "echo_chamber": echo < 0,
        "load_bearing": any(e.get("load_bearing") for e in entries),
    }


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("ledger", help="path to evidence.jsonl")
    ap.add_argument("--json", action="store_true", help="machine-readable output")
    args = ap.parse_args()

    claims: dict[str, list[dict]] = defaultdict(list)
    meta: dict[str, dict] = {}
    try:
        with open(args.ledger) as f:
            for n, line in enumerate(f, 1):
                line = line.strip()
                if not line or line.startswith("//") or line.startswith("#"):
                    continue
                try:
                    e = json.loads(line)
                except json.JSONDecodeError as err:
                    print(f"warning: skipping line {n}: {err}", file=sys.stderr)
                    continue
                cid = e.get("claim_id", "unlabeled")
                claims[cid].append(e)
                meta.setdefault(cid, {"claim": e.get("claim", cid),
                                      "dimension": e.get("dimension", "—")})
    except FileNotFoundError:
        print(f"error: file not found: {args.ledger}", file=sys.stderr)
        return 1

    if not claims:
        print("error: no evidence entries found", file=sys.stderr)
        return 1

    graded = {cid: {**meta[cid], **strength(entries)}
              for cid, entries in claims.items()}
    ordered = sorted(graded.items(), key=lambda kv: kv[1]["rank"], reverse=True)

    if args.json:
        print(json.dumps(graded, indent=2))
        return 0

    print("=" * 70)
    print(f"  Evidence ledger — {len(claims)} claims, "
          f"{sum(len(v) for v in claims.values())} findings")
    print("=" * 70)
    for cid, g in ordered:
        # show whichever case is stronger — support, or (for refuted) the contra case
        score = g["contra_strength"] if g["refuted"] else g["strength"]
        bar = "█" * (score // 10) + "░" * (10 - score // 10)
        lb = " ⚑LOAD-BEARING" if g["load_bearing"] else ""
        print(f"\n  {g['tag']:<13} {bar} {score:>3}/100  [{g['dimension']}]{lb}")
        print(f"    {g['claim']}")
        if g["refuted"]:
            bits = [f"REFUTED by {g['contradictions']} independent source(s) "
                    f"(disconfirming strength {g['contra_strength']}/100)"]
        else:
            bits = [f"{g['independent_sources']} indep. source(s)",
                    f"{g['type_diversity']} type(s)"]
            if g["revealed"]:
                bits.append("revealed-preference ✓")
            if g["contradictions"]:
                bits.append(f"⚠ {g['contradictions']} contradiction(s) "
                            f"(contra {g['contra_strength']}/100)")
        if g["echo_chamber"]:
            bits.append("⚠ echo chamber")
        print(f"    ({', '.join(bits)})")

    # ---- attention list ----
    weak_lb = [g for _, g in ordered
               if g["load_bearing"] and g["tag"] != "[measured]"]
    echoes = [g for _, g in ordered if g["echo_chamber"]]
    print("\n" + "-" * 70)
    if weak_lb:
        print("  ⚑ Load-bearing claims still weakly evidenced — TEST THESE NEXT:")
        for g in weak_lb:
            print(f"      {g['tag']} {g['strength']}/100 — {g['claim']}")
    else:
        print("  ✓ All load-bearing claims reach [measured].")
    if echoes:
        print("\n  ⚠ Possible echo chambers (many findings, one origin):")
        for g in echoes:
            print(f"      {g['claim']}")
    print("=" * 70)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
