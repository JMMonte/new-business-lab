---
description: Adversarially audit a business idea and produce a risk-ranked verdict
argument-hint: "<business slug>"
---

Audit the idea in `businesses/$1/` using the `auditor` agent (follow
`${CLAUDE_PLUGIN_ROOT}/frameworks/04-audit.md` and `${CLAUDE_PLUGIN_ROOT}/frameworks/scoring-rubric.md`).

Be adversarial: try to break the idea, hardest at its load-bearing assumptions.
Work every risk category (demand, market, competition/moat, economics,
execution/team, legal, channel), score each Likelihood × Impact, verify factual
claims with web search, run a pre-mortem, and write `04-audit-report.md` with a
risk register, top-3 narrative, **verdict** (continue / continue-if / pivot /
kill), and **kill criteria**.

Finish with the verdict, the single biggest risk, and the next step.
