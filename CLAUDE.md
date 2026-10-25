# sigil

- talk minimal. straight to the point. no overexplaining. same for docs and copy.
- docs: nothing an advanced developer already knows. no taglines, no stack names, no obvious commands or examples.
- commit as `0x0nb <0x@0nb.dev>`, signed (repo config). never add co-author or ai trailers.
- push only via `git@github-0x0nb:0nb/sigil.git`.
- releases: release-please. conventional commits (feat, fix, perf, docs, test, chore; breaking: `!`). never bump versions or tag by hand.
- run everything in docker, never on the host: `docker compose up` (playground :5173), `docker compose run --rm sigil pnpm check|test|test:e2e`. after a lockfile change: `docker compose build && docker compose run --rm sigil pnpm install`. ci runs the same commands.
- look: black, `#e6e6e6`, system mono, lowercase. no radius, shadows, color.
- performance first. no runtime deps, no web fonts. budget: css ≤ 8 kb, js ≤ 10 kb gzip.
- no claude.ai artifacts. everything local.
- licence: all rights reserved. no oss headers.
- spec: `docs/superpowers/specs/2026-10-24-sigil-design.md`
- plan: `docs/superpowers/plans/2026-10-24-sigil.md`
