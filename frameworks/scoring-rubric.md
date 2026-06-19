# Scoring Rubric

A shared scale so "risky" and "ready" mean the same thing across ideas and over
time. Used by the Audit stage (risk scores) and by `tools/score.py` (readiness).

## Risk scoring (used in the audit register)

**Risk score = Likelihood × Impact**, each 1–5. Range 1–25.

**Likelihood** — how likely is this assumption wrong / this risk to materialize?

| | |
|--|--|
| 1 | Very unlikely — strong `[measured]` evidence it's fine |
| 2 | Unlikely — good `[benchmarked]` reasons |
| 3 | Plausible — genuinely uncertain, a `[guess]` |
| 4 | Likely — weak reasons to think it's fine |
| 5 | Very likely — evidence already points the wrong way |

**Impact** — if it goes wrong, how bad?

| | |
|--|--|
| 1 | Minor — a nuisance, easily absorbed |
| 2 | Moderate — hurts margins/growth, survivable |
| 3 | Serious — forces a real pivot |
| 4 | Severe — threatens viability |
| 5 | Fatal — the business cannot exist |

**Bands:**

| Score | Band | Meaning |
|-------|------|---------|
| 20–25 | 🔴 Critical | Likely fatal. Must resolve before proceeding, or kill. |
| 12–19 | 🟠 High | Could sink it. A load-bearing assumption to test first. |
| 6–11 | 🟡 Medium | Watch and mitigate; revisit after experiments. |
| 1–5 | 🟢 Low | Note and move on. |

Any single 🔴 with no plausible mitigation = **Kill**. A cluster of 🟠 on the same
theme (e.g. all economics) often means **Pivot**.

## Readiness scoring (used to decide whether to advance a stage)

Each of six dimensions scored 0–5. Total /30. This measures *how well-evidenced
the idea is*, not how good it is — a great idea can have low readiness early.

| Dimension | 0 | 5 |
|-----------|---|---|
| **Problem clarity** | vague "people want X" | named customer, frequent urgent pain, evidenced |
| **Solution fit** | hand-wave | clear mechanism; prototype or concierge proof |
| **Market** | "huge market" top-down | bottom-up SOM, counted customers, why-now |
| **Economics** | no numbers | unit economics modeled; LTV:CAC & payback computed |
| **Evidence** | all `[guess]` | load-bearing claims `[measured]` from real tests |
| **Moat & team** | "we'll work hard" | concrete advantage + founder–market fit |

**Readiness gates:**

| Total | Stage it's ready for |
|-------|---------------------|
| 0–9 | Still Thinking — too vague to audit |
| 10–17 | Audited; ready to Simulate |
| 18–23 | Simulated; ready to Test |
| 24–30 | Tested & evidenced; ready for a build/kill decision |

Readiness should *rise as evidence accumulates*, not as optimism does. If the
score climbs while every input is still a `[guess]`, you're scoring your mood.

## Confidence tags (use everywhere)

- `[measured]` — from a real test, your data, or a primary source you can cite.
- `[benchmarked]` — from a comparable company/market; reasonable but not yours.
- `[guess]` — an estimate. Legitimate early, but every load-bearing `[guess]` is
  a future experiment.

The proportion of load-bearing claims that are still `[guess]` is the single best
indicator of how far the idea is from a real decision.
