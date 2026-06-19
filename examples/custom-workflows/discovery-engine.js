export const meta = {
  name: 'discovery-engine',
  description: 'A rigorous, reusable engine for discovering worthwhile research/industry to OWN (not a tool to sell). Frontier-scan across lenses → apply hard gates + a fitness function → deep-validate the top candidates → adversarially refute + divergently reframe → output a conviction-ranked thesis of ownable outcomes. Built for an outcome-owning, vertically-integrated venture where AI is internalized and a physical fabrication loop is the edge.',
  whenToUse: 'When you need to discover, with rigor (not gut), which high-value research/industry to commit to owning — given a physical-loop advantage and an internalize-AI / own-the-outcome strategy.',
  phases: [
    { title: 'Scan', detail: 'enumerate candidate ownable outcomes across lenses (incl. compute / space-compute)' },
    { title: 'Gate+Score', detail: 'apply hard gates + fitness function; drop failures; rank' },
    { title: 'Validate', detail: 'deep-validate top candidates: value-chain/market + technical/IP feasibility' },
    { title: 'Challenge', detail: 'skeptics refute each top thesis; visionary reframes (anti-overfit)' },
    { title: 'Synthesize', detail: 'write discovery-thesis.md + candidates.jsonl, conviction-ranked' },
  ],
};

// ---- inputs -----------------------------------------------------------------
let a = args || {};
if (typeof a === 'string') {
  const s = a.trim();
  a = s.startsWith('{') ? (() => { try { return JSON.parse(s); } catch { return { theme: s }; } })() : { theme: s };
}
const THEME = a.theme || 'Discover worthwhile research/industry to own.';
const SLUG = a.slug || 'discovery';
const DIR = a.businessDir || `businesses/${SLUG}`;
const CONSTRAINTS = a.constraints || '';
const LENSES = a.lenses || 'compute hardware value chain; SPACE COMPUTE (orbital datacenters, radiation-hard & thermal materials, in-space manufacturing) as a priority; advanced materials/energy; bio/health fabrication; and any frontier where AI hits a physical-validation wall that an owned fab loop could break';
const DEPTH = a.depth || 'standard';
const SCAN_N = DEPTH === 'deep' ? 16 : DEPTH === 'quick' ? 8 : 12;
const TOP_N = DEPTH === 'deep' ? 5 : DEPTH === 'quick' ? 3 : 4;
const LEAF_MODEL = 'haiku';
const NO_NEST = ' HARD LIMIT: do this YOURSELF with at most 6 web search/fetch calls. ' +
  'Do NOT use the Agent or Task tool; do NOT spawn subagents.';
const EST_AGENTS = 1 + SCAN_N + TOP_N * 2 + TOP_N + 1 + 1; // scan + score + validate(2x) + skeptic + visionary + synth

// The fitness function — the engine's soul (from the founder).
const FITNESS =
  'FITNESS FUNCTION for "worthwhile research/industry to OWN".\n' +
  'HARD GATES (fail ANY → reject the candidate):\n' +
  ' 1. ai_acceleratable: frontier AI (Fable/Mythos-5 class) massively compresses the design/discovery loop.\n' +
  ' 2. physical_loop_ownable: an owned physical fabrication/validation loop is the EDGE — buildable with multi-material 3D printing/additive & lab access (bio, micro, metal, ceramic, polymer, resin) at a Univ. Aveiro facility now, scaling to an owned Barreiro/Lisbon facility. If the asset gives no edge here, REJECT.\n' +
  ' 3. outcome_ownable: you own a PRODUCT / MATERIAL / COMPONENT / IP — NOT a software tool or API sold to others. (Internalize AI; do not productize the tool.)\n' +
  ' 4. survivable: a realistic path to EARLY revenue from the outcome itself (product sales or contract production of the thing), not years of pure burn.\n' +
  'SCORED 1-5 (higher = better), ranked by weighted composite:\n' +
  ' - defensibility: moat from PROPRIETARY loop-data + ownable IP / regulatory position (the durable asset; AI itself is a depreciating lever).\n' +
  ' - impact: genuine positive world impact / purpose.\n' +
  ' - value_capture: size of the ownable economic prize.\n' +
  ' - survivability: how cleanly it can earn early from the outcome.\n' +
  ' - whitespace: emerging & under-contested (giants absent), not crowded.\n' +
  ' - ai_leverage: how much AI compresses the core loop.';

