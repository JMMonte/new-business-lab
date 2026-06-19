# New Business Lab

A Claude Code **plugin**: a disciplined, multi-agent pipeline for evaluating new
business ideas *before* you spend real time or money — so bad ideas die cheaply,
on paper, now.

It does three things most idea-evaluation skips:
- **Understands the problem before the solution.** Most wasted ventures solve a
  problem nobody will pay to fix. The lab forces the problem first.
- **Knows who's using it.** It starts from *your* desire, edge, values, and
  anti-goals — and generates for you, not for a generic optimal founder.
- **Ends in plain language.** No matter how deep the analysis, the deliverable is
  something your non-expert parents would understand — above all, *why anyone would
  pay for this instead of what already exists.*

## The pipeline

```
0 PROFILE → 1 PROBLEM → 2 IDEATE → 3 THINK → 4 AUDIT → 5 SIMULATE → 6 TEST → 7 DECIDE
 (who you   (is it     (generate  (model)   (risk)    (economics)  (cheap   (build/pivot/kill
  are)       real?)     & attack)                                   proof)   + simplicity filter)
```

Ordered by cost: each stage is cheaper than the next and can kill the idea on its
own. **Deep Research** runs alongside (`/research`) as the evidence engine whenever
a guess blocks a gate. See [`frameworks/README.md`](frameworks/README.md).

## Commands

| Command | Stage | What it does |
|---------|-------|--------------|
| `/profile` | 0 | Build your founder profile (private; seeds everything) |
| `/problem <idea>` | 1 | Understand the problem before any solution |
| `/ideate <slug\|theme>` | 2 | Multi-agent idea engine: generate→combine→negate→validate→rank |
| `/new-business <idea>` | 3 | Scaffold + Think (one-pager, lean canvas, sizing) |
| `/research <slug>` | ✻ | Deep multi-agent research, source-graded |
| `/audit <slug>` | 4 | Adversarial risk register + verdict |
| `/simulate <slug>` | 5 | Unit economics + scenarios |
| `/test <slug>` | 6 | Cheapest experiments with kill thresholds |
| `/simplify <slug>` | 7 | The simplicity filter ("explain it to your parents") |
| `/decide <slug>` | 7 | Build / pivot / kill memo + the pitch |

## Install

It's a standard Claude Code plugin (`.claude-plugin/plugin.json` + `commands/`,
`agents/`, `skills/`). Add it via your plugin marketplace/config, or clone and load
it as a local plugin. The bundled `frameworks/`, `workflows/`, `tools/`, and
`templates/` are referenced by the commands/agents via `${CLAUDE_PLUGIN_ROOT}`.

Typical first session:
```
/profile                          # tell the lab who you are
/problem "<your idea or pain>"     # is the problem even real?
/ideate <slug>                     # generate & stress-test solutions (multi-agent)
/new-business <slug>  → /research → /audit → /simulate → /test → /decide
```

## How it's organized

```
new-business-lab/
├── .claude-plugin/plugin.json   Plugin manifest
├── commands/                    Slash commands (the pipeline)
├── agents/                      Subagents (profiler, problem-analyst, strategist,
│                                researcher, auditor, simulator, validator,
│                                visionary, simplifier, …)
├── skills/                      Entry skill (operating principles)
├── frameworks/                  The methodology — one doc per stage
├── workflows/                   Multi-agent engines: ideate.js, deep-research.js
├── tools/                       Python: scaffold, simulate, evidence grader, score
├── templates/                   Blank docs copied per idea
├── examples/                    Worked example + a founder-customized engine
└── businesses/                  YOUR ideas live here (gitignored user data)
```

## Two standing principles

1. **Lead with desire, filter with reality.** Generation starts from your profile;
   viability checks come *after* and never silently veto a direction you're drawn
   to. The skeptics (Audit) and the dreamer (the `visionary`) both stay in the room.
2. **End in simplicity.** The final test isn't a long report — it's whether a
   non-expert understands *why this is worth doing and why they'd pay for it
   instead of buying what exists.*

## Cost discipline

The multi-agent workflows are bounded by design: leaf agents are read-only (can't
spawn more agents), run on a cheap model, and have hard caps — a *few dozen* agents
per run, never hundreds. Commands state the expected agent count before launching.

See [`docs/DESIGN-NOTES.md`](docs/DESIGN-NOTES.md) for what was learned building
this and why it's shaped this way, and
[`examples/zenroll/`](examples/zenroll/00-one-pager.md) for a worked example.
