# Frameworks

The methodology of the lab. Read once; the agents, commands, and workflows
operationalize these so you rarely re-read.

The pipeline is a funnel ordered by cost. Each stage has a **gate** that must be
answered before effort flows to the next. The two ends are new and load-bearing:
it starts by knowing *who you are* and *what problem is real*, and it ends by
forcing the answer through a *simplicity filter* a non-expert would understand.

```
  0 PROFILE   know who's using this (desire · edge · values · constraints · anti-goals)
       │       Gate: a real founder profile exists to seed and bias everything
       ▼
  1 PROBLEM   understand the problem BEFORE any solution
       │       Gate: whose problem, what it costs, why-now, why-not-just-buy-X, a falsifier
       ▼
  2 IDEATE    generate → combine → negate → validate-vs-SOTA → rank   (parallel subagents)
       │       Gate: a ranked shortlist that survived attack + a reality check, and fits the founder
       ▼
  3 THINK     articulate the chosen idea into a model (one-pager, lean canvas, sizing)
       │       Gate: specific named customer + concrete money path
       ▼
  4 AUDIT     adversarial risk register + verdict
       │       Gate: load-bearing assumptions survive honest attack
       ▼
  5 SIMULATE  unit economics + scenarios
       │       Gate: base case worth building, pessimistic case survivable
       ▼
  6 TEST      cheapest experiments that could prove the load-bearing assumption false
       │       Gate: you know what result would make you continue / pivot / kill
       ▼
  7 DECIDE    build / pivot / kill — forced through the SIMPLICITY FILTER
              (explain it to your parents; "why not just buy X?")
```

| File | Stage | Read it when |
|------|-------|--------------|
| [`00-profile.md`](00-profile.md) | Profile | Onboarding a founder; the lab should know who's using it |
| [`01-problem.md`](01-problem.md) | Problem | Understanding a problem before solutioning |
| [`02-ideate.md`](02-ideate.md) | Ideate | Generating + stress-testing candidate ideas with subagents |
| [`03-think.md`](03-think.md) | Think | Articulating a chosen idea into a model |
| [`04-audit.md`](04-audit.md) | Audit | Stress-testing assumptions and risk |
| [`05-simulate.md`](05-simulate.md) | Simulate | Building the financial / growth model |
| [`06-test.md`](06-test.md) | Test | Designing validation experiments |
| [`07-decide.md`](07-decide.md) | Decide | The build/pivot/kill call + simplicity filter |
| [`research.md`](research.md) | Cross-cutting | Running the multi-agent deep-research workflow |
| [`source-valuation.md`](source-valuation.md) | Cross-cutting | Valuing sources & what people say |
| [`scoring-rubric.md`](scoring-rubric.md) | All | Scoring risk & readiness |

**Deep Research** sits beside the funnel, not inside it — it's the evidence engine
you run (via `/research`) whenever a `[guess]` blocks any gate. See
[`research.md`](research.md) and [`source-valuation.md`](source-valuation.md).

## Why this order

Most idea-evaluation fails one of two ways: it **falls in love** (skips the
problem, ideates a solution, then simulates a fantasy), or it **leaps to building**
(skips the cheap thinking). This order makes each stage cheaper than the next and
able to kill the idea on its own — and it front-loads the two things the lab
learned matter most: *is this problem even real* and *is this the right thing for
this person*. The earliest stage that can falsify the idea should be the one that
does it.

## Two standing principles

- **Lead with desire, filter with reality.** Generation starts from the founder's
  profile; viability checks come *after* and never silently veto a direction the
  founder is pulled toward. Hold the convergent verdict and the divergent
  (`visionary`) reframe together.
- **End in simplicity.** No matter how deep the analysis, the deliverable is a
  plain-language answer a non-expert would understand — above all, *why anyone
  would pay for this instead of what already exists.*

## A note on lenses (not stages)

Domain-specific angles — e.g. "for a physical/operating business, weight vertical
integration + an operational-data flywheel," or "for hardware, the build is a v2
lever, validate the route/economics first" — are **lenses applied inside Ideate
and Audit**, not pipeline stages. The general pipeline stays domain-agnostic.
