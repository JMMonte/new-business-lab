---
description: Start a new business idea — scaffold its folder and run the Think stage
argument-hint: "<the idea in a few words>"
---

Start a new idea in the New Business Lab: **$ARGUMENTS**

1. Scaffold the folder: run `python3 ${CLAUDE_PLUGIN_ROOT}/tools/new_business.py "$ARGUMENTS"` and note
   the slug it creates.
2. Then run the **Think** stage using the `strategist` agent (or follow
   `${CLAUDE_PLUGIN_ROOT}/frameworks/03-think.md` directly): sharpen the idea, fill the one-pager, lean
   canvas, market sizing (bottom-up), and business model, and name the
   load-bearing assumptions as falsifiable claims with numbers.

Interview me only for what you can't reasonably infer or research. Ground market
facts with web search rather than inventing them. Tag every number
`[measured] / [benchmarked] / [guess]`.

Finish with the load-bearing assumption(s), what's still too vague to judge, and
whether it's specific enough to advance to `/audit`.
