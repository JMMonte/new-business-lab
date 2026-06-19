# Tools

Small, dependency-free Python scripts (stdlib only, Python 3.9+). Run from the
repo root.

## `new_business.py` — scaffold an idea

```bash
python3 tools/new_business.py "AI bookkeeping for solo landlords"
python3 tools/new_business.py "Idea name" --slug custom-slug
```

Creates `businesses/<slug>/` with every numbered template copied in (name + date
substituted) and `assumptions.json` seeded from the example. Won't overwrite an
existing folder.

## `simulate.py` — unit economics + scenarios

```bash
python3 tools/simulate.py businesses/<slug>/assumptions.json
python3 tools/simulate.py businesses/<slug>/assumptions.json --json
```

Prints unit economics (gross margin, LTV, LTV:CAC, payback, churn) with health
flags, a 5-year projection across pessimistic/base/optimistic scenarios
(customers, revenue, break-even, peak cash needed), and a sensitivity ranking
showing which assumption moves the outcome most. `--json` emits machine-readable
output. See `templates/assumptions.example.json` for the input schema.

## `evidence.py` — grade research claims by source value

```bash
python3 tools/evidence.py businesses/<slug>/evidence.jsonl
python3 tools/evidence.py businesses/<slug>/evidence.jsonl --json
```

Reads the evidence ledger (schema: `templates/evidence.example.jsonl`), groups
findings by claim, and computes an **Evidence Strength (0–100)** and a
`[measured]/[benchmarked]/[guess]` tag per claim using the model in
`frameworks/source-valuation.md`. It values formal sources (credibility tiers) and
voice-of-customer signal (revealed-vs-stated, authenticity, etc.) on separate
axes, rewards independent corroboration and source-type diversity, penalizes
contradictions and echo chambers, and **flags load-bearing claims that are still
weakly evidenced** — your shortlist for the Test stage. The ledger is normally
written by the `/research` workflow, but you can hand-author or edit it.

## `score.py` — completeness & evidence proxy

```bash
python3 tools/score.py businesses/<slug>/
```

Reports how filled-in each stage's documents are and what fraction of tagged
claims are still `[guess]`. It's a mechanical proxy for the readiness rubric — it
measures evidence and completeness, **not** whether the idea is good. Judging the
idea is the auditor's job (`/audit`).

---

All three are intentionally simple and readable — adapt the assumptions model in
`simulate.py` to your business type (marketplace take-rate, transaction volume,
hardware BOM, etc.) rather than forcing a SaaS shape onto everything.
