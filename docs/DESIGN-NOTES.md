# Design Notes — what was learned building this

The lab was used hard (cabins → AI-for-science → vertical robotics → a full
cargo-drone pass) before being turned into a plugin. What that surfaced, and how
the design responded:

## Lessons → design responses

1. **Solution-first is the default failure mode.** Every idea started as a solution
   and reverse-engineered a problem; the cargo-drone pass nearly chased "build an
   aircraft" before asking if the problem paid. → Added **Stage 1 Problem** as a
   hard front gate, with a "park your solution" rule and a required falsifier.

2. **The system didn't know the user.** The opportunity scout optimized for market
   defensibility and kept surfacing ideas the founder didn't want, until a
   desire-first interview found the real pull. → Added **Stage 0 Profile** as a
   first-class, persistent input; ideation now generates *from* it. Principle:
   **lead with desire, filter with reality** (a viability score must not silently
   veto a direction the founder is drawn to).

3. **Ideation was shallow** (generate→score only). → Rebuilt as
   **generate → combine → negate → validate-vs-SOTA → reframe → rank**
   (`workflows/ideate.js`), with explicit cross-breeding, adversarial killing, and a
   state-of-the-art reality check that stops you chasing solved/crowded problems.

4. **Agent fan-outs exploded** — one research run hit **287 agents / 7.4M tokens**
   (leaf agents spawned their own helpers); another hit **59 vs an estimated 19**
   (one skeptic per load-bearing claim, unbounded in the number of claims). →
   Convention: **bound the total scale, don't ban the capability.** Hard per-stage
   caps (the primary lever) + a cheap leaf model + a *soft* scope instruction (a leaf
   may delegate to ~1–2 helpers only if it clearly helps — never a fleet, never deep
   nesting); every per-item fan-out is **capped**; runs state the base agent count
   up front and note leaves may add a little (an honest range). A few dozen, never
   hundreds. (An earlier version hard-blocked nesting with read-only leaves — too
   dogmatic; the goal is a bounded total, not a removed capability.)

5. **Research-over-memory.** Asserting facts from training got things wrong (it
   would have missed EIT Manufacturing's liquidation and mis-stated a "€750k grant"
   that's actually dilutive). → Facts go through the research workflow and the
   evidence ledger, graded by `source-valuation.md`; the fact-checker pass earns
   its keep.

6. **All skeptics, no dreamer → overfitting** to consensus and to whatever data was
   searchable. → Added the **`visionary`** divergent pass to every multi-agent
   workflow; reports hold the convergent verdict and the divergent reframe together.

7. **Outputs were dense and inhuman.** → Added **Stage 7 Decide's Simplicity
   Filter**: explain it to non-expert parents, with the load-bearing question being
   *"why would anyone pay for this instead of buying what exists?"* Output is a
   `pitch.md`, not a report.

8. **A domain stage leaked into the general pipeline** (a "vertical robotics sweep"
   wedged mid-funnel). → Removed; domain angles (vertical integration, "build is a
   v2 lever," etc.) are now **lenses inside Ideate/Audit**, not stages. The pipeline
   stays domain-agnostic. The founder-specific engine that hardcoded one strategy
   was preserved as `examples/custom-workflows/discovery-engine.js` — an example of
   customizing the engine via the profile, not shipping someone's fitness function.

9. **Folder sprawl & a misfit tool.** Multiple runs created many folders with
   inconsistent slugs. → `businesses/` is now gitignored user data; the clean
   worked example lives in `examples/`. Known open item: `tools/simulate.py` is
   SaaS-shaped and doesn't fit capex/physical businesses (cabins, cargo drone) — a
   capex/asset/unit-economics model is the next tool to add.

## Still open (good first contributions)
- A capex/asset economic model alongside `simulate.py` (per-unit payback, cash
  trough) for physical/operating businesses.
- `/profile`-driven custom fitness functions for `ideate.js` (generalize what
  `examples/custom-workflows/discovery-engine.js` hardcodes).
- A marketplace entry so the plugin is installable in one step.
