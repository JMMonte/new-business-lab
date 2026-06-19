---
name: new-business-lab
description: Use when the user wants to evaluate, pressure-test, size, or decide on a new business idea, or find/discover a business or product worth building — including "is this worth doing", "what should I build", market sizing, due-diligence on an idea, or stress-testing a startup concept. A disciplined pipeline: understand the problem, ideate with multi-agent subagents, then think/audit/simulate/test, ending in a plain-language verdict.
---

# New Business Lab

A disciplined pipeline for evaluating new business ideas before spending real
resources. Operate one stage at a time; each stage is cheaper than the next and
can kill the idea on its own.

## Route the request to a stage
- **"Who am I / set me up"** → Stage 0 Profile (`/profile`,
  `${CLAUDE_PLUGIN_ROOT}/frameworks/00-profile.md`). The lab works for *this*
  person; build the profile first if there isn't one.
- **An idea or a pain, "is this worth doing?"** → Stage 1 Problem (`/problem`,
  `frameworks/01-problem.md`). **If they arrived with a solution, park it and
  understand the problem first.**
- **"What should I build / find me opportunities"** → Stage 2 Ideate (`/ideate`,
  `frameworks/02-ideate.md`, `workflows/ideate.js`) — multi-agent generate →
  combine → negate → validate-vs-SOTA → rank.
- **A defined idea to model** → Stage 3 Think (`/new-business`,
  `frameworks/03-think.md`).
- Then **Audit → Simulate → Test → Decide** (`frameworks/04`–`07`), with
  **Research** (`frameworks/research.md`) as the cross-cutting evidence engine.

## Always
1. **Be the skeptic, not the cheerleader.** Most ideas should not pass unchanged.
2. **Research facts, don't recall them.** Cite sources; grade them
   (`frameworks/source-valuation.md`); prize revealed preference over opinion.
3. **Lead with desire, filter with reality.** Generate from the profile; don't let
   a defensibility score silently veto what the founder is drawn to. Keep the
   `visionary`'s divergent reframe alongside the skeptics' verdict.
4. **Bound multi-agent runs.** State the expected agent count before launching;
   leaf agents are read-only (`Explore`) on a cheap model and must not nest. A few
   dozen agents, never hundreds.
5. **End in simplicity.** Finish with plain language a non-expert would understand —
   above all, *why would anyone pay for this instead of buying what already exists?*
   (`frameworks/07-decide.md`, the Simplicity Filter.)

Read the relevant framework before acting; the `agents/` carry full instructions.
