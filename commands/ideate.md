---
description: Generate + stress-test candidate ideas with parallel subagents (Stage 2)
argument-hint: "<business slug, or a theme for discovery mode>"
---

Run the multi-agent idea engine for `$1` (follow
`${CLAUDE_PLUGIN_ROOT}/frameworks/02-ideate.md`).

1. Read the problem brief `./businesses/$1/problem-brief.md` if it exists (problem
   mode); otherwise treat `$1`/$ARGUMENTS as a theme (discovery mode). Read the
   founder profile `./.business-lab/profile.md` if present.
2. **State the expected agent count and confirm before launching** — this spends
   real budget. Base agent counts: `quick` ~17 · `standard` ~25 · `deep` ~31
   (cheap leaf model; leaves may delegate a little, so state it as a range and keep
   the total to a few dozen). Default `standard`.
3. Invoke the **Workflow** tool with
   `scriptPath: "${CLAUDE_PLUGIN_ROOT}/workflows/ideate.js"` and
   `args: { "problem": "<the problem brief text, or omit for discovery>", "theme": "<theme if discovery>", "profile": "<the founder profile text>", "slug": "$1", "businessDir": "businesses/$1", "depth": "standard" }`.

It runs **generate → combine → negate → validate-vs-SOTA → reframe → rank** and
writes `businesses/$1/idea-shortlist.md` + `ideas.jsonl`. When it finishes, read the
shortlist and give me: the top surviving ideas, who's already there, why I could
win each, the cheapest probe — and the visionary's divergent angles. Then I pick
1–2 to carry into `/new-business` (Think). Never run this unprompted.
