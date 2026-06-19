# ZenRoll — Audit Report

**Status:** worked example · **Last updated:** 2026-06-17 · **Auditor:** example

> Adversarial review. See `frameworks/02-audit.md` and the scoring rubric.

## Risk register

Risk = Likelihood × Impact (1–5 each). Sorted by score, highest first.

| # | Category | Risk (the claim being attacked) | L | I | Score | Band | Evidence |
|---|----------|--------------------------------|---|---|-------|------|----------|
| 1 | Competition/Moat | Incumbents (Gusto, Toast) close the tip-compliance gap before we reach scale | 4 | 5 | 20 | 🔴 | `[benchmarked]` — both ship features fast |
| 2 | Channel | No channel delivers CAC < $400; payroll CAC is notoriously high | 4 | 4 | 16 | 🟠 | `[guess]` |
| 3 | Demand | Owners treat compliance as "good enough" until audited; low switching urgency | 3 | 4 | 12 | 🟠 | `[guess]` |
| 4 | Execution | Multi-state payroll + compliance is heavy to build & maintain correctly | 3 | 4 | 12 | 🟠 | `[benchmarked]` |
| 5 | Economics | Support cost per restaurant higher than modeled (payroll = high-touch) | 3 | 3 | 9 | 🟡 | `[guess]` |
| 6 | Legal | Liability if our calc is wrong and a customer is penalized | 2 | 4 | 8 | 🟡 | `[benchmarked]` |
| 7 | Platform | POS partner (Toast) launches competing payroll / revokes access | 2 | 4 | 8 | 🟡 | `[benchmarked]` |
| 8 | Market | Tipped-restaurant count flat; some states ending tip credit | 2 | 2 | 4 | 🟢 | `[benchmarked]` |

## Top 3 risks (narrative)

### 1. Moat — incumbents close the gap (🔴 20)
**Claim:** tip-compliance depth is defensible. **Attack:** it's a feature, not a
company; Gusto already has basic tip handling and ships fast, and Toast owns the
in-restaurant relationship. A focused incumbent could neutralize the wedge in 2–3
quarters. **Resolve:** secure a structural moat (POS exclusivity or
accountant-network lock-in) — or accept this is an acquisition play, not a
standalone one.

### 2. Channel CAC (🟠 16)
**Claim:** CAC < $350. **Attack:** payroll is a high-consideration, low-trust
purchase; restaurant owners are hard and expensive to reach; comparable payroll
CACs run $400–900. **Resolve:** Experiment 2 — a real paid + partner channel test.

### 3. Demand urgency (🟠 12)
**Claim:** ≥8% feel the pain enough to switch. **Attack:** most owners haven't
been audited and discount the risk; inertia on payroll is huge. **Resolve:**
Experiment 1 — problem interviews measuring switching intent, not nods.

## Pre-mortem

Three years out, ZenRoll failed because Toast shipped "Toast Payroll Tip
Compliance" bundled into the POS every restaurant already used, and ZenRoll
couldn't acquire customers fast enough or cheaply enough to build a moat before
the wedge closed. _(Matches risk #1 + #2.)_

## Verdict

**Continue-if** — the problem is real and the economics *can* work (base-case unit
economics are healthy), but the idea has no durable moat. Continue only to test
whether (a) demand urgency and (b) channel CAC are strong enough to justify a
land-grab toward an acqui-hire or category-leader outcome. If both are weak, kill.

## Kill criteria

- [ ] Blended CAC > $500 with no single channel under $400 (Experiment 2).
- [ ] < 8% of interviewed owners describe tip-compliance as a switch-worthy pain
      (Experiment 1).
- [ ] Pessimistic-case unit economics confirmed (LTV:CAC < 1.5) on measured data.

## Readiness score

Problem 4/5 · Solution 4/5 · Market 4/5 · Economics 3/5 · Evidence 2/5 · Moat&Team 2/5
**Total: 19/30** → ready to Simulate, then Test the two load-bearing guesses.
