# ZenRoll — Research Report

**Status:** worked example · **Last updated:** 2026-06-17 · **Depth:** standard

> Illustrative output of the deep-research workflow. Grades come from
> `python3 tools/evidence.py businesses/_example-zenroll/evidence.jsonl`. The
> sources here are placeholders to show the *shape* — in a real run they'd be live
> links found by the subagents.

## Headline

The tip-compliance pain is real and shows up as **revealed preference** (owners
paying accountants specifically for it; 1–3★ incumbent reviews naming the gap),
and the market is well-sized via official data. But the two assumptions the
business rests on — **channel CAC** and **incumbent speed** — are the weakest
evidenced, and one social cluster pushing "huge buzz" is astroturf.

## Findings by dimension

### Market size & growth
- **~375k US restaurants have tipped staff** — `[measured]` 88/100. Triangulated
  across BLS (T1), National Restaurant Association (T2), and a vendor blog (T4,
  discounted for conflict of interest). Strong.

### Demand / pain  ⚑ load-bearing
- **Owners feel acute, switch-worthy tip-compliance pain** — `[measured]` 74/100.
  Three independent community sources incl. revealed preference (paying ~$600/mo
  to get tips right; 1–3★ Gusto reviews naming the gap). **One contradicting
  voice logged** ("Gusto tips are fine") — pain is real but not universal.

### Pricing
- **Comparable payroll ≈ $40 base + $6/employee** — `[benchmarked]` 50/100. Gusto
  public pricing (claim-against-interest, +1) + an independent comparison (T3).

### Competition & moat  ⚑ load-bearing
- **Incumbents can close the tip gap quickly** — `[measured]` 74/100. TechCrunch
  (T2) + Toast 10-Q R&D/payroll expansion (T1). Confirms audit risk #1.

### Channel & CAC  ⚑ load-bearing
- **Restaurant SaaS CAC ≈ $400–900** — `[guess]` 36/100. One stale trade
  benchmark only. **This is the thinnest load-bearing claim.**

## 🗣 Voice of the customer

> "I pay my bookkeeper ~$600/mo basically just to get tips right." — owner-operator,
> r/restaurateur `[revealed]`
> "Tip reconciliation was the scariest part of running payroll." — former operator,
> Hacker News `[stated]`
> *(1–3★ Gusto reviews on G2 repeatedly cite weak tip handling — a revealed gap.)*

Counter-voice:
> "Gusto handles our tips fine, never think about it." — r/smallbusiness `[stated]`

_Pattern:_ the pain is acute for a **subset** in tip-credit states with complex
setups; for many others incumbents are "good enough." The job is *audit-risk
relief*, and today it's hired out to accountants — which is a clue about the buyer
(see decision memo's pivot).

## Contradictions & open questions

- Demand is real but **not universal** — segment tightly to where it bites.
- No credible, current source pins restaurant-payroll **CAC by channel** — the
  decisive unknown. Research can't settle it; a channel test must.

## Quality & manipulation note

The `hype-demand` claim ("huge buzz") scored **0/100 — echo chamber**: four posts
all from one promotional account (`x.com/zenroll_fan`), out-of-segment, low
authenticity. Discarded. A reminder that volume ≠ evidence.

## What the Test stage must still measure

- [ ] **Channel CAC** — `[guess]` 36/100 → Experiment 2 (smoke test for cost per
      refundable deposit). This is the load-bearing claim research could not lift.
- [ ] **Demand urgency / who the buyer is** — `[measured]` but with a real
      counter-voice → Experiment 1 (problem interviews; owner vs accountant buyer).
