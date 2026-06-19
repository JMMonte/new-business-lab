# Source Valuation

How much should a given piece of evidence move your beliefs? This file is the
scoring model the research stage uses to answer that — for both **formal sources**
(reports, data, articles) and **what people say** (social, communities, reviews).
It is what turns a pile of links into graded evidence, and graded evidence into
the pipeline's `[measured] / [benchmarked] / [guess]` tags.

The central idea: **a source's authority and a signal's strength are two
different axes.** A government statistic is high-authority; an angry Reddit thread
is low-authority — but for the question *"do people actually feel this pain?"* the
Reddit thread can be the **stronger evidence**. Score both axes; never collapse
them.

---

## Axis 1 — Source Credibility (for factual claims)

How much do you trust a *factual* claim (market size, growth rate, regulation,
competitor pricing) from this source? Scored 0–5 by tier, then adjusted.

| Tier | What it is | Base credibility | Examples |
|------|-----------|:---:|----------|
| **T1 Primary / official** | Raw data you or an authority measured | 5 | Gov statistics, regulatory filings, court records, audited financials, census, peer-reviewed studies *with data*, **your own test results** |
| **T2 Independent secondary** | Named analysis with transparent method | 4 | Reputable research firms, quality journalism citing methods, well-documented surveys |
| **T3 Industry / trade** | Knowledgeable but sometimes promotional | 3 | Trade press, analyst blogs, conference talks, expert interviews |
| **T4 Vendor / self-interested** | A party with a stake in the claim | 2 | Company sites, marketing, sponsored "reports", press releases |
| **T5 Community / social / anecdote** | Individuals speaking | 1 *(for facts)* | Reddit, X, HN, forums, Discord, app-store / G2 reviews, YouTube comments |
| **T6 Unknown / low-trust** | Untraceable or synthetic | 0 | SEO content farms, AI-generated listicles, unattributed aggregators, scraped data |

**Adjustments (apply, then clamp to 0–5):**

- **−2 conflict of interest** — the source profits if you believe the claim
  (a vendor sizing "their" market huge). Discount hard.
- **+1 claim-against-interest** — a source conceding something that hurts it (a
  competitor admitting a weakness, a vendor noting a limitation). These are
  unusually trustworthy.
- **−1 stale** — market/tech/pricing claims older than ~2–3 years (regulation and
  demographics decay slower).
- **−1 untraceable number** — a figure with no method, no link, no original study.
- **Circular-citation collapse** — if ten articles all trace to *one* original
  study, that is **one** source at the original's tier, not ten. Independence is
  what makes corroboration mean anything (see Axis 3).

---

## Axis 2 — Voice-of-Customer Signal (for demand & pain claims)

When the question is *"is this a real, urgent, paid-for problem?"*, individual
people in communities are the **primary** source, not the bottom tier. But their
words are noisy, so grade the **signal**, not the speaker's authority. Score 0–5,
composite of five sub-scores (average, then apply red-flag penalties):

1. **Revealed vs stated** *(weighted ×2 — the most important)*
   Did they *do* something or just *say* something?
   - 5 = revealed preference: paid for a workaround, switched providers, churned,
     built a hack, left a 1-star review *after buying*, hired someone.
   - 3 = strong intent: joined a waitlist, asked "where can I buy this".
   - 1 = stated only: "I wish there were…", "that would be nice", survey "yes".
   *Stated preference overstates demand 3–10×. Behavior with a cost attached is
   the gold standard — same principle as the anti-vanity rule in the Test stage.*

2. **Authenticity**
   - 5 = organic & unprompted (a complaint in the wild, nobody asked).
   - 3 = solicited but honest (an interview, a "rate this" review).
   - 1 = likely manipulated: shill, paid influencer, astroturf, "what do you think
     of my idea?" (people lie to be nice).

3. **Specificity & intensity** — a detailed, emotional account of the *exact*
   painful moment (5) vs a vague gripe (1).

4. **Representativeness** — is the speaker in the **target segment**? (in-segment
   = full weight; adjacent = half; out-of-segment = note only).

5. **Recency** — current behavior beats year-old behavior.

**Red flags that cap authenticity low (the fact-checker hunts these):** bursts of
similar-wording posts, new/low-karma accounts, review text that reads like
marketing copy, suspiciously uniform 5-star clusters, engagement pods, undisclosed
sponsorship. When detected, treat the cluster as near-zero signal and say so.

---

## Axis 3 — Corroboration & triangulation

A single source — however authoritative — is a single point of failure. Belief
should rise with **independent** corroboration across **different source types.**

- **Independence** — sources that don't derive from each other. Five outlets
  citing one study = one source. Thirty *unprompted* complaints from different
  people in different threads = thirty (that's the point of community listening).
- **Type diversity** — the strongest evidence *triangulates*: an official stat
  (T1) **and** independent analysis (T2) **and** organic community signal (T5 VoC)
  all pointing the same way. Each covers the others' blind spots.
- **Contradiction** — actively log evidence that cuts the *other* way. A claim
  with only confirming evidence usually means you only looked for confirmation.

---

## From scores to a confidence tag (the bridge to the pipeline)

Each claim accumulates evidence in the ledger; `tools/evidence.py` computes an
**Evidence Strength (0–100)** and derives the tag:

```
strength = base(best supporting source/VoC, scaled to 0–60)
         + corroboration  (+8 per independent source, cap +24)
         + type_diversity (+6 per distinct source type beyond the first, cap +12)
         + revealed_bonus (+10 if any revealed-preference VoC supports it)
         − contradiction  (−12 per independent contradicting source)
         − echo_penalty   (−15 if many sources collapse to one origin)
   clamp 0–100
```

| Strength | Tag | Meaning |
|---:|---|---|
| ≥ 70 | `[measured]` | Strong, corroborated, ideally triangulated or revealed-preference |
| 40–69 | `[benchmarked]` | Decent independent secondary, or moderate corroborated VoC |
| < 40 | `[guess]` | Single-source, uncorroborated, stated-only, vendor-interested, or stale |

These tags flow straight into the Think/Audit/Simulate docs. A load-bearing
assumption still tagged `[guess]` after research is exactly what the **Test** stage
must measure next.

---

## How research lowers audit risk

The audit scores each risk as *Likelihood × Impact*, where likelihood reflects how
sure you are. Research moves **likelihood**, not impact:

- A demand risk rated 4/5 likelihood on a `[guess]` drops to 2/5 if deep research
  triangulates strong, independent, revealed-preference VoC for the pain.
- It *rises* to 5/5 if research finds the opposite — people describe the problem
  as minor, or the loud complaints turn out to be astroturf.

Either way you've replaced an opinion with evidence — cheaply, before testing.
