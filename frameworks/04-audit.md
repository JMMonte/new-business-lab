# Stage 2 — Audit

> **Goal:** Attack the idea on paper, hardest at its load-bearing assumptions,
> and produce a risk-ranked verdict. **Gate:** The load-bearing assumptions
> survive honest attack — or the idea is killed/pivoted here, cheaply.

The audit is adversarial by design. You are trying to *break* the idea before the
market does it for you at far greater cost. An idea that survives a real audit is
worth simulating; one that doesn't, isn't.

## How to run it

For each item below: state the claim the idea is making, attack it, and rate the
**risk** = *likelihood it's wrong* × *damage if it's wrong* (1–5 each, see the
rubric). Record evidence and mark it `[measured] / [benchmarked] / [guess]`.

### A. Demand risk — "do they actually want it?"
- Is this a painkiller or a vitamin? How do you know?
- What do customers do *today*? Is "nothing / a spreadsheet" good enough that
  they won't switch?
- Is the pain frequent and urgent, or rare and deferrable?
- Evidence of willingness to pay, not just willingness to nod in a survey.

### B. Market risk — "is it big and reachable enough?"
- Does the bottom-up SOM support the ambition (lifestyle business vs venture)?
- Is the market growing, flat, or shrinking? Why now — what changed?
- Timing: too early (market not ready) or too late (incumbents entrenched)?

### C. Competition & moat risk — "can you win and keep it?"
- Map incumbents, substitutes, and "do nothing." For each: why do you beat them?
- What stops a well-funded incumbent from copying you in 6 months?
- Is the unfair advantage real (network effects, switching costs, proprietary
  data/access, regulation, brand) or aspirational?

### D. Economics risk — "does the money work?"
- Gross margin at scale. Does it survive the variable costs (incl. AI/compute,
  support, payments, refunds)?
- CAC vs LTV: is LTV:CAC plausibly ≥ 3 and payback < 12 months?
- Any structural cost that doesn't fall with scale? (Hands-on services, hardware.)

### E. Execution & team risk — "can this team build and sell it?"
- Why this team for this problem? Domain access, distribution, technical ability.
- What's the hardest thing to build, and is it actually feasible now?
- Single points of failure (one channel, one supplier, one platform, one person).

### F. Regulatory, legal & ethical risk
- Licensing, data/privacy (GDPR/CCPA), financial/health regulation, IP, liability.
- Platform dependency: can a policy change at Apple/Google/Meta/OpenAI kill you?
- Ethical landmines that become reputational or legal cost.

### G. Channel & distribution risk
- How do customers find you, and does that channel scale without CAC exploding?
- "Build it and they will come" is a finding, not a plan.

## The pre-mortem

Imagine it's three years out and the business has failed. Write the post-mortem:
the single most likely cause of death. This surfaces the risk your optimism is
hiding. The pre-mortem's cause of death should match one of your top risks — if
it doesn't, you've mis-ranked them.

## Output: the audit report (`04-audit-report.md`)

1. **Risk register** — table of every risk, scored, sorted by score descending.
2. **Top 3 risks** — narrative on the three highest, with what would mitigate or
   resolve each.
3. **Pre-mortem** — the most likely cause of death.
4. **Verdict** — one of:
   - **Continue** — load-bearing assumptions are plausible; proceed to Simulate.
   - **Continue-if** — proceed only after resolving a specific open question.
   - **Pivot** — the problem/customer is real but the current approach is wrong.
   - **Kill** — a fatal risk with no plausible mitigation.
5. **Kill criteria** — the specific findings (from Simulate or Test) that would
   flip a Continue into a Kill. Write these *now*, before you're attached to a
   number.

## Gate check

Advance to Simulate only on a Continue / Continue-if verdict. A Pivot loops back
to Think with what you learned. A Kill is a successful outcome — you saved the
cost of the next three stages. Record *why* so you don't relitigate it later.

## Stance

Score honestly. An auditor who never recommends Kill is useless. The goal is not
to be negative; it's to be *right cheaply*. Most ideas should not pass unchanged.
