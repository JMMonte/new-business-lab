export const meta = {
  name: 'ideate',
  description: 'Multi-agent idea engine: generate candidate solutions through many divergent lenses in parallel, combine the best fragments into hybrids, adversarially negate them, validate survivors against the current state of the art, then rank for fit. Serves a defined problem, or a theme in discovery mode. Seeded by the founder profile; bounded agent count.',
  whenToUse: 'After a problem is understood (Stage 1), to produce a ranked shortlist of strong, non-obvious, founder-fit candidate solutions — or in discovery mode over a broad theme.',
  phases: [
    { title: 'Generate', detail: 'divergent idea generation across many lenses, in parallel' },
    { title: 'Combine', detail: 'cross-breed the strongest fragments into hybrid candidates' },
    { title: 'Negate', detail: 'adversarially try to kill each candidate' },
    { title: 'Validate', detail: 'reality-check survivors vs the current state of the art (real sources)' },
    { title: 'Reframe', detail: 'the visionary surfaces non-obvious angles the convergent pass missed' },
    { title: 'Synthesize', detail: 'rank for fit; write idea-shortlist.md + ideas.jsonl' },
  ],
};

// ---- inputs (object | JSON string | plain string) --------------------------
let a = args || {};
if (typeof a === 'string') {
  const s = a.trim();
  a = s.startsWith('{') ? (() => { try { return JSON.parse(s); } catch { return { problem: s }; } })() : { problem: s };
}
const PROBLEM = a.problem || a.theme || 'Find a worthwhile new business to build.';
const MODE = a.problem ? 'problem' : 'discovery'; // discovery = no defined problem yet
const PROFILE = a.profile || '(no founder profile provided — generate broadly, flag that profile is missing)';
const SLUG = a.slug || 'ideas';
const DIR = a.businessDir || `businesses/${SLUG}`;
const DEPTH = a.depth || 'standard';
const N_LENSES = DEPTH === 'deep' ? 8 : DEPTH === 'quick' ? 4 : 6;
const MAX_CANDIDATES = DEPTH === 'deep' ? 10 : DEPTH === 'quick' ? 5 : 8;
const LEAF_MODEL = 'haiku';
// Soft scope, not a structural ban: leaves MAY delegate, but only a little, so the
// run stays bounded by the per-stage caps + cheap model rather than by removing a
// capability. Keeps total in the "few dozen", never "hundreds".
const SCOPE = ' Keep this proportionate: do the work yourself in a handful of tool ' +
  'calls. You MAY delegate to at most ~2 helper subagents ONLY if it clearly speeds ' +
  'real work — never spawn a fleet, never nest deeply; prefer doing it directly.';
// BASE agent count (the workflow's own calls): lenses + combine + negate(cap) +
// validate(cap) + visionary + synth. Leaves may delegate a little (soft cap), so the
// real total can run modestly above this — still bounded to a few dozen by the caps.
const EST_AGENTS = N_LENSES + 1 + MAX_CANDIDATES + MAX_CANDIDATES + 1 + 1;

const LENSES = [
  { key: 'first-principles', brief: 'Strip the problem to its physics/economics and rebuild a solution from scratch, ignoring how it is done today.' },
  { key: 'analogy', brief: 'How is an analogous problem solved in a DIFFERENT industry? Transplant that mechanism here.' },
  { key: 'inversion', brief: 'What would guarantee this problem stays unsolved forever? Invert each of those to find the solution.' },
  { key: 'constraint-removal', brief: 'Assume the hardest constraint (capital, regulation, physics, distribution) is gone. What becomes possible? Then find the cheapest real approximation.' },
  { key: 'founder-edge', brief: 'Start from the FOUNDER\'S unfair edge/assets/desire and work toward a solution only they could build well.' },
  { key: 'frontier-tech', brief: 'Assume frontier AI / automation is abundant and cheap. What is now buildable that was not 2 years ago?' },
  { key: 'contrarian', brief: 'Name the consensus belief about this problem, argue it is wrong, and build for the world where you are right.' },
  { key: 'jobs-to-be-done', brief: 'What is the customer really trying to accomplish (the underlying job)? Solve the job, not the stated ask.' },
].slice(0, N_LENSES);

