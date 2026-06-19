# Stage 4 — Test

> **Goal:** Design the cheapest real-world experiments that could prove the
> load-bearing assumptions *false*. **Gate:** You know exactly what result would
> make you continue, pivot, or kill — before you run anything.

Thinking, auditing, and simulating all happen on paper. Testing spends real
(small) resources to replace `[guess]`es with `[measured]` facts. The art is
maximum learning per dollar and per day.

## 1. Start from the dominant assumption

You already have it: it's the load-bearing assumption from Think, confirmed as a
top risk in Audit and as the most sensitive input in Simulate. **Test that first.**
Don't build features; test the assumption the whole business rests on.

Order experiments by: *(value of the information) / (cost + time to get it)*.
The first experiment is the riskiest, cheapest-to-check assumption.

## 2. Write each experiment as a falsifiable hypothesis

Never "let's see what happens." Every experiment is:

> **Hypothesis:** We believe **[specific assumption]**.
> **Test:** We will **[specific action]** with **[who / how many]**.
> **Metric:** We measure **[one primary number]**.
> **Success:** ≥ **[threshold]** means supported.
> **Kill:** ≤ **[threshold]** means this assumption is false → **[consequence]**.
> **Cost / time:** **[$ and days]**.

Set the success and kill thresholds *before* running it. A test with no
pre-committed kill threshold can't fail, so it can't teach.

## 3. The validation ladder (climb only as far as needed)

Cheapest signal first; stop as soon as an idea fails a rung.

| Rung | Tests | Typical method | Cost |
|------|-------|----------------|------|
| 1. Problem | Does the pain exist & matter? | 10–20 customer interviews (problem, not pitch) | ~$0 |
| 2. Demand | Will they act / pay? | Landing page + waitlist/pre-order; fake-door; smoke test ad | $ |
| 3. Solution | Does our solution solve it? | Concierge / Wizard-of-Oz; clickable prototype | $$ |
| 4. Willingness to pay | Will they pay *this* price? | Pre-sales, LOIs, paid pilot | $$ |
| 5. Channel | Can we acquire profitably? | Small paid + organic tests; measure real CAC | $$ |
| 6. Retention | Do they stay & use it? | MVP / pilot cohort; measure week-4 retention | $$$ |

Notes:
- **Interview for problems, not solutions.** People lie to be nice about your
  idea; they're honest about their own pain. Ask about the last time it happened.
- **Fake-door / smoke tests** measure intent cheaply: real clicks, emails, or
  card details beat survey "yes."
- **Concierge MVP** — deliver the value manually before building anything. If
  people won't take it free-and-manual, they won't pay for it automated.
- A **pre-sale or signed LOI** is the strongest pre-build demand signal there is.

## 4. Beware false signals

- **Vanity metrics** (page views, signups, likes) feel good and prove nothing.
  Measure behavior with a cost attached: payment, repeat use, referral.
- **Friends & family** are not the market. Test with strangers in the segment.
- **Survey yes ≠ purchase.** Stated preference overstates demand 3–10×.
- **Small-N noise.** Decide the sample size that would move you *before* running.

## 5. Output: experiment plan (`06-experiment-plan.md`)

1. **Prioritized experiment list** — ordered by info-value / cost, each in the
   hypothesis format above with pre-committed success & kill thresholds.
2. **Experiment 1 in detail** — exactly what to do this week, for how much.
3. **Decision tree** — for each outcome (pass / fail / ambiguous), the next move.
4. **Budget & timeline** — total to reach a build/kill decision.

## 6. Close the loop: the decision memo (`07-decision-memo.md`)

After experiments run, write the memo a sane investor (you) would want: what you
believed, what you tested, what you learned (measured numbers), and the call —
**build / pivot / kill** — with the reasoning. Update `assumptions.json` so
`[guess]`es become `[measured]`, then re-run `simulate.py` on the real numbers.
That closes one full loop of the pipeline.

## Gate check

Build only when the load-bearing assumptions have moved from `[guess]` to
`[measured]` and still clear the Simulate gate on real data. Otherwise you're
not validated — you're committed to an untested bet.
