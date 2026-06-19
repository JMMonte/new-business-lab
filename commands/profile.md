---
description: Build or update your founder profile so the lab generates and judges ideas for YOU
argument-hint: "(optional starting notes about yourself)"
---

Build or update the founder profile. Use the `founder-profiler` agent (follow
`${CLAUDE_PLUGIN_ROOT}/frameworks/00-profile.md`).

Interview me briefly across the six fields — **identity & desire, edge, values,
constraints, anti-goals, and what I want from the lab right now**. Ground desire in
*revealed preference* (what I already build, rabbit-hole on, get asked about), not
"what's your passion." Keep it tight — a few sharp questions, not a form.

Write the result to `./.business-lab/profile.md` (create the dir). This file is
private user data — it seeds `/ideate` and biases `/audit` and `/decide`, and it
should be gitignored. Confirm it back to me in a few lines.

Starting notes: $ARGUMENTS
