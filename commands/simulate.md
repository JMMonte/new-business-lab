---
description: Build the financial model and run scenarios for a business idea
argument-hint: "<business slug>"
---

Simulate the economics of the idea in `businesses/$1/` using the `simulator`
agent (follow `${CLAUDE_PLUGIN_ROOT}/frameworks/05-simulate.md`).

First confirm the audit returned Continue. Then translate the business model into
`businesses/$1/assumptions.json` (schema in `${CLAUDE_PLUGIN_ROOT}/templates/assumptions.example.json`),
tag each input's confidence, and run:

```
python3 ${CLAUDE_PLUGIN_ROOT}/tools/simulate.py businesses/$1/assumptions.json
```

Check unit economics first (stop if one customer loses money), then read the
scenarios and sensitivity ranking. Write `05-financial-model.md` with the
unit-economics verdict, the three scenarios, break-even / cash-trough, the
sensitivity ranking, and which 1–2 assumptions the outcome rests on.

Finish with whether the base case is worth building and the pessimistic case
survivable, plus the dominant assumption to validate next in `/test`.
