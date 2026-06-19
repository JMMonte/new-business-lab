# Stage 3 — Simulate

> **Goal:** Turn the model's assumptions into numbers — unit economics first,
> then growth over time, across pessimistic / base / optimistic scenarios.
> **Gate:** Under defensible assumptions, the business clears a worthwhile
> outcome; under pessimistic ones, the loss is survivable.

A simulation is only as good as its assumptions, so the point is **not** to
predict the future. It's to find: (1) which assumptions the outcome is most
sensitive to, and (2) whether the idea is even *arithmetically* capable of being
a good business. Many ideas die here on margin or CAC math alone.

## 1. Unit economics first (does ONE customer make money?)

Before any growth curve, settle the economics of a single customer. If one
customer loses money, scale just loses money faster.

```
ARPA          = average revenue per account (per month)
Gross margin  = (ARPA − variable cost per account) / ARPA
Lifetime      = 1 / monthly churn        (months a customer stays)
LTV           = ARPA × gross margin × lifetime
CAC           = fully-loaded cost to acquire one paying customer
LTV : CAC     = LTV / CAC          → want ≥ 3
CAC payback   = CAC / (ARPA × gross margin)   → want < 12 months
```

Health bars (SaaS-flavored; adjust per model):

| Metric | Healthy | Watch | Broken |
|--------|---------|-------|--------|
| Gross margin | > 70% | 40–70% | < 40% |
| LTV:CAC | > 3 | 1.5–3 | < 1.5 |
| CAC payback | < 12 mo | 12–18 mo | > 18 mo |
| Monthly churn | < 3% | 3–6% | > 6% |

`tools/simulate.py` computes all of this from `assumptions.json` and flags each.

## 2. Three scenarios — always

Never model a single line. Reality is a distribution. Build three:

- **Pessimistic** — things go badly but not catastrophically: higher CAC and
  churn, lower conversion and price. Roughly your "if we're wrong about the
  optimistic stuff" case.
- **Base** — your honest best estimate. Not your hope; your expectation.
- **Optimistic** — things break your way, but still inside physical possibility.

The job is the *spread*, not the midpoint. If the pessimistic case is fatal and
likely, the expected value is bad even if the base case is pretty.

## 3. Growth model (5 years, monthly or quarterly)

Project forward with explicit dynamics, not a flat growth %:

- **Acquisition** — new customers per period by channel; CAC per channel; does
  CAC rise as you exhaust cheap channels?
- **Retention / churn** — apply churn to the existing base each period. Churn
  compounds brutally; small differences dominate long-run outcomes.
- **Revenue** — base × ARPA, plus expansion/upsell if modeled.
- **Costs** — COGS (scales with revenue), S&M (scales with new customers), fixed
  (team, infra, overhead).
- **Cash** — the one that actually kills companies. Track the running balance,
  the **trough** (deepest point), and **runway**. Profitable-on-paper businesses
  die at the cash trough.

Key outputs: months to break-even, peak cash needed (the trough), revenue/profit
at year 3 and 5, and the customer base trajectory.

## 4. Sensitivity analysis (the real deliverable)

Vary one assumption at a time, ±25–50%, and watch the year-5 outcome. Rank
assumptions by how much they move the result. This tells you:

- **The 1–2 assumptions that dominate the outcome** → these are exactly what the
  Test stage must validate. (They should match the load-bearing assumptions from
  Think and the top risks from Audit. If they don't, reconcile.)
- **The assumptions that barely matter** → stop arguing about them.

A business whose success hinges on an unvalidated `[guess]` is a bet on that
guess. Make the bet explicit.

## 5. Output: financial model (`05-financial-model.md` + `assumptions.json`)

- `assumptions.json` — every input with value, unit, and confidence tag.
- `05-financial-model.md` — the three scenarios, the unit-economics verdict, the
  break-even / cash-trough / runway numbers, the sensitivity ranking, and a plain
  statement of which assumptions the whole thing rests on.

## Gate check

Advance to Test only if the base case is worth building **and** the pessimistic
case is survivable. If even the optimistic case is mediocre, the ceiling is too
low — kill or pivot. If the spread is enormous and driven by one guess, that
guess is your first and only experiment.

## Discipline

- Tie every number to `assumptions.json`; no magic constants in prose.
- Tag confidence on every input. A model built on `[guess]`es is a hypothesis,
  not a forecast — label it so.
- Round honestly. False precision (`$4,184,221 in year 5`) signals false
  confidence. Say "~$4M, ±50%."
