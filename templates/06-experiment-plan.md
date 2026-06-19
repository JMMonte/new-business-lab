# <Business name> — Experiment Plan

**Status:** Test · **Last updated:** <date>

> Cheapest experiments that could prove the load-bearing assumptions *false*,
> with success & kill thresholds set *before* running. See `frameworks/06-test.md`.

## Prioritized experiments

Ordered by (information value) / (cost + time). #1 attacks the load-bearing
assumption.

### Experiment 1 — <name>  ·  Ladder rung: <Problem/Demand/Solution/WTP/Channel/Retention>

- **Hypothesis:** We believe <specific assumption>. `[guess → ?]`
- **Test:** <specific action> with <who / how many>.
- **Primary metric:** <one number>.
- **Success:** ≥ <threshold> → supported.
- **Kill:** ≤ <threshold> → assumption false → <consequence: pivot/kill>.
- **Cost / time:** $<…> / <…> days.

### Experiment 2 — <name>  ·  Rung: <…>
- **Hypothesis:** <…>
- **Test:** <…>
- **Primary metric / Success / Kill:** <…>
- **Cost / time:** <…>

### Experiment 3 — <name>
<…>

## Experiment 1 — run plan (this week)

<Exact steps: what to build/write, where to run it, how to recruit, what to
record, decision date.>

## Decision tree

```
Exp 1 → PASS  → run Exp 2
        FAIL  → <pivot to … / kill>
        AMBIGUOUS → <larger sample / sharper test>
```

## Budget & timeline to a build/kill decision

| Experiment | Cost | Days | Cumulative |
|-----------|------|------|-----------|
| 1 | $<…> | <…> | $<…> |
| 2 | $<…> | <…> | $<…> |
| 3 | $<…> | <…> | $<…> |

**Total to decision:** $<…> over <…> weeks.

## Anti-vanity check

Primary metrics here measure behavior with a cost attached (payment, repeat use,
real CAC) — not views, signups, or survey "yes." <Confirm or note exceptions.>