const WEIGHTS = { defensibility: 1.3, impact: 1.2, value_capture: 1.2, survivability: 1.1, whitespace: 0.9, ai_leverage: 1.0 };
const SCORE_KEYS = Object.keys(WEIGHTS);

// ---- schemas ----------------------------------------------------------------
const SCAN_SCHEMA = {
  type: 'object', required: ['candidates'],
  properties: {
    candidates: {
      type: 'array',
      items: {
        type: 'object',
        required: ['lens', 'domain', 'ownable_outcome', 'thesis', 'physical_loop_fit'],
        properties: {
          lens: { type: 'string' },
          domain: { type: 'string' },
          ownable_outcome: { type: 'string' },   // the product/material/component/IP you'd OWN
          thesis: { type: 'string' },
          physical_loop_fit: { type: 'string' }, // which fab capabilities give the edge
          why_now: { type: 'string' },
        },
      },
    },
  },
};
const SCORE_SCHEMA = {
  type: 'object',
  required: ['passes_gates', 'gate_notes', 'scores', 'incumbents', 'biggest_risk'],
  properties: {
    passes_gates: { type: 'boolean' },
    gate_notes: { type: 'string' },
    scores: { type: 'object', required: SCORE_KEYS, properties: Object.fromEntries(SCORE_KEYS.map(k => [k, { type: 'number' }])) },
    incumbents: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, url: { type: 'string' }, funding: { type: 'string' } } } },
    key_evidence: { type: 'array', items: { type: 'object', properties: { claim: { type: 'string' }, url: { type: 'string' }, source_type: { type: 'string' } } } },
    biggest_risk: { type: 'string' },
  },
};
const VALIDATE_SCHEMA = {
  type: 'object', required: ['summary', 'findings'],
  properties: {
    summary: { type: 'string' },
    findings: { type: 'array', items: { type: 'object', properties: { claim: { type: 'string' }, detail: { type: 'string' }, url: { type: 'string' }, source_type: { type: 'string' } } } },
    verdict: { type: 'string' }, // strengthens | weakens | mixed
  },
};
const VERDICT_SCHEMA = {
  type: 'object', required: ['survives', 'rationale'],
  properties: { survives: { type: 'boolean' }, rationale: { type: 'string' }, correction: { type: 'string' } },
};

// ============================================================================
phase('Scan');
log(`Discovery engine on: ${THEME}`);
const scan = await agent(
  `You are the frontier scanner of a discovery engine. Enumerate ${SCAN_N} SPECIFIC ` +
  `candidate OWNABLE OUTCOMES — each a (domain × a concrete product/material/component/IP ` +
  `you could OWN) that plausibly passes the hard gates below. Be specific: not ` +
  `"thermal materials" but e.g. "additively-manufactured ceramic micro-channel cold ` +
  `plates for high-density / orbital GPU clusters". \n\nScan ACROSS THESE LENSES ` +
  `(weight the compute/space-compute lenses heavily): ${LENSES}.\n\nEvery candidate ` +
  `MUST be something a multi-material additive/fab loop could make the edge in, and ` +
  `MUST be an owned outcome (not a tool to sell). Include 3 genuinely non-obvious / ` +
  `contrarian candidates. For each: lens, domain, ownable_outcome, thesis (why now & ` +
  `why ownable), physical_loop_fit (which fab capabilities — bio/micro/metal/ceramic/` +
  `polymer/resin — give the edge), why_now.\n\n${FITNESS}\n\nTHEME: ${THEME}\n` +
  `${CONSTRAINTS ? `FOUNDER: ${CONSTRAINTS}\n` : ''}`,
  { schema: SCAN_SCHEMA, phase: 'Scan', label: 'frontier-scan' },
);
const candidates = (scan?.candidates || []).slice(0, SCAN_N);
log(`${candidates.length} candidates; gating+scoring each (~${EST_AGENTS} agents total, read-only/${LEAF_MODEL} leaves).`);