const IDEA_SCHEMA = {
  type: 'object', required: ['ideas'],
  properties: {
    ideas: { type: 'array', items: {
      type: 'object', required: ['title', 'one_liner'],
      properties: {
        title: { type: 'string' }, one_liner: { type: 'string' },
        for_whom: { type: 'string' }, wedge: { type: 'string' },
        why_founder: { type: 'string' }, lens: { type: 'string' },
      },
    } },
  },
};
const CAND_SCHEMA = {
  type: 'object', required: ['candidates'],
  properties: {
    candidates: { type: 'array', items: {
      type: 'object', required: ['title', 'one_liner', 'wedge'],
      properties: {
        title: { type: 'string' }, one_liner: { type: 'string' },
        for_whom: { type: 'string' }, wedge: { type: 'string' },
        why_founder: { type: 'string' }, built_from: { type: 'string' },
      },
    } },
  },
};
const NEGATE_SCHEMA = {
  type: 'object', required: ['survives', 'rationale'],
  properties: { survives: { type: 'boolean' }, kill_reason: { type: 'string' }, rationale: { type: 'string' } },
};
const VALIDATE_SCHEMA = {
  type: 'object', required: ['already_solved', 'incumbents', 'verdict'],
  properties: {
    already_solved: { type: 'boolean' },
    incumbents: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, url: { type: 'string' }, note: { type: 'string' } } } },
    frontier_note: { type: 'string' },
    contested: { type: 'string', enum: ['open', 'some', 'crowded'] },
    sources: { type: 'array', items: { type: 'object', properties: { claim: { type: 'string' }, url: { type: 'string' }, source_type: { type: 'string' } } } },
    verdict: { type: 'string', enum: ['advance', 'reframe', 'drop'] },
    note: { type: 'string' },
  },
};

const CTX = `${MODE === 'discovery' ? 'DISCOVERY MODE (no single defined problem — propose problem→solution pairs):' : 'PROBLEM TO SOLVE:'}\n${PROBLEM}\n\nFOUNDER PROFILE (generate FOR this person; treat anti-goals as hard filters):\n${PROFILE}`;

// ============================================================================
phase('Generate');
log(`Ideating (${MODE}). ${N_LENSES} lenses, ≤${MAX_CANDIDATES} candidates, ~${EST_AGENTS} base agents on ${LEAF_MODEL} (leaves may delegate a little; bounded to a few dozen).`);
const raw = (await parallel(LENSES.map((L) => () =>
  agent(
    `You are an idea generator using ONE lens: ${L.key}. ${L.brief}\n\nProduce 3-5 ` +
    `BOLD, SPECIFIC candidate solutions through this lens only — concrete, not safe ` +
    `or generic. For each: title, one_liner, for_whom, wedge, why_founder (tie to the ` +
    `founder edge), lens="${L.key}". Honor anti-goals as hard filters.${NO_NEST}\n\n${CTX}`,
    { schema: IDEA_SCHEMA, phase: 'Generate', label: `gen:${L.key}`, model: LEAF_MODEL },
  ).then(r => (r?.ideas || []))
))).flat();
log(`${raw.length} raw ideas across ${LENSES.length} lenses.`);

// ============================================================================
phase('Combine');
const combined = await agent(
  `You are the idea synthesizer. Here is a pool of raw ideas from different lenses. ` +
  `CROSS-BREED the strongest fragments into at most ${MAX_CANDIDATES} hybrid ` +
  `CANDIDATES (the wedge from one + model from another + the founder-edge from a ` +
  `third are often stronger than any single idea). Merge duplicates; drop the weak ` +
  `and the anti-goal violations; keep the bold. For each candidate set built_from ` +
  `(which lenses/ideas it fuses).${NO_NEST}\n\n${CTX}\n\nRAW IDEAS:\n${JSON.stringify(raw).slice(0, 40000)}`,
  { schema: CAND_SCHEMA, phase: 'Combine', label: 'combine', model: LEAF_MODEL },
);
const candidates = (combined?.candidates || []).slice(0, MAX_CANDIDATES);
log(`${candidates.length} hybrid candidates.`);

