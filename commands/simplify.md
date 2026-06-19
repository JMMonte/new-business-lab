---
description: Run the simplicity filter — explain the business as if to your non-expert parents
argument-hint: "<business slug>"
---

Run the **Simplicity Filter** on the idea in `businesses/$1/`. Use the `simplifier`
agent (follow the Simplicity Filter in `${CLAUDE_PLUGIN_ROOT}/frameworks/07-decide.md`).

Read the folder, then answer the five plain-language questions as if explaining to a
parent who isn't in the industry but understands value, purpose, money and cost —
**no jargon, no acronyms**:

1. What is it, in one breath?
2. Who is it for, and what problem do they have?
3. **Why would they pay for this instead of what they already do — or could just
   buy?** (Name the existing alternative. This is the load-bearing question.)
4. How does it make money, and does the money work (in euros)?
5. Why is this worth doing — and why this founder?

Write `businesses/$1/pitch.md`. If it can't pass — especially #3 — say so plainly;
that's a finding, not a failure. Lead with the one-breath description.
