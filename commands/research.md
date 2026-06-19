---
description: Run the multi-agent deep-research workflow on a business idea
argument-hint: "<business slug> [question]"
---

Run deep research for the idea in `businesses/$1/`.

This is multi-agent, so it uses the Workflow orchestrator. **State the expected
agent count and confirm with the user before launching** — this spends real
budget.

- Call the `Workflow` tool with `name: "deep-research"` and
  `args: { "slug": "$1", "businessDir": "businesses/$1", "question": "<the research question — default: validate demand, market, competition, pricing, channel, and regulation for this idea>", "depth": "quick" }`.
- `depth` controls the (bounded) fan-out — leaf agents are read-only and cannot
  spawn their own subagents, so these ceilings are real:
  - `quick` — 3 sub-questions × 2 modalities → **~14 agents** (default)
  - `standard` — 4 × 2 → **~18 agents**
  - `deep` — 6 × 3 + competitor modality → **~38 agents**
- Default to `quick`. Only go higher if the user asks. Never run this
  unprompted.

The workflow will: decompose the question → fan out across formal-web /
community / competitor sources → grade every source and voice-of-customer signal
(`${CLAUDE_PLUGIN_ROOT}/frameworks/source-valuation.md`) → adversarially verify the load-bearing claims
→ write `businesses/$1/research-report.md` and `businesses/$1/evidence.jsonl`, then
run `python3 ${CLAUDE_PLUGIN_ROOT}/tools/evidence.py` on the ledger.

When it finishes, read the report, run `python3 ${CLAUDE_PLUGIN_ROOT}/tools/evidence.py
businesses/$1/evidence.jsonl` yourself to confirm the grades, and tell me: the
best-evidenced findings, the voice-of-customer takeaway, the contradictions, and
which load-bearing claims are still `[guess]` and must go to the Test stage.

If `businesses/$1/` doesn't exist yet, scaffold it first with
`python3 ${CLAUDE_PLUGIN_ROOT}/tools/new_business.py`.
