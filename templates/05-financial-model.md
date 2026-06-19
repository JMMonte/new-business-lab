# <Business name> — Financial Model

**Status:** Simulate · **Last updated:** <date>

> Inputs live in `assumptions.json`; run `python3 tools/simulate.py
> businesses/<slug>/assumptions.json` to regenerate the numbers below. Tag every
> assumption's confidence. See `frameworks/05-simulate.md`.

## Unit economics (does one customer make money?)

| Metric | Value | Health |
|--------|-------|--------|
| ARPA (monthly) | $<…> | — |
| Gross margin | <…>% | 🟢/🟡/🔴 |
| Avg lifetime | <…> mo | — |
| LTV | $<…> | — |
| CAC | $<…> | — |
| LTV : CAC | <…> | 🟢/🟡/🔴 |
| CAC payback | <…> mo | 🟢/🟡/🔴 |
| Monthly churn | <…>% | 🟢/🟡/🔴 |

**Verdict on unit economics:** <do the economics of a single customer work?>

## Scenarios (5-year)

| | Pessimistic | Base | Optimistic |
|---|---|---|---|
| Customers (Y3) | <…> | <…> | <…> |
| Revenue (Y3) | $<…> | $<…> | $<…> |
| Revenue (Y5) | $<…> | $<…> | $<…> |
| Break-even | <month/never> | <…> | <…> |
| Peak cash needed (trough) | $<…> | $<…> | $<…> |

## Sensitivity (what moves the outcome most)

Ranked by impact on Y5 outcome when varied ±25–50%:

1. **<assumption>** — <how much it moves things>. Confidence: `[tag]`
2. **<assumption>** — <…>. `[tag]`
3. **<assumption>** — <…>. `[tag]`

→ The Test stage must validate #1 (and #2) first; the outcome rests on them.

## Bottom line

- **Base case worth building?** <yes/no — what outcome it produces>
- **Pessimistic case survivable?** <yes/no — the downside loss>
- **The whole thing rests on:** <the 1–2 assumptions, and their current tags>
