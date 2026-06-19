# Businesses

One folder per idea. Each is created by `tools/new_business.py` (or
`/new-business`) and holds the numbered pipeline documents for that idea.

```
businesses/
├── _example-zenroll/     ← fully worked example, all four stages (read this)
└── <your-slug>/          ← your ideas
```

Naming: kebab-case slugs. The leading `_` on the example just sorts it to the top
and marks it as not-a-real-idea.

Each folder's documents read in pipeline order:

```
00-one-pager.md          07-decision-memo.md
01-lean-canvas.md        assumptions.json     (input to tools/simulate.py)
02-market-and-customer.md  evidence.jsonl     (input to tools/evidence.py)
03-business-model.md       research-report.md (written by /research)
04-audit-report.md
05-financial-model.md
06-experiment-plan.md
```

`evidence.jsonl` and `research-report.md` are produced by the deep-research
workflow (`/research`) and grade what every source — including communities and
social — is worth. See `frameworks/source-valuation.md`.

A folder doesn't need every document filled to be useful — an idea that gets
killed at the audit stage stops there, and that's a success (you saved the cost
of the later stages). Record *why* it was killed in the audit report so you don't
relitigate it.

Run `python3 tools/score.py businesses/<slug>/` to see how complete and evidenced
a folder is.
