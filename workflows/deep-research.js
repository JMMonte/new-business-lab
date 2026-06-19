export const meta = {
  name: 'deep-research',
  description: 'Multi-agent deep research for a business idea: decompose → fan out across formal/community/competitor sources → grade every source & voice-of-customer signal → adversarially verify → synthesize a cited report + evidence ledger',
  whenToUse: 'When validating a business idea needs broad, source-graded evidence — market size, demand/pain, competition, pricing, channel, regulation — especially the real voice of the customer from communities and social.',
  phases: [
    { title: 'Decompose', detail: 'split the question into dimension sub-questions' },
    { title: 'Gather', detail: 'per sub-question, fan out across formal-web / community / competitor modalities' },
    { title: 'Grade', detail: 'score source credibility (Axis 1) and voice-of-customer signal (Axis 2)' },
    { title: 'Verify', detail: 'adversarially refute load-bearing claims; collapse echo chambers' },
    { title: 'Reframe', detail: 'one divergent/visionary agent counterweights the skeptics to avoid overfitting' },
    { title: 'Synthesize', detail: 'write research-report.md + evidence.jsonl, run evidence.py' },
  ],
};

// ---- inputs -----------------------------------------------------------------
// args may arrive as an object, OR as a JSON string (some launch paths stringify
// it), OR as a plain question string. Parse defensively so slug/businessDir don't
// silently fall back to defaults (which once misrouted output to businesses/untitled).
let a = args || {};
if (typeof a === 'string') {
  const s = a.trim();
  if (s.startsWith('{')) {
    try { a = JSON.parse(s); } catch { a = { question: a }; }
  } else {
    a = { question: a };
  }
}
const QUESTION = a.question || 'Validate this business idea: demand, market, competition, pricing, channel, regulation.';
const SLUG = a.slug || 'untitled';
const BUSINESS_DIR = a.businessDir || `businesses/${SLUG}`;
const DEPTH = a.depth || 'quick'; // 'quick' | 'standard' | 'deep'
const MAX_SUBQ = DEPTH === 'deep' ? 5 : DEPTH === 'quick' ? 3 : 4;
const SKEPTICS = DEPTH === 'deep' ? 2 : 1;
// HARD CAP on how many load-bearing claims get the adversarial skeptic pass.
// Without this, verify spawns 1 skeptic PER load-bearing claim, and gather agents
// can mark dozens load-bearing → unbounded blow-up (a 'standard' run once hit 59
// agents because 44 claims were flagged). We verify only the top MAX_VERIFY most-
// corroborated load-bearing claims; the rest are reported with their grade only.
const MAX_VERIFY = DEPTH === 'deep' ? 8 : DEPTH === 'quick' ? 5 : 8;
// Cost controls. The run is bounded by the per-stage CAPS (modes, MAX_VERIFY) + a
// cheap leaf model — NOT by forbidding nesting. Leaves may delegate a little (soft
// cap below) when it genuinely helps; total stays a few dozen, never hundreds.
const MODES = DEPTH === 'deep' ? 3 : 2;       // formal + community [+ competitor on deep]
const LEAF_MODEL = 'haiku';                    // gather/grade/verify run cheap
const NO_NEST = ' Keep this proportionate: do the work yourself in a handful of web ' +
  'search/fetch/scrape calls. You MAY delegate to at most ~2 helper subagents ONLY ' +
  'if it clearly speeds real work — never spawn a fleet, never nest deeply; prefer ' +
  'doing it directly. If you cannot find something in a few calls, return what you have.';
// BASE upper bound on the workflow's own agent calls (verify is capped at MAX_VERIFY).
// Leaves may add a modest number if they delegate. 1 decompose + gather/grade +
// (capped skeptics) + 1 visionary + 1 synth.
const EST_AGENTS = 1 + MAX_SUBQ * (MODES + 1) + MAX_VERIFY * SKEPTICS + 1 + 1;

