# Stage 2 — Ideate

> **Goal:** Produce a *small set of strong, non-obvious candidate solutions* to a
> well-understood problem (or, in discovery mode, candidate problem→solution
> pairs) — using many parallel subagents to diverge, then converge. **Gate:** A
> ranked shortlist where each survivor has cleared a state-of-the-art reality check
> and fits the founder.

Ideation is where the lab earns its keep as a *multi-agent* system. One mind
ideating alone anchors on its first idea and on the consensus. A fan-out of
subagents with different mandates — some to invent, some to cross-breed, some to
destroy, some to check what already exists — covers far more of the space and
kills the duds before they cost anything. The engine is
`workflows/ideate.js` (run via `/ideate`).

## Inputs

- The **problem brief** (`01-problem.md`) — ideation serves a problem; it does not
  free-associate. *(Discovery mode: when there's no single problem yet, ideate over
  a theme/space; generators propose problem→solution pairs and the validate pass
  also tests whether the problem is real.)*
- The **founder profile** (`00-profile.md`) — desire and edge are seeds;
  anti-goals are hard filters. Generate *for this person*.

## The four moves (diverge → converge)

```
GENERATE  → COMBINE → NEGATE → VALIDATE(SOTA) → RANK
(diverge)   (synth)   (attack)  (reality-check)   (converge)
```

### 1. GENERATE — divergent, many lenses in parallel
Spawn N generators, each with a **different heuristic** so they don't collapse to
the same answer. Useful lenses:
- **First-principles** — strip the problem to physics/economics; rebuild.
- **Analogy / adjacent-industry** — how is this solved in a neighbouring field?
- **Inversion** — what would guarantee the problem stays unsolved? Invert it.
- **Constraint-removal** — "if [capital/regulation/physics] weren't a limit…"
- **Founder-edge-first** — start from the founder's unfair advantage, work to a fit.
- **Trend-extrapolation** — assume frontier tech (e.g. far stronger AI) is free;
  what's now possible?
- **Contrarian** — what does everyone believe about this problem that's wrong?

Generators are told to be *bold and specific*, not safe and vague. Quantity here;
quality comes later. Cheap, parallel, read-only.

### 2. COMBINE — synthesis
Agents take the raw idea pool and **cross-breed** the strongest fragments into
hybrids — the wedge from one + the business model from another + the founder-edge
from a third. The best ideas are usually recombinations, not singletons.

### 3. NEGATE — adversarial
Agents try to **kill** each candidate: why it won't work, why now is wrong, who's
already failed at it, what makes it undefensible. Default to "killed" unless it
survives. This is cheap pessimism that saves expensive optimism.

### 4. VALIDATE — state-of-the-art reality check
For each surviving candidate, agents check the **current state of the art in the
industry and the problem**: Is it already solved? Who is doing it (named, funded)?
What's genuinely at the frontier vs. table stakes? Is the founder reinventing or
genuinely ahead? This uses real research (web/sources, graded per
`source-valuation.md`) — it's the step that stops you chasing a solved problem or a
crowded one. Log findings to the evidence ledger.

### RANK — converge
Score survivors on a small set that matches the lab's beliefs:
**problem-fit × founder-fit × feasibility × ownability (moat/data-flywheel) ×
how-contested × desire-fit.** Do **not** let "capital-light" or "uncontested"
silently veto an ambitious idea the founder is pulled toward — surface the tension
(see `00-profile.md`). Keep the divergent **`visionary`** reframe in the output
alongside the convergent ranking; report both.

## Cost discipline (bound the total, don't ban capabilities)

Ideation fan-outs are where agent counts explode. The goal is to keep the *total*
scale in the few-dozen range — not to forbid nesting dogmatically. Enforce:
- **Hard caps** on generators, candidates, and validators. These bound the
  workflow's own (base) agent calls. This is the primary lever.
- **Cheap model** for leaf agents (generate / negate / validate), and a **soft
  scope instruction**: a leaf may delegate to ~1–2 helpers *only if it clearly
  helps* — never a fleet, never deep nesting. Leaves keep the option; they just
  don't multiply.
- **Per-item fan-out must be capped** (e.g. validators ≤ MAX_CANDIDATES), never
  unbounded in the number of items found. (A past run hit 59 agents because one
  skeptic spawned per claim with no cap.)
- **Estimate honestly.** State the base agent count before the run, and note that
  leaves may add a modest amount if they delegate — a range, not a false-precise
  number. A few dozen total, never hundreds.

## Output: the idea shortlist (`idea-shortlist.md`)

A ranked table of survivors; for each: the idea in one line, the wedge, who's
already there (with sources), why the founder can win it, the biggest risk, and
the **cheapest probe** to test it. Plus a "divergent angles" section from the
visionary. Pick 1–2 to carry into [Think](03-think.md).

## Gate check

Advance to Think only with a candidate that (a) attacks a problem that cleared
Stage 1, (b) survived negation and the SOTA check, and (c) fits the founder. If the
whole pool dies on the SOTA check, that's signal: either the problem is already
well-served (drop it) or the real opportunity is a reframe the visionary surfaced.
