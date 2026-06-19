# Stage 1 — Think

> **Goal:** Turn a vague idea into a specific, written model with a named
> customer and a plausible money path. **Gate:** A stranger could read the
> one-pager and correctly explain who this is for and how it makes money.

Thinking is the cheapest stage, so do it thoroughly. Most ideas that die later
die of vagueness that was visible here.

## 1. Sharpen the idea into one sentence

Fill the template:

> For **[specific customer]** who **[has this problem / unmet need]**, we offer
> **[product]** that **[does this differently]**, unlike **[the status quo /
> alternative]**. They pay because **[reason to pay now]**.

If you can't fill every slot with something specific, that's the first finding.
"Everyone" is not a customer. "It's better" is not a difference.

## 2. Jobs To Be Done

What is the customer *hiring* this product to do? People don't buy a drill, they
buy a hole — and really they buy a shelf, and really they buy a tidy room.

- **Functional job:** the practical task.
- **Emotional job:** how they want to feel (safe, smart, in control).
- **Social job:** how they want to be seen.
- **Current solution:** what they do today (often a spreadsheet, a person, or
  nothing). Your real competitor is usually "nothing" or "a hack that's good
  enough."

## 3. Lean Canvas

Capture the whole model on one page (`templates/01-lean-canvas.md`):

1. **Problem** — top 1–3 problems, and how they're solved today.
2. **Customer segments** — who exactly; name the *early adopter* specifically.
3. **Unique value proposition** — the single clear, compelling promise.
4. **Solution** — the top 3 features that deliver the UVP. No more.
5. **Channels** — how you reach customers (and whether those channels scale).
6. **Revenue streams** — pricing model, price point, what you charge for.
7. **Cost structure** — the few costs that dominate (COGS, CAC, fixed).
8. **Key metrics** — the handful of numbers that tell you it's working.
9. **Unfair advantage** — what can't be easily copied or bought. Be honest:
   "we'll work harder" and "first mover" are not advantages.

## 4. Market shape (back-of-envelope, bottom-up)

Skip the McKinsey TAM slide. Build it bottom-up so it's defensible:

```
TAM  = (# of target customers worldwide)        × (annual price)
SAM  = (# you can realistically serve/segment)  × (annual price)
SOM  = (# you can plausibly win in 3 years)      × (annual price)
```

Bottom-up beats top-down ("1% of a $50B market"). If you can't count the
customers, you don't understand the market yet. Mark each input `[measured]`,
`[benchmarked]`, or `[guess]`.

## 5. Name the load-bearing assumptions

Every business rests on a few claims that, if false, sink it. Typical shapes:

- **Demand:** enough people have this problem badly enough to pay.
- **Reachability:** you can acquire them for less than they're worth (CAC < LTV).
- **Solution:** what you can build actually solves the problem.
- **Economics:** the margin survives at scale.
- **Moat:** you can keep it once it works.

Pick the 1–2 that are both *most uncertain* and *most fatal if wrong*. These
become the targets of the audit and the experiments. Write them as falsifiable
statements with numbers.

## 6. Output

- `00-one-pager.md` — the sharpened idea, JTBD, and load-bearing assumptions.
- `01-lean-canvas.md` — the full one-page model.
- `02-market-and-customer.md` — bottom-up sizing + early-adopter profile.
- `03-business-model.md` — pricing, channels, cost structure narrative.

## Gate check

Advance to Audit only if: the customer is named and specific, the money path is
concrete, the market is sized bottom-up, and the load-bearing assumptions are
written as falsifiable claims. Otherwise, the idea is still too vague to audit —
keep sharpening.

## Common failure modes to flag

- **Solution in search of a problem** — the tech is cool; the pain is imagined.
- **Vitamin, not painkiller** — nice-to-have, so willingness-to-pay is low.
- **"We have no competitors"** — usually means you haven't found them, or there's
  no market. The status quo is always a competitor.
- **Founder-market mismatch** — no reason *this* team wins *this* market.
