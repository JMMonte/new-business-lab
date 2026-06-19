# Deep Research (cross-cutting)

> **Goal:** Replace `[guess]`es with graded, sourced evidence — fast and at
> breadth — by fanning out subagents across many source types, valuing every
> source, and triangulating. Deep research is not a stage; it's the **fuel** for
> every stage. It feeds Think (market, customer), Audit (risk likelihood),
> Simulate (assumption values), and Test (what's still unproven).

Read this together with [`source-valuation.md`](source-valuation.md) — that file
is *how to value a source*; this file is *how to run the research that produces
them*.

## When to run it

- **Before/with Think** — to size the market bottom-up and profile the customer.
- **During Audit** — to move risk likelihoods off pure opinion.
- **Whenever a load-bearing `[guess]` blocks a decision** — research it before you
  spend money testing it (research is cheaper than experiments).

## The principle: breadth × independence × triangulation

One analyst reading ten articles finds what those articles agree on — usually the
consensus, often the consensus error. A **fan-out of specialized subagents**, each
searching a different way and blind to the others, surfaces the disagreements,
the long tail, and the unprompted voice of the customer. The orchestration is in
`.claude/workflows/deep-research.js`; run it with `/research`.

## Six phases (the workflow)

```
1 DECOMPOSE   Break the question into dimension sub-questions, flag load-bearing ones
2 GATHER      Fan out, per sub-question, across modalities (run in parallel, blind):
                • formal-web    reports, stats, news, filings, analyst data
                • community     Reddit, HN, X, forums, Discord, app/G2 reviews
                • competitor    product pages, pricing, changelogs, job posts, funding
3 GRADE       Score every source (Axis 1) and every VoC signal (Axis 2); detect
                astroturf/echo; log each as one line in the evidence ledger
4 VERIFY      Adversarial pass: try to REFUTE each load-bearing claim, check
                independence (collapse circular citations), surface contradictions
5 REFRAME     The one DIVERGENT voice (the `visionary` agent): counterweights the
                skeptics so the analysis doesn't overfit to consensus or to whatever
                data was searchable. Reframes, inversions, adjacent opportunities,
                contrarian bets — grounded in the evidence, labelled as provocations
6 SYNTHESIZE  Compute Evidence Strength per claim → tag; write the research report
                (incl. a "Divergent angles & reframes" section) + evidence.jsonl
```

Phases 2–3 run as a **pipeline** (a sub-question can be grading while another is
still gathering). Phase 4 should be genuinely adversarial — skeptic agents
prompted to *break* the claim, defaulting to "unproven" when uncertain.

### Why a divergent phase (anti-overfitting)

Phases 1–4 are all *convergent* — they narrow, refute, and tend toward "no." That's
necessary but, alone, it **overfits**: it converges on the consensus and on
whatever the data happened to show, and it kills ideas that needed a *reframe*, not
a verdict. Phase 5 is the deliberate counterweight — one agent that accepts the
skeptics' facts and then goes *around* them. The report must **hold both views at
once**: the convergent verdict and the divergent reframes, neither erasing the
other. (The `visionary` is informed imagination, not a cheerleader — every angle is
grounded in a finding and paired with its cheapest test.)

## What "modalities" must cover

A demand question answered only by market reports is half-researched. Always
include the **community/social** modality — it's where revealed preference and the
real language of the pain live. Useful surfaces:

- **Communities:** Reddit, Hacker News, Indie Hackers, niche forums, Discord/Slack,
  Facebook groups, Stack Exchange.
- **Reviews / revealed preference:** G2, Capterra, App Store / Play Store,
  Trustpilot, Amazon — especially **1–3 star reviews of incumbents** (the gap you
  fill) and **what people pay for today**.
- **Social:** X/Twitter, LinkedIn, TikTok/YouTube comments, Substack/blog comments.
- **Behavioral proxies:** search-volume & keyword data, "alternatives to X"
  queries, subreddit size/growth, GitHub stars, job postings (who's hiring for
  this pain), funding/M&A activity.

Available data tools vary by environment (web search, scraping, SEO/keyword and
social-listening MCPs). Subagents discover them via tool search; the workflow
names *modalities*, not specific tools, so it degrades gracefully.

## Output

Written into `businesses/<slug>/`:

- **`research-report.md`** — findings by dimension, each claim with its tag,
  Evidence Strength, and key sources; a dedicated **Voice-of-Customer** section
  (the pains in customers' own words, with revealed-preference highlighted); a
  **contradictions / open questions** list; and an **astroturf/quality** note.
- **`evidence.jsonl`** — the machine-readable ledger (one finding per line; schema
  in `templates/evidence.example.jsonl`). Run `python3 tools/evidence.py
  businesses/<slug>/evidence.jsonl` to (re)compute strengths and tags and to flag
  thin-but-load-bearing claims and echo chambers.

## Discipline

- **Cite or it didn't happen.** Every claim links to its sources; every number is
  traceable. No source → it's a `[guess]`, label it.
- **Log contradictions, not just confirmations.** If you found none, you searched
  for confirmation only — search again, adversarially.
- **Quote the customer.** For VoC, preserve real wording; paraphrase loses the
  intensity and the language you'll use in positioning and tests.
- **Independence over volume.** Thirty echoes of one press release is one source.
  Thirty unprompted complaints from thirty people is thirty.
- **Research informs; it does not validate.** Even strong, triangulated `[measured]`
  community signal is *observation*, not *your* experiment. It raises confidence
  and sharpens which experiment to run — it does not replace the Test stage.
