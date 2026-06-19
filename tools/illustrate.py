#!/usr/bin/env python3
"""illustrate.py — free idea illustrations via the Codex CLI's native image tool.

The New Business Lab is a *paper* exercise: cheap, on-paper checks before real
spend. So illustrations must be free too. This drives the Codex CLI's **native
`image_generation` tool** (covered by a logged-in ChatGPT/Codex plan) — NOT the
`imagegen` skill's `image_gen.py`, which calls the metered OpenAI Image API and
needs `OPENAI_API_KEY`.

How it works
------------
`codex exec` renders the image inline and records it in the run's session
transcript (`~/.codex/sessions/.../rollout-*.jsonl`) as a base64 PNG under
`payload.result`. In headless mode no PNG is written to disk, so this script runs
one `codex exec` per job, finds the session file that run produced, decodes the
largest PNG in it, and writes it to the requested path.

Cost: $0 in API charges (plan-backed). Verify with --check.

Usage
-----
  # one image
  python3 tools/illustrate.py --prompt "<scene>" --out businesses/<slug>/illustrations/foo.png

  # batch — a JSON list of {"prompt": ..., "out": ...} (optionally "label")
  python3 tools/illustrate.py --manifest jobs.json

  # preflight: confirm codex is present and plan-authed (no metered key needed)
  python3 tools/illustrate.py --check

Discipline (see frameworks/02-ideate.md): illustrate the **top filtered ideas
only** — the ranked survivors, not the whole pool. A handful of images, never a
gallery of dead candidates.
"""
from __future__ import annotations

import argparse
import base64
import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path

SESSIONS_DIR = Path(os.environ.get("CODEX_HOME", Path.home() / ".codex")) / "sessions"

# Appended to every prompt so Codex uses the free native tool, not the paid skill.
_TOOL_DIRECTIVE = (
    " Use your native image_generation tool to render this. "
    "Do NOT use the imagegen python script (scripts/image_gen.py) and do NOT use a "
    "metered OPENAI_API_KEY. Render one image only."
)

# A house style so a set of idea cards looks coherent.
_HOUSE_STYLE = (
    " Style: clean, premium editorial concept illustration; restrained palette; "
    "soft, even studio lighting; a single clear subject; generous negative space; "
    "no text, no logos, no watermark, no UI chrome; avoid stock-photo cheesiness, "
    "neon, lens flare, clutter."
)


def _newest_session_after(t0: float) -> Path | None:
    """Newest rollout-*.jsonl modified at/after t0."""
    if not SESSIONS_DIR.exists():
        return None
    candidates = [
        p for p in SESSIONS_DIR.rglob("rollout-*.jsonl")
        if p.stat().st_mtime >= t0 - 1.0
    ]
    return max(candidates, key=lambda p: p.stat().st_mtime, default=None)


def _largest_png_in(session: Path) -> bytes | None:
    """Extract the largest base64 string in the transcript that decodes to a PNG."""
    best: bytes | None = None
    b64_re = re.compile(r"^[A-Za-z0-9+/=]+$")
    for line in session.read_text(errors="ignore").splitlines():
        line = line.strip()
        if not line or "image_generation" not in line and "result" not in line:
            continue
        try:
            obj = json.loads(line)
        except json.JSONDecodeError:
            continue
        for s in _iter_strings(obj):
            if len(s) < 5000 or not b64_re.match(s[:256]):
                continue
            try:
                raw = base64.b64decode(s + "=" * ((4 - len(s) % 4) % 4))
            except Exception:
                continue
            if raw[:8] == b"\x89PNG\r\n\x1a\n" and (best is None or len(raw) > len(best)):
                best = raw
    return best


def _iter_strings(obj):
    if isinstance(obj, str):
        yield obj
    elif isinstance(obj, dict):
        for v in obj.values():
            yield from _iter_strings(v)
    elif isinstance(obj, list):
        for v in obj:
            yield from _iter_strings(v)


def generate(prompt: str, out: Path, *, style: bool = True, timeout: int = 600) -> bool:
    full = prompt + (_HOUSE_STYLE if style else "") + _TOOL_DIRECTIVE
    out.parent.mkdir(parents=True, exist_ok=True)
    t0 = time.time()
    cmd = [
        "codex", "exec",
        "-s", "workspace-write",
        "-c", "sandbox_workspace_write.network_access=true",
        full,
    ]
    print(f"  · codex generating → {out.name} …", file=sys.stderr)
    try:
        subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
    except subprocess.TimeoutExpired:
        print(f"  ✗ timed out after {timeout}s", file=sys.stderr)
        return False
    session = _newest_session_after(t0)
    if not session:
        print("  ✗ no session transcript found", file=sys.stderr)
        return False
    png = _largest_png_in(session)
    if not png:
        print(f"  ✗ no PNG in transcript ({session.name})", file=sys.stderr)
        return False
    out.write_bytes(png)
    print(f"  ✓ wrote {out} ({len(png)//1024} KB)", file=sys.stderr)
    return True


def check() -> int:
    codex = subprocess.run(["which", "codex"], capture_output=True, text=True)
    if codex.returncode != 0:
        print("codex CLI not found on PATH.", file=sys.stderr)
        return 1
    auth = Path(os.environ.get("CODEX_HOME", Path.home() / ".codex")) / "auth.json"
    plan = False
    if auth.exists():
        try:
            plan = bool(json.loads(auth.read_text()).get("tokens"))
        except Exception:
            pass
    print(f"codex: {codex.stdout.strip()}")
    print(f"plan auth (free native image tool): {'yes' if plan else 'NO — log in with: codex login'}")
    print("metered OPENAI_API_KEY present:", "yes" if os.environ.get("OPENAI_API_KEY") else "no (not needed)")
    return 0 if plan else 2


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--prompt")
    ap.add_argument("--out")
    ap.add_argument("--manifest", help="JSON list of {prompt, out, label?}")
    ap.add_argument("--no-style", action="store_true", help="skip the house style preamble")
    ap.add_argument("--check", action="store_true", help="preflight codex/plan auth and exit")
    ap.add_argument("--timeout", type=int, default=600)
    args = ap.parse_args()

    if args.check:
        return check()

    jobs = []
    if args.manifest:
        jobs = json.loads(Path(args.manifest).read_text())
    elif args.prompt and args.out:
        jobs = [{"prompt": args.prompt, "out": args.out}]
    else:
        ap.error("provide --prompt and --out, or --manifest, or --check")

    ok = 0
    for i, job in enumerate(jobs, 1):
        label = job.get("label", job["out"])
        print(f"[{i}/{len(jobs)}] {label}", file=sys.stderr)
        if generate(job["prompt"], Path(job["out"]), style=not args.no_style, timeout=args.timeout):
            ok += 1
    print(f"\nDone: {ok}/{len(jobs)} images generated (free, plan-backed).", file=sys.stderr)
    return 0 if ok == len(jobs) else 1


if __name__ == "__main__":
    raise SystemExit(main())
