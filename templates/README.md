# Templates

Blank documents copied into each `businesses/<slug>/` folder. **Treat these as
read-only sources** — never fill them in here; copy them (the scaffolder and
`/new-business` do this for you).

Numbered to read in pipeline order:

| File | Stage | Purpose |
|------|-------|---------|
| `00-one-pager.md` | Think | The sharpened idea + load-bearing assumptions |
| `01-lean-canvas.md` | Think | Full one-page business model |
| `02-market-and-customer.md` | Think | Bottom-up sizing + early-adopter profile |
| `03-business-model.md` | Think | Pricing, channels, cost structure |
| `04-audit-report.md` | Audit | Risk register, pre-mortem, verdict |
| `05-financial-model.md` | Simulate | Scenarios, unit economics, sensitivity |
| `06-experiment-plan.md` | Test | Prioritized experiments + thresholds |
| `07-decision-memo.md` | Decision | Build / pivot / kill, with reasoning |
| `assumptions.example.json` | Simulate | Schema for the financial simulator input |
| `research-report.md` | Research | Cited findings + voice-of-customer (written by `/research`) |
| `evidence.example.jsonl` | Research | Schema for the evidence ledger (input to `tools/evidence.py`) |

Conventions: tag every number `[measured] / [benchmarked] / [guess]`. Leave
`<…>` placeholders visible until filled so it's obvious what's still missing.
