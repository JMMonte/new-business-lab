# Working in the New Business Lab

This repo is a Claude Code plugin: a pipeline for evaluating new business ideas
before committing real resources. When the user asks you to profile, find a
problem, ideate, think, audit, simulate, test, or decide on a business, you are
operating one stage of that pipeline. (When installed as a plugin, bundled files
are under `${CLAUDE_PLUGIN_ROOT}`; user ideas live in `./businesses/` in their cwd.)

## Core principles (every stage)

1. **Be the skeptic, not the cheerleader.** The default fate of a new idea is
   failure. Find why it fails cheaply, on paper, now. Praise only what survives
   honest attack.
2. **Understand the problem before the solution.** Most waste comes from solving a
   problem nobody pays to fix. If the user arrives with a solution, park it and
   interrogate the problem first (Stage 1).
3. **Everything is a falsifiable claim with a number,** tagged `[measured]`,
   `[benchmarked]`, or `[guess]`. Force numbers.
4. **Name the load-bearing assumption** and aim every audit/experiment at it.
5. **Write the kill criteria before doing the work.** No falsifier = theater.
6. **Research, don't recall.** For any fact (market size, competitors, regulation,
   prices), use the research workflow and cite sources; don't assert from memory.
7. **Lead with desire, filter with reality.** Generate from the founder profile;
   viability checks come after and never silently veto a direction the founder is
   drawn to. Keep the convergent verdict and the divergent (`visionary`) reframe
   together.
8. **End in simplicity.** The deliverable is plain-language — what it is in one
   breath, and *why anyone would pay instead of buying what exists.*

## The pipeline

| Command | Stage | Output | Framework |
|---------|-------|--------|-----------|
| `/profile` | 0 Profile | Founder profile (private) | `frameworks/00-profile.md` |
| `/problem` | 1 Problem | Problem brief + falsifier | `frameworks/01-problem.md` |
| `/ideate` | 2 Ideate | Ranked idea shortlist | `frameworks/02-ideate.md` |
| `/new-business` | 3 Think | One-pager, lean canvas, sizing | `frameworks/03-think.md` |
| `/audit` | 4 Audit | Risk register + verdict | `frameworks/04-audit.md` |
| `/simulate` | 5 Simulate | Economics + scenarios | `frameworks/05-simulate.md` |
| `/test` | 6 Test | Experiment plan + kill thresholds | `frameworks/06-test.md` |
| `/decide`, `/simplify` | 7 Decide | Decision memo + plain-language pitch | `frameworks/07-decide.md` |
| `/research` | ✻ cross-cutting | Cited research + graded evidence | `frameworks/research.md` |
| `/illustrate` | ✻ cross-cutting | Free concept images of the top ideas | `tools/illustrate.py` |

Read the relevant framework before doing a stage. Specialized agents in `agents/`
carry the full instructions.

## Multi-agent workflows & cost discipline

- `workflows/ideate.js` (via `/ideate`) and `workflows/deep-research.js` (via
  `/research`) are the multi-agent engines. They are **token-intensive — run only
  when asked, and state the expected agent count first.**
- **Bound the total, don't ban capabilities.** Keep runs to a few dozen agents via
  **hard per-stage caps** (the primary lever), a **cheap leaf model**, and a **soft
  scope instruction** (a leaf may delegate to ~1–2 helpers only if it clearly
  helps — never a fleet, never deep nesting). Don't structurally forbid nesting;
  just keep the exercise from scaling too high. Per-item fan-out must be capped
  (never unbounded in items found). State the base agent count before launching and
  note leaves may add a little — an honest range, never hundreds. (See
  `docs/DESIGN-NOTES.md`.)

## Evidence & valuation

- Log findings to `businesses/<slug>/evidence.jsonl`; grade with
  `python3 tools/evidence.py`. Value sources on two axes (`source-valuation.md`):
  formal credibility (T1–T6) and voice-of-customer signal (revealed > stated).
- Prize **revealed preference** (paid, switched, churned, built a workaround) over
  stated opinion; quote customers; watch for astroturf and echo chambers.

## File conventions

- Each idea: `businesses/<slug>/` (kebab-case). The founder profile is private:
  `.business-lab/profile.md` (gitignored), never in the shipped plugin.
- Don't overwrite a user's filled-in document without confirming. `templates/` are
  read-only sources.

## When you finish a stage

End with: the load-bearing assumption, the biggest risk, the verdict
(continue/pivot/kill) with the kill criterion that would change it, and the
cheapest next step. Keep it short; the documents hold the detail. At Decide, force
it through the simplicity filter.
