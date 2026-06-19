# ZenRoll — Decision Memo

**Status:** worked example · **Date:** 2026-06-17 · **Decision:** PIVOT

> Illustrative outcome for the example. The experiments below are written as if
> run, to show how the loop closes.

## What we believed (going in)

A standalone payroll tool that makes tip-compliance impossible to get wrong would
win independent restaurants, at ~$350 CAC and ~3.5% churn, reaching ~$10M ARR by
Y5 (base case).

## What we tested

Experiment 1 (25 problem interviews) and Experiment 2 (a $3.5k channel smoke test).
We stopped before Experiment 3.

## What we learned (measured)

| Assumption | Before | After (measured) | Verdict |
|-----------|--------|------------------|---------|
| Demand urgency (% switch-worthy pain) | ≥8% `[guess]` | 36% of interviewed owners, but 80% said their **accountant** should own this `[measured]` | partly supported, wrong buyer |
| Direct-to-owner CAC | ≤$350 `[guess]` | ~$610 implied from smoke test `[measured]` | **refuted** |
| Accountant interest (unplanned finding) | — | 6/9 accountants wanted to resell `[measured]` | new signal |

The pain is real, but **owners want to delegate it, not buy software for it**, and
direct-to-owner acquisition is too expensive — CAC came in at ~$610, above the
$500 kill line. Accountants, however, surfaced unprompted as eager resellers.

## Updated economics

Re-running `simulate.py` with measured direct CAC ($610) pushes the base case
into the pessimistic regime (LTV:CAC ≈ 1.5, never breaks even). The original
direct-to-owner model is not viable on measured data.

## The decision

**PIVOT** — from *direct-to-owner SaaS* to *white-label tip-compliance payroll
sold through accountants and bookkeepers*. This keeps the validated asset (the
compliance rules engine + real demand) and replaces the broken assumption (direct
CAC). It also partly addresses the #1 audit risk: an accountant channel is a
stickier moat than a feature. New load-bearing assumption to test next:
**accountant reseller CAC and per-firm seat expansion.**

## What this taught us (for the next idea)

- "Who has the pain" and "who will buy the software" are often different people —
  test the *buyer*, not just the pain.
- The audit's #1 risk (no moat) and the smoke-test CAC were the real story; the
  healthy base-case spreadsheet was a distraction until the CAC `[guess]` was
  measured. **Measure the load-bearing guess before trusting the model.**
