# ZenRoll — Business Model

**Status:** worked example · **Last updated:** 2026-06-17

## How it makes money

- **Model:** SaaS subscription (per-location base + per-employee).
- **What we charge for:** running compliant payroll + tip reporting.
- **Price point:** $79/mo base + $6/employee/mo → ~$79 blended ARPA at ~12
  tipped employees, ~$950/yr. `[benchmarked]` (vs Gusto ~$40 base + $6/person)
- **Why this price:** priced below a part-time bookkeeper, at a premium to
  generic payroll, justified by audit-risk reduction.

## Pricing tiers

| Tier | Price | For whom | Key limits |
|------|-------|----------|-----------|
| Solo | $79/mo + $6/emp | 1 location | single state |
| Multi | $149/mo + $6/emp | 2–3 locations | multi-state |
| Accountant | rev-share | firms reselling | white-label |

## Channels & go-to-market

| Channel | How it works | Scales? | Est. CAC | Confidence |
|---------|-------------|---------|----------|-----------|
| Restaurant associations | sponsorships, webinars, member perks | partly | $300 | `[guess]` |
| POS partners (Toast/Square) | marketplace listing, co-marketing | yes if approved | $250 | `[guess]` |
| Accountant referrals | rev-share with bookkeepers | partly | $200 | `[guess]` |
| Content/SEO ("restaurant tip compliance") | organic | slowly | $150 | `[guess]` |

_Primary channel bet:_ POS-partner marketplace — the only one that scales without
CAC exploding. Also the biggest single dependency (platform risk).

## Cost structure

- **Variable / customer:** payroll-rails fees + support ≈ $22/mo `[benchmarked]`
  → ~72% gross margin.
- **CAC:** blended ~$350 target `[guess]` — the load-bearing number.
- **Fixed:** compliance + eng + ops team ≈ $60k/mo at seed stage. `[guess]`

## Path to defensibility

Multi-state tip-compliance rules engine is genuinely hard and slow to build, but
it's **catch-up-able** by a funded incumbent. Real moat would come from POS
exclusivity or accountant-network lock-in — neither secured. **Moat is the
weakest part of the model** (see audit, risk #1).
