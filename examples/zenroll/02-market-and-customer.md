# ZenRoll — Market & Customer

**Status:** worked example · **Last updated:** 2026-06-17

## Bottom-up market sizing

| Layer | How counted | # customers | Annual price | Value |
|-------|-------------|-------------|--------------|-------|
| **TAM** — all US restaurants w/ tipped staff | ~749k US restaurants `[benchmarked]`, ~50% full-service/tipped | ~375k | $950 | ~$356M |
| **SAM** — independents, 1–3 locations, tip-credit states | exclude chains & no-tip-credit states `[guess]` | ~280k | $950 | ~$266M |
| **SOM** — winnable in 3 yrs (~1% of SAM) | early-adopter conversion `[guess]` | ~2,800 | $950 | ~$2.7M ARR |

_Why-now:_ rising tip-reporting enforcement + embedded-payroll APIs lower the
build cost. `[benchmarked]`
_Growth:_ flat unit count, rising compliance complexity → rising willingness to pay.

## Early-adopter profile

- **Who:** owner-operator, 1–3 full-service locations, 15–60 tipped staff, in a
  tip-credit state.
- **The pain, concretely:** the quarterly moment they reconcile declared tips vs
  POS tips for FICA, and the fear of a DOL letter.
- **Today:** Gusto/ADP + spreadsheet + a $300–800/mo accountant. `[benchmarked]`
- **Where they congregate:** state restaurant associations, Toast/Square
  ecosystems, r/restaurateur, local accountant networks.
- **Trigger to buy:** a near-miss audit, a back-pay claim, or onboarding a 2nd
  location.

## Competitive landscape

| Alternative | What it is | Why we beat it | Why they might win |
|-------------|-----------|----------------|--------------------|
| Do nothing / spreadsheet | manual tip math | removes audit risk | "good enough until it isn't" |
| Gusto / ADP | generic payroll | tip-compliance is native, not bolted on | huge brand, can add tip features |
| Toast Payroll | POS-integrated payroll | deeper compliance, POS-agnostic | already in the restaurant, bundled |
| Local accountant | human service | cheaper, always-on, self-serve | trusted relationship |

## Open questions

- Is tip-compliance pain strong enough to overcome incumbent switching costs?
- Will Toast/Gusto simply close the feature gap? (Top audit risk.)