const VALUATION = 'Follow frameworks/source-valuation.md exactly. Two axes: ' +
  'Axis-1 source credibility tiers T1 primary/official(5) · T2 independent(4) · ' +
  'T3 trade(3) · T4 vendor/self-interested(2) · T5 community/social(1 for facts) · ' +
  'T6 unknown(0), adjusted -2 conflict-of-interest / +1 claim-against-interest / ' +
  '-1 stale. Axis-2 voice-of-customer: grade the SIGNAL not the speaker — revealed ' +
  'preference (paid, switched, churned, built a workaround) beats stated; organic/' +
  'unprompted beats solicited; specific+intense beats vague; in-segment beats not. ' +
  'Watch for astroturf: bursts of similar wording, new accounts, marketing-speak, ' +
  'uniform 5-star clusters. Independence over volume: many sources tracing to one ' +
  'origin collapse to one.';

const LEDGER_FORMAT = 'Return findings as ledger objects: {claim_id (kebab-case, ' +
  'stable across findings about the same claim), claim, dimension (demand|market|' +
  'competition|pricing|channel|regulation|team), stance ("supports"|"contradicts"), ' +
  'source_type (T1..T6), url, origin (domain or author cluster), date (YYYY-MM), ' +
  'kind (revealed|intent|stated|measured|factual), voc {authenticity,specificity,' +
  'intensity,in_segment} ONLY for what-people-say findings, adjust (-2..+1, optional), ' +
  'load_bearing (true if the idea depends on it), note (<=160 chars; for VoC keep a ' +
  'real quote)}. Cite a real URL for every finding — no URL means do not log it.';

