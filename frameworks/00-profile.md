# Stage 0 — Profile

> **Goal:** Make the lab *know who is using it*, so it generates and judges ideas
> for **this** person — not for a generic optimal founder. **Gate:** A written
> founder profile exists and is rich enough to seed ideation and bias the analysis.

The lab learned this the hard way: pointed at "what's a defensible business," it
kept surfacing ideas the founder didn't want. Desire, edge, and constraints are
not noise to optimize away — they're the **objective function**. A great business
for the wrong person is the wrong business. So before any problem or idea, capture
the person.

## What the profile holds

Run `/profile` (the `founder-profiler` agent) to build it through a short
interview, or fill `profile.template.md`. It is persistent — write it once, reuse
it across every idea, update as the person changes. Six fields:

1. **Identity & desire** — who they are, and what they actually *want* to be
   doing. The energy test: what makes them lose track of time? What would they
   build if money were handled? What do people come to them for? (Desire is found
   by revealed preference in their own life, not by asking "what's your passion.")
2. **Edge** — concrete unfair advantages: skills, assets, access, distribution,
   prior work, relationships. (E.g. a fab-lab connection, a built prototype, a
   domain network.) This is what makes *them* able to win where others can't.
3. **Values** — what they'll defend when it gets hard: integrity lines, purpose,
   the kind of impact that matters to them. These are hard filters, not nice-to-haves.
4. **Constraints** — capital available, geography, time horizon, risk appetite,
   who they can bring in (e.g. "needs feet-on-earth operators").
5. **Anti-goals** — what they explicitly will *not* do (e.g. "no defense," "no
   ad-tech," "not a pure-services business," "won't relocate"). Anti-goals prune
   the search hard and cheaply.
6. **What they want from the lab right now** — discover a direction? pressure-test
   one idea? sanity-check economics? This sets which stage to start at.

## How the profile is used downstream

- **Ideate** generates *from* the profile — desire and edge are seeds, anti-goals
  are filters. (This is the fix for "the scoring filter deleted the ideas I'm
  drawn to.")
- **Audit / Simulate** weight risks the founder is actually exposed to (capital,
  capability, geography) rather than a generic firm's.
- **Decide** asks not just "is this a good business" but "is this a good business
  **for this person** to spend years on."

## Discipline

- **Lead with desire, then check viability — not the reverse.** A defensibility
  score should never silently veto a direction the founder is pulled toward;
  surface the tension instead and let them choose.
- **Hold desire and reality together.** The profile is not permission to chase
  fantasies; it's the input that the skeptics (Audit) and the dreamer (the
  `visionary`) both react to. Both voices stay in the room.
- **The profile is private user data.** It lives in the user's workspace, never in
  the shipped plugin. Treat it with care.
