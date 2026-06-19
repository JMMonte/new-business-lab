# ZenRoll — Financial Model

**Status:** worked example · **Last updated:** 2026-06-17

> Inputs in `assumptions.json`. Regenerate with
> `python3 tools/simulate.py businesses/_example-zenroll/assumptions.json`.
> Numbers below are from that run, rounded honestly.

## Unit economics (does one customer make money?)

| Metric | Pessimistic | Base | Optimistic | Base health |
|--------|-------------|------|------------|-------------|
| ARPA (monthly) | $69 | $79 | $89 | — |
| Gross margin | 59% | 72% | 75% | 🟢 |
| Avg lifetime | 18 mo | 29 mo | 46 mo | — |
| LTV | ~$745 | ~$2.0k | ~$3.0k | — |
| CAC | $520 | $350 | $260 | — |
| LTV : CAC | 1.4x 🔴 | 4.7x 🟢 | 11.7x 🟢 | 🟢 |
| CAC payback | 12.7 mo | 6.1 mo | 3.9 mo | 🟢 |
| Monthly churn | 5.5% | 3.5% | 2.2% | 🟡 |

**Verdict on unit economics:** Base and optimistic economics are healthy
(LTV:CAC 4.7x, 6-month payback). But the *pessimistic* case is broken (1.4x) —
the whole thing hinges on keeping CAC near $350 and churn near 3.5%, both
`[guess]`. The viability question is entirely about which CAC/churn regime is real.

## Scenarios (5-year)

| | Pessimistic | Base | Optimistic |
|---|---|---|---|
| Customers (Y3) | 376 | 1,592 | 5,493 |
| Revenue (Y3, ann.) | ~$358k | ~$1.7M | ~$7.8M |
| Revenue (Y5, ann.) | ~$1.0M | ~$9.9M | ~$94M |
| Break-even | never | month 38 | month 21 |
| Peak cash needed (trough) | ~$2.8M | ~$888k | ~$121k |

The spread is enormous (~$1M to ~$94M at Y5) and driven mostly by one knob.

## Sensitivity (what moves the outcome most)

Effect of ±25% on base-case Y5 revenue, most impactful first:

1. **monthly_growth_rate** — $4.4M → $22.5M. *By far the dominant driver.* `[guess]`
2. **arpa_monthly** — $7.4M → $12.4M. `[benchmarked]`
3. **new_customers_month_1** — $7.4M → $12.4M. `[guess]`
4. churn / expansion — modest effect on revenue (large effect on cash). `[guess]`
5. CAC — no effect on *revenue* (it drives cash & break-even, not topline). `[guess]`

→ Growth rate (new-customer adds per month) and its cousin starting acquisition
are the topline drivers — and growth is a direct function of **channel CAC and
demand urgency**, the two load-bearing guesses. CAC barely moves revenue but
determines whether the pessimistic case is survivable. Test both.

## Bottom line

- **Base case worth building?** Yes — ~$10M ARR at Y5, break-even ~month 38 on
  <$1M raised.
- **Pessimistic case survivable?** No — burns ~$2.8M and never breaks even. With
  ~$750k starting cash, the pessimistic regime is a wipeout.
- **The whole thing rests on:** channel CAC (≤~$400) and demand urgency (growth).
  Both are `[guess]`. Until tested, this is a bet on those two numbers — exactly
  what the Test stage targets.