// ============================================================================
phase('Gate+Score');
const scored = (await pipeline(candidates, async (c) => {
  const r = await agent(
    `You are the gatekeeper+scorer. Research this candidate with real web sources, ` +
    `apply the HARD GATES (reject if any fails), and SCORE 1-5 on each dimension. Be ` +
    `adversarial about gates — especially physical_loop_ownable (does an owned fab ` +
    `loop truly give the edge, or is the value elsewhere?) and outcome_ownable (is it ` +
    `secretly a tool?). Name real incumbents + funding (drives whitespace). Give ` +
    `2-4 evidence items with URLs + source tier, and the biggest risk.${NO_NEST}\n\n` +
    `${FITNESS}\n\nCANDIDATE: ${JSON.stringify(c)}\nTHEME: ${THEME}`,
    { schema: SCORE_SCHEMA, phase: 'Gate+Score', label: `score:${(c.ownable_outcome || c.domain).slice(0, 22)}`,
      agentType: 'Explore', model: LEAF_MODEL },
  );
  if (!r) return null;
  const composite = SCORE_KEYS.reduce((s, k) => s + WEIGHTS[k] * (r.scores?.[k] || 0), 0);
  return { ...c, ...r, composite: Math.round(composite * 10) / 10 };
})).filter(Boolean);

const passing = scored.filter(s => s.passes_gates).sort((x, y) => y.composite - x.composite);
const rejected = scored.filter(s => !s.passes_gates);
log(`${passing.length} passed gates, ${rejected.length} rejected. Deep-validating top ${Math.min(TOP_N, passing.length)}.`);
const top = passing.slice(0, TOP_N);

// ============================================================================
phase('Validate');
const validated = await pipeline(top, async (c) => {
  const [market, tech] = await parallel([
    () => agent(
      `Deep-validate the VALUE-CHAIN & MARKET for this ownable outcome: where it sits ` +
      `in the value chain, real buyers/demand, market size, incumbents & their funding, ` +
      `and whether it's actually under-contested. Be adversarial about crowding.${NO_NEST}\n\n` +
      `OUTCOME: ${c.ownable_outcome}\nTHESIS: ${c.thesis}\nTHEME: ${THEME}`,
      { schema: VALIDATE_SCHEMA, phase: 'Validate', label: `mkt:${(c.ownable_outcome || '').slice(0, 18)}`, agentType: 'Explore', model: LEAF_MODEL },
    ),
    () => agent(
      `Deep-validate TECHNICAL FEASIBILITY + IP/REGULATORY for this ownable outcome, ` +
      `assuming a multi-material additive/fab loop (bio/micro/metal/ceramic/polymer/resin) ` +
      `at a university facility scaling to an owned facility. Assess: can the loop ` +
      `actually make this; what PROPRIETARY data/IP the loop would generate (the moat); ` +
      `regulatory burden; technical risk; and the realistic path to EARLY revenue ` +
      `(product or contract production).${NO_NEST}\n\n` +
      `OUTCOME: ${c.ownable_outcome}\nFAB FIT: ${c.physical_loop_fit}\nTHEME: ${THEME}`,
      { schema: VALIDATE_SCHEMA, phase: 'Validate', label: `tech:${(c.ownable_outcome || '').slice(0, 18)}`, agentType: 'Explore', model: LEAF_MODEL },
    ),
  ]);
  return { ...c, validation: { market, tech } };
});

// ============================================================================
phase('Challenge');
const skeptics = await parallel(validated.map((c) => () =>
  agent(
    `You are a skeptic. Try to REFUTE the thesis that this is a worthwhile outcome to ` +
    `OWN. Default to survives:false if the moat is thin/copyable, the physical-loop ` +
    `edge is illusory, incumbents already own it, early revenue is implausible, or it's ` +
    `secretly a commoditizing tool. Search for disconfirming evidence.${NO_NEST}\n\n` +
    `OUTCOME: ${c.ownable_outcome}\nTHESIS: ${c.thesis}\n` +
    `VALIDATION: ${JSON.stringify(c.validation).slice(0, 9000)}`,
    { schema: VERDICT_SCHEMA, phase: 'Challenge', label: `refute:${(c.ownable_outcome || '').slice(0, 18)}`, agentType: 'Explore', model: LEAF_MODEL },
  ).then(v => ({ outcome: c.ownable_outcome, ...(v || { survives: null }) })),
));

