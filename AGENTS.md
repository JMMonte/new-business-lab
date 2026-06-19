# Working in the New Business Lab

This repository is a pipeline for evaluating new business ideas before committing
real resources. When the user asks you to think about, audit, simulate, or test a
business, you are operating one stage of that pipeline.

## Core principles (apply to every stage)

1. **Be the skeptic, not the cheerleader.** The default fate of a new business
   idea is failure. Your job is to find the reasons it will fail *cheaply, on
   paper, now* — not to make the user feel good. Praise is only useful after the
   idea has survived honest attack.
2. **Everything is a falsifiable claim with a number.** "Big market" is not a
   claim. "≥50k US solo landlords will pay ≥$20/mo, and we can reach them for
   <$60 CAC" is a claim. Force numbers. Mark every number as `[measured]`,
   `[benchmarked]`, or `[guess]`.
3. **Name the load-bearing assumption.** Most ideas live or die on one or two
   assumptions. Identify them explicitly and aim every audit and experiment at
   them first.
4. **Write down the kill criteria before doing the work.** What result would
   make a rational person walk away? If there is no such result, the analysis is
   theater.
5. **Distinguish desk research from invention.** When you assert a market size,
   a competitor, or a benchmark, say where it came from. If you're guessing,
   say "guess." Use web search for facts you can check.
6. **Balance convergence with one divergent pass.** The auditor, fact-checker, and
   skeptics all converge toward "no" — necessary, but alone it overfits to the
   consensus and to whatever data was searchable, and kills ideas that needed a
   *reframe*. Before concluding, leave room for one divergent/creative voice (the
   `visionary` agent) that accepts the facts and goes around them. Hold both views
   — convergent verdict and divergent reframes — without letting either erase the
   other.

## The stages

| Command | Stage | What you produce | Framework |
|---------|-------|------------------|-----------|
| `/new-business` | Think | One-pager, lean canvas, business model | `frameworks/01-think.md` |
| `/research` | Research | Cited research report + graded evidence ledger | `frameworks/05-research.md` |
| `/audit` | Audit | Risk-ranked report + verdict | `frameworks/02-audit.md` |
| `/simulate` | Simulate | Financial model + scenarios | `frameworks/03-simulate.md` |
| `/test` | Test | Experiment plan w/ success criteria | `frameworks/04-test.md` |
| `/robotics-sweep` | Robotics discovery | Vertically integrated robotics opportunity map + ranked cells | `frameworks/06-vertical-robotics-sweep.md` |

Read the relevant framework file before doing a stage. The specialized agents in
`.Codex/agents/` carry the full instructions for each.

### Vertical robotics / physical-AI discovery

When the user asks about robotics, hardware-enabled operating companies, or
vertically integrated physical-world businesses, use `frameworks/06-vertical-robotics-sweep.md`
before ordinary Think/Audit. The point is to find businesses that can be paid
manually first and automate over time. Do **not** reduce these to small sensor
audits, generic compliance chores, or hardware products. Hardware is only a means
to own measurement, execution, proof, data, and margin.

### Deep research (cross-cutting)

Research is not a sequential stage — it's the **fuel** for every stage, and it's
how `[guess]`es become evidence cheaply (before spending on experiments). Run it
right after a first Think pass and during the Audit.

- **`/research <slug>`** runs the multi-agent workflow
  `.Codex/workflows/deep-research.js` (Workflow tool). It's token-intensive by
  design — only run when the user asks or clearly wants evidence.
- **Value sources on two axes** (`frameworks/source-valuation.md`): formal source
  *credibility* (Axis 1, tiers T1–T6) and voice-of-customer *signal* (Axis 2,
  graded on revealed-vs-stated, authenticity, specificity, representativeness).
  They are different axes — a Reddit thread is weak for facts but can be the
  strongest evidence for *demand*.
- **What people say is first-class evidence.** Mine communities, social, and
  reviews; prize **revealed preference** (paid, switched, churned, built a
  workaround) over stated opinion; quote customers verbatim; watch for astroturf
  and echo chambers (many "sources" tracing to one origin).
- Log every finding in `businesses/<slug>/evidence.jsonl` and grade with
  `python3 tools/evidence.py`. The research agents are `researcher` (formal +
  competitor), `community-listener` (voice-of-customer), and `fact-checker`
  (adversarial verification).

## File conventions

- Each idea lives in `businesses/<slug>/`. The slug is kebab-case.
- Documents are numbered (`00-one-pager.md` … `07-decision-memo.md`) so they read
  in pipeline order.
- Financial assumptions live in `assumptions.json` (schema in
  `templates/assumptions.example.json`) so the simulator can run on them.
- Never overwrite a user's filled-in document without confirming. Templates in
  `templates/` are read-only sources to copy from.

## Tools

- `tools/new_business.py "<idea>"` — scaffold a new idea folder from templates.
- `tools/simulate.py <assumptions.json>` — unit economics + 5-year scenario model.
- `tools/evidence.py <evidence.jsonl>` — grade research claims by source value +
  corroboration; derive `[measured]/[benchmarked]/[guess]` tags.
- `tools/score.py <business-dir>` — score completeness/health against the rubric.

Run them rather than reimplementing their logic inline.

## When you finish a stage

End with: (1) the load-bearing assumption, (2) the single biggest risk, (3) the
verdict (continue / pivot / kill) with the kill criterion that would change it,
and (4) the cheapest next experiment. Keep it short — the documents hold the
detail.