// ---- schemas ----------------------------------------------------------------
const FINDING = {
  type: 'object',
  required: ['claim_id', 'claim', 'dimension', 'source_type', 'url', 'origin', 'kind'],
  properties: {
    claim_id: { type: 'string' }, claim: { type: 'string' },
    dimension: { type: 'string' }, stance: { type: 'string', enum: ['supports', 'contradicts'] },
    source_type: { type: 'string', enum: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'] },
    url: { type: 'string' }, origin: { type: 'string' }, date: { type: 'string' },
    kind: { type: 'string', enum: ['revealed', 'intent', 'stated', 'measured', 'factual'] },
    voc: {
      type: 'object',
      properties: {
        authenticity: { type: 'number' }, specificity: { type: 'number' },
        intensity: { type: 'number' }, in_segment: { type: 'boolean' },
      },
    },
    adjust: { type: 'number' }, load_bearing: { type: 'boolean' }, note: { type: 'string' },
  },
};
const FINDINGS_SCHEMA = { type: 'object', required: ['findings'], properties: { findings: { type: 'array', items: FINDING } } };
const DECOMPOSE_SCHEMA = {
  type: 'object', required: ['subquestions'],
  properties: {
    subquestions: {
      type: 'array',
      items: {
        type: 'object', required: ['id', 'dimension', 'question'],
        properties: {
          id: { type: 'string' }, dimension: { type: 'string' },
          question: { type: 'string' }, why: { type: 'string' },
          load_bearing: { type: 'boolean' },
        },
      },
    },
  },
};
const VERDICT_SCHEMA = {
  type: 'object', required: ['claim_id', 'survives', 'rationale'],
  properties: {
    claim_id: { type: 'string' }, survives: { type: 'boolean' },
    independent_sources: { type: 'number' }, echo_chamber: { type: 'boolean' },
    astroturf: { type: 'boolean' }, rationale: { type: 'string' },
    correction: { type: 'string' },
  },
};

// ============================================================================
phase('Decompose');
log(`Researching: ${QUESTION}`);
const plan = await agent(
  `You are the research lead for the New Business Lab. Decompose this research ` +
  `question into at most ${MAX_SUBQ} sharp sub-questions, one per dimension that ` +
  `matters (demand/pain, market size & growth, competition & moat, pricing, ` +
  `channel & CAC, regulation, team — only those relevant). Mark the 1-2 that the ` +
  `idea most depends on as load_bearing. Each sub-question must be answerable with ` +
  `evidence and worth a fan-out.\n\nQUESTION: ${QUESTION}\nCONTEXT DIR: ${BUSINESS_DIR}`,
  { schema: DECOMPOSE_SCHEMA, phase: 'Decompose', label: 'decompose' },
);
const subqs = (plan?.subquestions || []).slice(0, MAX_SUBQ);
log(`${subqs.length} sub-questions; ${subqs.filter(s => s.load_bearing).length} load-bearing. ` +
  `Depth=${DEPTH}, ~${EST_AGENTS} base agents on ${LEAF_MODEL} (leaves may delegate a little; bounded to a few dozen by the caps).`);

// ============================================================================
// Gather (fan out across modalities) → Grade — as a pipeline, per sub-question.
const gathered = await pipeline(
  subqs,
  // -- stage 1: three blind modality searches, in parallel --
  async (sq) => {
    const modes = [
      {
        key: 'formal', label: `formal:${sq.dimension}`,
        prompt:
          `Research this sub-question using FORMAL sources only — official ` +
          `statistics, regulatory filings, audited financials, peer-reviewed or ` +
          `independent analyst research, quality journalism, company filings. Use ` +
          `web search / fetch / scrape tools (find them via tool search: firecrawl, ` +
          `exa, web search). Prefer primary data; trace every number to its origin.`,
      },
      {
        key: 'community', label: `community:${sq.dimension}`,
        prompt:
          `Research this sub-question by LISTENING TO PEOPLE — Reddit, Hacker News, ` +
          `Indie Hackers, niche forums, Discord/Slack, Facebook groups, Stack ` +
          `Exchange, X/Twitter, LinkedIn, and product reviews (G2, Capterra, app ` +
          `stores, Trustpilot, Amazon). Hunt especially for REVEALED PREFERENCE: ` +
          `people who paid for a workaround, switched, churned, or left 1-3 star ` +
          `reviews of incumbents naming the exact gap. Capture real quotes and the ` +
          `target segment. Fill the voc block on every finding. Flag anything that ` +
          `smells like astroturf or promotion. Use search/scrape + any social/SEO ` +
          `listening tools you can find via tool search.`,
      },
      {
        key: 'competitor', label: `competitor:${sq.dimension}`,
        prompt:
          `Research this sub-question by examining COMPETITORS & substitutes — ` +
          `product pages, public pricing, changelogs/release notes, funding & M&A, ` +
          `job postings (what they're building), and how customers describe them. ` +
          `Note claims-against-interest (a vendor conceding a weakness) — those are ` +
          `high-trust. Use web search / fetch / scrape tools found via tool search.`,
      },
    ].slice(0, MODES);  // formal + community by default; competitor only on deep
    const results = await parallel(modes.map((m) => () =>
      agent(
        `${m.prompt}\n\n${VALUATION}\n\n${LEDGER_FORMAT}\n\n` +
        `SUB-QUESTION [${sq.dimension}]: ${sq.question}\n` +
        `${sq.load_bearing ? 'This is LOAD-BEARING — set load_bearing:true and dig hard, including for disconfirming evidence.\n' : ''}` +
        `Log contradicting evidence too (stance:"contradicts"). Return only findings you can cite.${NO_NEST}`,
        // Cheap leaf model; may delegate sparingly (soft cap in SCOPE). The real
        // bound is the per-stage caps (MODES, MAX_VERIFY), not banning the Agent tool.
        { schema: FINDINGS_SCHEMA, phase: 'Gather', label: m.label, model: LEAF_MODEL },
      ).then(r => (r?.findings || [])),
    ));
    return { sq, raw: results.flat() };
  },
  // -- stage 2: grade / normalize / dedupe for this sub-question --
  async (g) => {
    if (!g) return null;
    const graded = await agent(
      `You are the source grader. Here are raw findings for one sub-question. ` +
      `Normalize and quality-check them per the valuation model: fix any wrong ` +
      `source_type or kind, ensure voc is present for what-people-say findings, ` +
      `apply adjust (-2 conflict-of-interest, +1 claim-against-interest, -1 stale), ` +
      `merge duplicate findings, and COLLAPSE echo chambers (multiple findings from ` +
      `one origin/author → keep one, lower its voc authenticity, note it). Drop ` +
      `findings with no usable URL. Keep contradicting findings. Use stable ` +
      `claim_ids so findings about the same claim group together.\n\n${VALUATION}\n\n` +
      `${LEDGER_FORMAT}\n\nSUB-QUESTION [${g.sq.dimension}]: ${g.sq.question}\n` +
      `RAW FINDINGS:\n${JSON.stringify(g.raw).slice(0, 24000)}${NO_NEST}`,
      { schema: FINDINGS_SCHEMA, phase: 'Grade', label: `grade:${g.sq.dimension}`, model: LEAF_MODEL },
    );
    return { dimension: g.sq.dimension, load_bearing: !!g.sq.load_bearing, findings: graded?.findings || [] };
  },
);

const clean = gathered.filter(Boolean);
const allFindings = clean.flatMap(c => c.findings.map(f => ({ ...f, load_bearing: f.load_bearing || c.load_bearing })));
log(`${allFindings.length} graded findings across ${clean.length} sub-questions`);

// ============================================================================
phase('Verify');
// Group findings by claim_id; adversarially verify load-bearing claims.
const byClaim = {};
for (const f of allFindings) (byClaim[f.claim_id] ||= []).push(f);
const allLoadBearing = Object.entries(byClaim).filter(([, fs]) => fs.some(f => f.load_bearing));
// Cap to the MAX_VERIFY most-corroborated (most findings) load-bearing claims so the
// skeptic fan-out stays bounded no matter how many claims gather agents flagged.
const loadBearingClaims = allLoadBearing
  .sort((x, y) => y[1].length - x[1].length)
  .slice(0, MAX_VERIFY);
const skipped = allLoadBearing.length - loadBearingClaims.length;
log(`Adversarially verifying ${loadBearingClaims.length} of ${allLoadBearing.length} ` +
  `load-bearing claim(s) with ${SKEPTICS} skeptic(s) each` +
  (skipped > 0 ? ` (${skipped} lower-priority claims reported with grade only — cap ${MAX_VERIFY})` : ''));

const verdicts = (await parallel(
  loadBearingClaims.flatMap(([cid, fs]) =>
    Array.from({ length: SKEPTICS }, (_, i) => () =>
      agent(
        `You are skeptic #${i + 1}. Try to REFUTE this claim, do not confirm it. ` +
        `Default to survives:false when the evidence is thin, circular, stale, ` +
        `vendor-interested, solicited-only, or an echo chamber. Check INDEPENDENCE ` +
        `(do the sources actually derive from one origin?), look for astroturf, and ` +
        `weigh whether the voice-of-customer signal is revealed preference or just ` +
        `talk. Search the web yourself to find disconfirming evidence the gatherers ` +
        `may have missed.\n\n${VALUATION}\n\nCLAIM: ${fs[0].claim}\n` +
        `EVIDENCE:\n${JSON.stringify(fs).slice(0, 16000)}${NO_NEST}`,
        { schema: VERDICT_SCHEMA, phase: 'Verify', label: `refute:${cid.slice(0, 18)}#${i + 1}`, model: LEAF_MODEL },
      ),
    ),
  ),
)).filter(Boolean);

// majority vote per claim
const claimVerdict = {};
for (const v of verdicts) {
  const c = (claimVerdict[v.claim_id] ||= { yes: 0, no: 0, notes: [] });
  v.survives ? c.yes++ : c.no++;
  if (v.rationale) c.notes.push(v.rationale);
  if (v.correction) c.notes.push(`correction: ${v.correction}`);
}
const survivors = Object.entries(claimVerdict).map(([cid, c]) => ({
  claim_id: cid, survives: c.yes >= c.no, votes: `${c.yes}✓/${c.no}✗`, notes: c.notes,
}));

// ============================================================================
// Reframe — the one DIVERGENT voice. Counterweights the convergent skeptics so
// the analysis doesn't overfit to consensus or to whatever data was searchable.
// Grounded in the same evidence; outputs labelled provocations, not findings.
phase('Reframe');
const REFRAME_SCHEMA = {
  type: 'object', required: ['angles'],
  properties: {
    overfit_flags: { type: 'array', items: { type: 'string' } },
    angles: {
      type: 'array',
      items: {
        type: 'object', required: ['reframe', 'grounded_in', 'what_must_be_true', 'cheapest_test'],
        properties: {
          kind: { type: 'string' }, // reframe | inversion | adjacent | contrarian | second-order
          reframe: { type: 'string' },
          grounded_in: { type: 'string' },        // the specific finding it riffs on
          what_must_be_true: { type: 'string' },
          cheapest_test: { type: 'string' },
        },
      },
    },
  },
};
const reframe = allFindings.length === 0 ? null : await agent(
  `You are the Visionary — the one divergent voice after a panel of skeptics. The ` +
  `auditors and refutation panel tried to KILL this idea; do NOT relitigate their ` +
  `facts — accept them, then go around them. Find what convergence missed: reframe ` +
  `the problem (different customer / unit of value / wedge), invert ("what would ` +
  `have to be true for this to be HUGE?"), surface the adjacent opportunity the ` +
  `evidence points sideways to, flag where a conclusion is an artifact of ` +
  `*available data* rather than reality (absence-of-evidence ≠ evidence-of-absence), ` +
  `and state a contrarian thesis as a falsifiable claim. Ground EVERY angle in a ` +
  `specific finding (quote it), label all output as provocations/hypotheses, and ` +
  `attach the cheapest test for each. 3-5 genuinely non-obvious angles beat twenty ` +
  `platitudes. Be imaginative but not delusional.${NO_NEST}\n\n` +
  `QUESTION: ${QUESTION}\n` +
  `SKEPTIC VERDICTS: ${JSON.stringify(survivors).slice(0, 6000)}\n` +
  `GRADED FINDINGS: ${JSON.stringify(allFindings).slice(0, 40000)}`,
  { schema: REFRAME_SCHEMA, phase: 'Reframe', label: 'visionary' },
);
log(`Visionary produced ${reframe?.angles?.length || 0} divergent angle(s).`);

// ============================================================================
phase('Synthesize');
// Guard: never let an empty/failed research run overwrite good existing evidence.
if (allFindings.length === 0) {
  log('No findings gathered — skipping synthesis so existing evidence.jsonl is preserved.');
  return {
    question: QUESTION, businessDir: BUSINESS_DIR, findings: 0,
    error: 'Research produced no findings; nothing written. Check tool availability / question.',
  };
}
const synthesis = await agent(
  `You are the research synthesizer. Produce the deliverables and WRITE them to ` +
  `disk with your tools.${NO_NEST}\n\n` +
  `IMPORTANT: '${BUSINESS_DIR}/evidence.jsonl' may already contain findings from the ` +
  `Think stage — read it first and APPEND/MERGE, do not blindly overwrite away good ` +
  `evidence.\n\n` +
  `1. Write '${BUSINESS_DIR}/evidence.jsonl' — one graded finding per line, ledger ` +
  `format (schema: templates/evidence.example.jsonl). Merge the graded findings ` +
  `below with any existing ones. Apply the skeptics' corrections where given.\n` +
  `2. Run: python3 tools/evidence.py ${BUSINESS_DIR}/evidence.jsonl  — and use its ` +
  `computed Evidence Strength + tags in the report.\n` +
  `3. Write '${BUSINESS_DIR}/research-report.md': findings by dimension (each claim ` +
  `with its tag, strength, and 1-2 key sources); a dedicated VOICE-OF-CUSTOMER ` +
  `section quoting customers in their own words, revealed-preference highlighted; a ` +
  `CONTRADICTIONS & OPEN QUESTIONS list; an ASTROTURF/QUALITY note; a ` +
  `'DIVERGENT ANGLES & REFRAMES' section built from the Visionary output below ` +
  `(reframes/inversions/adjacent opportunities/contrarian bets, each grounded in a ` +
  `finding and paired with its cheapest test — clearly labelled as provocations, ` +
  `not findings); and a closing 'what the Test stage must still measure' list (the ` +
  `load-bearing claims that did not reach [measured]).\n\n` +
  `Be honest and cite everything. Note where evidence is thin. Hold both views: ` +
  `report the skeptics' convergent verdict AND the divergent reframes — do not let ` +
  `either erase the other. Research informs; it does not replace the Test stage.\n\n` +
  `QUESTION: ${QUESTION}\n` +
  `SKEPTIC VERDICTS (load-bearing claims): ${JSON.stringify(survivors).slice(0, 8000)}\n` +
  `VISIONARY / DIVERGENT ANGLES: ${JSON.stringify(reframe || {}).slice(0, 10000)}\n` +
  `GRADED FINDINGS: ${JSON.stringify(allFindings).slice(0, 55000)}`,
  { phase: 'Synthesize', label: 'synthesize' },
);

log('Deep research complete.');
return {
  question: QUESTION,
  businessDir: BUSINESS_DIR,
  subquestions: subqs.length,
  findings: allFindings.length,
  loadBearingClaims: loadBearingClaims.length,
  skepticVerdicts: survivors,
  report: `${BUSINESS_DIR}/research-report.md`,
  ledger: `${BUSINESS_DIR}/evidence.jsonl`,
  summary: synthesis,
};