const visionary = passing.length === 0 ? null : await agent(
  `You are the Visionary — the divergent counterweight. The engine just gated, scored, ` +
  `and validated candidates convergently and may have overfit to what's searchable and ` +
  `to incumbent presence. Counterweight it: (1) name 2-3 NON-OBVIOUS ownable outcomes ` +
  `the scan missed — especially in the COMPUTE / SPACE-COMPUTE hardware value chain ` +
  `where an owned multi-material fab loop is the edge; (2) flag where a "crowded/low-` +
  `whitespace" verdict is wrong (incumbents chasing a different layer); (3) name the ` +
  `single most EXCITING ownable outcome for a builder who values purpose, integrity & ` +
  `impact, and what would have to be true for it to be huge; (4) the cheapest probe for ` +
  `the top picks. Ground each in a specific candidate/finding; label as provocations.${NO_NEST}\n\n` +
  `${FITNESS}\n\nTHEME: ${THEME}\n${CONSTRAINTS ? `FOUNDER: ${CONSTRAINTS}\n` : ''}` +
  `RANKED PASSING: ${JSON.stringify(passing.map(p => ({ outcome: p.ownable_outcome, lens: p.lens, composite: p.composite, scores: p.scores, incumbents: (p.incumbents || []).map(i => i.name), risk: p.biggest_risk }))).slice(0, 22000)}\n` +
  `REJECTED (gate-failed): ${JSON.stringify(rejected.map(r => ({ outcome: r.ownable_outcome, why: r.gate_notes }))).slice(0, 6000)}`,
  { phase: 'Challenge', label: 'visionary' },
);
log('Challenge complete (skeptics + visionary).');

// ============================================================================
phase('Synthesize');
if (passing.length === 0) {
  return { theme: THEME, dir: DIR, candidates: scored.length, passing: 0,
    error: 'No candidate passed the hard gates — loosen the gates or rethink the asset fit.' };
}
const skMap = Object.fromEntries(skeptics.filter(Boolean).map(s => [s.outcome, s]));
const synthesis = await agent(
  `You are the synthesizer of a discovery engine. WRITE two files (create '${DIR}/' if ` +
  `needed).${NO_NEST}\n\n` +
  `1. '${DIR}/discovery-candidates.jsonl' — one JSON line per scored candidate ` +
  `(passing first, then gate-rejected with their gate_notes): outcome, lens, domain, ` +
  `composite, scores{...}, passes_gates, incumbents[...], biggest_risk.\n` +
  `2. '${DIR}/discovery-thesis.md' — the conviction document for a dreamer/maker who ` +
  `internalizes AI and wants to OWN one high-value outcome via a physical fab loop ` +
  `(Aveiro→Barreiro). Include: a HEADLINE (the most worthwhile research/industry to own ` +
  `and why); a RANKED TABLE of all gate-passing candidates (outcome | lens | composite | ` +
  `standout high/low scores | key incumbents); a GATE-REJECTED list (what failed & why — ` +
  `this is signal too); a TOP ${TOP_N} DEEP-DIVE (thesis, the ownable moat = proprietary ` +
  `loop-data + IP, which fab capabilities are the edge, value-chain position, incumbents, ` +
  `skeptic verdict, the biggest risk, and the single cheapest probe to test it); a ` +
  `DIVERGENT ANGLES section from the visionary (non-obvious outcomes esp. in compute/` +
  `space-compute, clearly labelled provocations); and a CONVICTION PROMPT — 2-3 ` +
  `questions to help the founder apply his own pulse to this rigorous shortlist. Cite ` +
  `real sources/incumbents with URLs; be honest about crowding, capital, and time-to-` +
  `revenue. Hold both the convergent ranking and the divergent reframes.\n\n` +
  `THEME: ${THEME}\n${CONSTRAINTS ? `FOUNDER: ${CONSTRAINTS}\n` : ''}` +
  `VISIONARY: ${JSON.stringify(visionary || '').slice(0, 9000)}\n` +
  `TOP (with validation + skeptic): ${JSON.stringify(validated.map(c => ({ ...c, skeptic: skMap[c.ownable_outcome] }))).slice(0, 45000)}\n` +
  `ALL SCORED (brief): ${JSON.stringify(scored.map(s => ({ outcome: s.ownable_outcome, lens: s.lens, composite: s.composite, passes: s.passes_gates, gate_notes: s.gate_notes }))).slice(0, 12000)}`,
  { phase: 'Synthesize', label: 'synthesize' },
);

log('Discovery thesis complete.');
return {
  theme: THEME, dir: DIR, scanned: candidates.length, passedGates: passing.length, deepValidated: top.length,
  top: passing.slice(0, TOP_N).map(p => ({ outcome: p.ownable_outcome, lens: p.lens, composite: p.composite })),
  thesis: `${DIR}/discovery-thesis.md`, ledger: `${DIR}/discovery-candidates.jsonl`,
  summary: synthesis,
};