// ============================================================================
// Negate → Validate as a pipeline per candidate (capped by construction).
const assessed = await pipeline(candidates,
  async (c) => {
    const neg = await agent(
      `You are a skeptic. Try to KILL this candidate: why it won't work, wrong ` +
      `why-now, who already failed at it, why it's undefensible, why this founder ` +
      `can't win it. Default survives:false unless it genuinely withstands attack.` +
      `${NO_NEST}\n\nCANDIDATE: ${JSON.stringify(c)}\n\n${CTX}`,
      { schema: NEGATE_SCHEMA, phase: 'Negate', label: `negate:${(c.title||'').slice(0,18)}`, model: LEAF_MODEL },
    );
    return { c, neg };
  },
  async (x) => {
    if (!x) return null;
    if (x.neg && x.neg.survives === false) return { ...x.c, killed: true, kill_reason: x.neg.kill_reason, val: null };
    const val = await agent(
      `You are a state-of-the-art reality checker. Research the CURRENT industry ` +
      `state for this candidate with REAL web sources: is the problem already ` +
      `solved? who is doing it (name them, with URLs + funding if known)? what's ` +
      `genuinely frontier vs table-stakes? is the founder reinventing or ahead? ` +
      `Grade sources (T1-T6). Verdict: advance (real opening) / reframe (opening ` +
      `exists but not as posed) / drop (already well-served or hopeless).${NO_NEST}` +
      `\n\nCANDIDATE: ${JSON.stringify(x.c)}\n\n${CTX}`,
      { schema: VALIDATE_SCHEMA, phase: 'Validate', label: `sota:${(x.c.title||'').slice(0,18)}`, model: LEAF_MODEL },
    );
    return { ...x.c, killed: false, val };
  },
);
const live = assessed.filter(Boolean);
const survivors = live.filter(c => !c.killed && c.val && c.val.verdict !== 'drop');
log(`${survivors.length}/${candidates.length} survived negation + SOTA check.`);

// ============================================================================
phase('Reframe');
const reframe = survivors.length === 0 && live.length === 0 ? null : await agent(
  `You are the Visionary — the divergent voice after a panel of skeptics. The scan ` +
  `was convergent and may have killed or missed the best reframe. (1) Name 2-3 ` +
  `NON-OBVIOUS candidates the lenses missed, each grounded in the pool. (2) Flag any ` +
  `candidate killed/dropped for the WRONG reason (e.g. "crowded" when incumbents ` +
  `chase a different wedge). (3) Name the single most exciting founder-fit direction ` +
  `and what would have to be true for it to be big. Label all as provocations; tie ` +
  `each to the founder profile.${NO_NEST}\n\n${CTX}\n\n` +
  `CANDIDATES (with kill/SOTA verdicts): ${JSON.stringify(live.map(c => ({ title: c.title, one_liner: c.one_liner, killed: c.killed, kill_reason: c.kill_reason, verdict: c.val?.verdict, contested: c.val?.contested }))).slice(0, 20000)}`,
  { phase: 'Reframe', label: 'visionary' },
);

// ============================================================================
phase('Synthesize');
if (live.length === 0) {
  return { problem: PROBLEM, mode: MODE, dir: DIR, candidates: 0, error: 'No candidates generated; nothing written.' };
}
const synthesis = await agent(
  `You are the synthesizer. WRITE two files (create '${DIR}/' if needed).${NO_NEST}\n\n` +
  `1. '${DIR}/ideas.jsonl' — one JSON line per assessed candidate: {title, one_liner, ` +
  `for_whom, wedge, why_founder, killed, kill_reason, sota_verdict, contested, incumbents}.\n` +
  `2. '${DIR}/idea-shortlist.md' — for a founder who is a maker valuing purpose & ` +
  `impact. Include: a one-paragraph HEADLINE (the best founder-fit opening and why); ` +
  `a RANKED TABLE of SURVIVORS scored on problem-fit × founder-fit × feasibility × ` +
  `ownability × how-contested × desire-fit, each with the one-liner, wedge, who's ` +
  `already there (URLs), why the founder can win, biggest risk, and the CHEAPEST ` +
  `PROBE to test it; a 'killed / dropped' list with one-line reasons (so nothing ` +
  `looks unconsidered); and a 'DIVERGENT ANGLES' section from the visionary (clearly ` +
  `labelled provocations). Do NOT let "capital-light/uncontested" silently outrank an ` +
  `ambitious idea the founder is pulled toward — surface the tension. Cite real ` +
  `sources. End with: pick 1-2 → /new-business → /research.\n\n${CTX}\n\n` +
  `VISIONARY: ${JSON.stringify(reframe || '').slice(0, 9000)}\n` +
  `ASSESSED CANDIDATES: ${JSON.stringify(live).slice(0, 55000)}`,
  { phase: 'Synthesize', label: 'synthesize' },
);

log('Ideation complete.');
return {
  problem: PROBLEM, mode: MODE, dir: DIR,
  generated: raw.length, candidates: candidates.length, survivors: survivors.length,
  shortlist: `${DIR}/idea-shortlist.md`, ledger: `${DIR}/ideas.jsonl`, summary: synthesis,
};
