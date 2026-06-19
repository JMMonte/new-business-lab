---
description: Illustrate the top filtered ideas with free, plan-backed images (Codex native image tool)
argument-hint: "<business slug> (illustrates its ranked survivors)"
---

Generate concept illustrations for the **top filtered ideas only** of `$1` — the
ranked survivors, never the whole pool. This is a paper exercise; images are free
(they use the Codex CLI's native `image_generation` tool under a logged-in
ChatGPT/Codex plan, not the metered OpenAI Image API), so there is no reason to
illustrate dead candidates.

1. Read `./businesses/$1/idea-shortlist.md` (or `market-scan.md`). Take the **top
   1–3 survivors** — the ranked table, not the killed list. If more than 3 survive,
   illustrate only the top 3.
2. Preflight: `python3 ${CLAUDE_PLUGIN_ROOT}/tools/illustrate.py --check`. If plan
   auth is missing, tell the user to run `codex login` — do **not** fall back to a
   paid `OPENAI_API_KEY` without asking.
3. For each top idea, write one concrete, specific image prompt (a single clear
   subject; the object/part as hero). Assemble a manifest JSON of
   `[{ "label": ..., "out": "businesses/$1/illustrations/NN-slug.png", "prompt": ... }]`.
4. Run `python3 ${CLAUDE_PLUGIN_ROOT}/tools/illustrate.py --manifest <manifest>`.
   Each image is one `codex exec` round-trip (~1–2 min); run in the background.
5. When done, show the images and write/refresh
   `businesses/$1/idea-illustrations.md` linking each picture to its idea.

Rules: top survivors only (cap 3); free path only (native tool, `$0` API); one
clear subject per image; no text/logos in the render. Never illustrate the whole
idea pool or the killed candidates.
