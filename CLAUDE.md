# sigil

- run everything in docker: `docker compose up` (playground :5173), `docker compose run --rm sigil pnpm check|test|test:e2e`. after a lockfile change: `docker compose build && docker compose run --rm sigil pnpm install`.
- conventional commits (feat, fix, perf, docs, test, chore; breaking `!`). releases via release-please; never bump versions or tag by hand.
- look: black, `#e6e6e6`, system mono, lowercase. no radius, shadows, color.
- performance first. no runtime deps, no web fonts. budget: css ≤ 8 kb, js ≤ 10 kb gzip over an empty svelte app (`test/node/budget.test.js`).
- licence: all rights reserved. no oss headers.
