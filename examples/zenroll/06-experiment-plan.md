# ZenRoll — Experiment Plan

**Status:** worked example · **Last updated:** 2026-06-17

> Cheapest experiments that could prove the two load-bearing assumptions — demand
> urgency and channel CAC — false. Thresholds set *before* running.

## Prioritized experiments

### Experiment 1 — Demand urgency interviews · Rung: Problem
- **Hypothesis:** ≥8% of target owners feel tip-compliance pain enough to switch
  payroll. `[guess → ?]`
- **Test:** 25 problem interviews with owner-operators in tip-credit states
  (recruited via associations + cold outreach). Ask about the *last* compliance
  scare and what they did — not about ZenRoll.
- **Primary metric:** % who describe tip-compliance as a top-3 pain *and* have
  taken action (paid someone, switched, lost sleep) in the last 12 months.
- **Success:** ≥ 30% → strong; 15–30% → marginal.
- **Kill:** < 15% → demand too weak → kill or pivot to accountants-as-buyers.
- **Cost / time:** ~$500 incentives / 2 weeks.

### Experiment 2 — Channel CAC smoke test · Rung: Demand + Channel
- **Hypothesis:** we can generate qualified demand at < $350 CAC. `[guess → ?]`
- **Test:** landing page ("tip-compliant payroll") + $3k across paid search and
  one association webinar; measure cost per booked demo / pre-order deposit.
- **Primary metric:** cost per $1 refundable pre-order deposit (real intent).
- **Success:** implied CAC < $400.
- **Kill:** implied CAC > $500 with no channel under $400 → kill (per audit).
- **Cost / time:** ~$3,500 / 3 weeks.

### Experiment 3 — Concierge payroll pilot · Rung: Solution + Retention
- **Hypothesis:** owners will pay $79+/mo and stay once they feel the relief.
- **Test:** run 5 restaurants' tip-compliant payroll manually (concierge) for 2
  months at full price.
- **Metric / Success / Kill:** ≥ 4/5 renew month 3 → proceed; ≤ 2/5 → solution
  doesn't stick.
- **Cost / time:** ~$2,000 labor / 8 weeks.

## Experiment 1 — run plan (this week)

Draft a 7-question interview guide focused on the last compliance event. Recruit
25 via two state restaurant associations + 50 cold LinkedIn/email touches.
Record, tag pain intensity 1–5, decision date in 2 weeks.

## Decision tree

```
Exp 1 → PASS (≥30%) → run Exp 2
        MARGINAL     → run Exp 2 but raise the CAC bar
        FAIL (<15%)  → pivot to accountants-as-buyers, or kill
Exp 2 → CAC <$400 → run Exp 3 (build/kill after)
        CAC >$500 → KILL (audit kill criterion met)
```

## Budget & timeline to a build/kill decision

| Experiment | Cost | Days | Cumulative |
|-----------|------|------|-----------|
| 1 | $500 | 14 | $500 |
| 2 | $3,500 | 21 | $4,000 |
| 3 | $2,000 | 56 | $6,000 |

**Total to decision:** ~$6,000 over ~10 weeks.

## Anti-vanity check

Primary metrics are behavioral and cost-attached: refundable deposits (not
signups), renewals (not logins), action-taken in interviews (not survey "yes").
