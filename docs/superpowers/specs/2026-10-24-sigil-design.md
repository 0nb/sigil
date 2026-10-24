# sigil — the 0nb design system

date: 2026-10-24 · status: ready for approval

## 1. intent

0nb is a small software brand (github org `0nb`, domain `0nb.dev`). Every project in the org must share one design system and one design language: the one established on the 0nb.dev homepage. sigil is that system, packaged so each project installs it instead of re-creating the look.

Performance is the top priority for every 0nb project. The minimal visual design and minimal scope exist to serve it. sigil must make pages faster, never heavier.

The first consumer is **fold**, a public url shortener (Kutt feature parity, passkey accounts, Cloudflare Workers free tier, links on `fld.0nb.dev`). fold's needs decide which components exist in v1. Later projects add components when they need them.

## 2. goals

- one package, installed from GitHub at a pinned tag, that gives a project the full 0nb look: tokens, base styles, components, brand assets
- the **terminal** UI language (section 5) available as ready-made Svelte components
- every page built with sigil is dark, lowercase, monospace, monochrome
- strict size budget (section 8): no web fonts, no runtime dependencies besides svelte itself
- accessible: readable contrast for all text, full keyboard use, reduced motion respected
- a browsable reference that lives in the repo (section 10) and that people and agents read before building any 0nb UI

## 3. non-goals

- light theme (dark only, by decision)
- custom or bundled typefaces (system mono only, by decision)
- an icon set (the sigil mark and plain text glyphs cover it)
- React, Vue or other framework bindings
- publishing to npm
- generic component coverage "just in case": a component exists only when a 0nb project needs it
- fold-specific pieces (QR rendering, passkey flows, link forms) — those live in fold, built from sigil parts

## 4. anti-goals (failure even if it technically works)

- anything that looks like a generic SaaS UI: rounded cards, drop shadows, gradients, colored accents, pill badges
- a dependency that slows a consumer's first paint (component libraries like bits-ui/radix, chart libraries, animation libraries)
- projects forking or overriding the theme to get "their own" look
- capitalized UI copy, marketing tone, emoji

## 5. design language (decided)

### 5.1 foundations

- **ground** `#000000`, pure black, everywhere. dark only.
- **text** `#e6e6e6` primary.
- **secondary text** about `#8a8a8a` (≈6:1 on black, passes WCAG AA). used for labels, destinations, metadata.
- **ghost** `#4a4a4a` (≈2.4:1). decoration only: corner tags, grid labels, inactive chrome. never the only carrier of information; mark it `aria-hidden` when purely decorative.
- **lines** `rgba(255,255,255,.07)` for the background grid; `#2a2a2a` for the single underline under prompts and table headers.
- **typeface** system monospace only: `ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace`. nothing is downloaded.
- **type sizes** a short scale around 10/11 (tags, tracked about .3em), 12/13 (body, tables), 15 (prompt input), 28 (display). numbers use tabular figures.
- **case** all copy is written lowercase (content, not `text-transform`).
- **background grid** 40px grid with a radial vignette, as on 0nb.dev. optional per page.
- **corner tags** small tracked labels pinned to page corners (`0nb` / `est. 2023` on brand pages).
- **sigil mark** a ring cut by a vertical line. svg, `currentColor`.
- **motion** almost none: the blinking block cursor, the spinner, and the horizon shader on brand pages. all of it stops under `prefers-reduced-motion`.

### 5.2 terminal rules

- no boxes, cards, borders around groups, radius or shadows. structure comes from spacing, alignment and one underline.
- **inputs** are prompts: a `>` marker, the value, a block cursor when focused, one underline.
- **buttons** are bracketed text: `[ fold ]`. the brackets are drawn in secondary text.
- **options** are flags: `--slug auto  --password none  --expires never`. clicking or pressing enter on a flag edits it in place; this is how options work on phones too.
- **lists** look like `ls` output: aligned columns, a tracked header in secondary text, a `>` marker on the hovered or focused row.
- **messages** are lines prefixed with `err` or `ok` (prefix in secondary text). monochrome, no red, no green.
- **confirmations** are inline: `delete /x7kq2mp? [ y ] [ n ]`.
- **transient notices** are a single status line, not toasts.
- **loading** is a braille spinner (`⠋⠙⠹⠸…`); static `…` under reduced motion.

## 6. package and tech (decided)

- public repo `0nb/sigil`, local `~/Code/sigil`.
- **Svelte 5 + Tailwind CSS v4.** chosen over React (≈45 KB framework runtime), Preact, Solid and htmx because compiled Svelte ships the least code while keeping a component workflow.
- consumers install from GitHub at a tag: `"@0nb/sigil": "github:0nb/sigil#v0.1.0"`. semver tags, `CHANGELOG.md`.
- every commit is made as `0x0nb <0x@0nb.dev>`, signed, with no AI co-author trailer.

### 6.1 my calls (reviewable)

- **no build step.** the package exports source: `.svelte` components (Svelte 5 handles type-only TypeScript natively), plain `.js` modules (JSDoc types, no `.ts` that consumers would have to compile) and CSS. consumers' Vite + Svelte toolchain compiles the components. this avoids committing `dist/` or relying on install-time `prepare` scripts, which some package managers skip for git dependencies. `svelte` peer range is `^5`; the size budget is measured in a small consumer-shaped test app inside the repo.
- **theme entry point** `@0nb/sigil/theme.css`: Tailwind v4 `@theme` tokens, base layer (ground, text, selection, focus), and grid/corner-tag utilities. consumers `@import` it and add an `@source` line pointing at sigil's components so Tailwind generates the classes they use. the README documents both lines.
- **framework-free files too.** besides `theme.css`, sigil ships `tokens.css` (plain CSS custom properties, no Tailwind needed) and the horizon shader as a plain JS module that can be served as-is. these are what hand-written pages use.
- **0nb.dev is not touched in v1.** migrating it (copy `tokens.css` + horizon module in, replace its `main.js`) is the first follow-up after sigil `v0.1.0` ships. until then the horizon exists in both repos; sigil's copy is the source of truth.
- **the horizon shader** is copied from 0nb.dev into sigil (`@0nb/sigil/horizon`, plain JS) plus a thin Svelte wrapper. lazy-loaded, paused when the tab is hidden, static sigil fallback without WebGL2 or under reduced motion — same behavior as 0nb.dev today.

### 6.2 rendering contexts (my calls)

sigil components must work in three contexts, because fold uses all three:

1. **apps that assume JavaScript** (fold's dashboard: a Svelte single-page app shipped as static files, talking to a Worker API).
2. **pages pre-rendered to static HTML at build time with zero JavaScript** (fold's visitor-facing `Locked`, `Expired`, `NotFound` pages — what people see when they open a short link; performance first, and Worker free-tier CPU is 10 ms, so nothing is rendered per request).
3. **hand-written HTML** (0nb.dev, later) via `tokens.css` and the plain horizon module.

consequences for the builder:
- input components are real form controls (`name`/`value`, `<button type="submit">`), so a page works as a plain html form without JavaScript; `Flag`'s in-place editing is an enhancement over a plain input/select.
- nothing touches `window`/`document` at import time; components render on the server (svelte/server) for build-time pre-rendering. `Horizon` loads only after mount.
- `Locked` posts a plain form; `Expired` and `NotFound` contain no script at all.

### 6.3 licence (decided)

- **all rights reserved.** the repo is public to read, but nobody may reuse it: code, the 0nb name, the sigil mark, the horizon shader.
- `LICENSE` contains exactly:

  ```
  copyright (c) 2026 the 0nb authors. all rights reserved.

  no licence is granted to use, copy, modify or distribute this software,
  except the rights github's terms of service give other github users
  for public repositories (viewing and forking on github).
  ```
- `package.json` uses `"license": "UNLICENSED"`.
- 0nb's own projects (fold and later) use sigil as the owner; no licence is needed for that.

## 7. v1 components (driven by fold)

| group | components |
|---|---|
| input | `Prompt` (text input; idle, focus, error, disabled) · `Button` (bracketed) · `Flag` (key + value, inline edit; text, toggle, choice, date) · `Check` (`[x]` / `[ ]`) · `Confirm` (inline y/n, `y`/`n` keys) |
| feedback | `Line` (err / ok / plain) · `Status` (single status line) · `Spinner` · `Empty` (empty state with one hint) |
| data | `Ls` (table: column alignment, numeric columns, hover/focus marker, row actions, stacks on phones) · `Readout` (key–value list) · `Pager` (`<- 1/12 ->`) · `Scope` (svg line chart, oscilloscope look, mono ticks) · `Spark` (inline trend line) |
| layout | `Shell` (page frame: top bar with sigil + name + nav + account, optional grid background, corner tags) · `Code` (code block with copy) |
| brand | `Sigil` (svg mark) · `Horizon` (shader) · page templates `NotFound`, `Expired`, `Locked` (password prompt) |

plus a **brand asset script** (my call): a dev-only command run from a sigil checkout, parameterised per project (name, corner tags, output folder), that renders the favicon svg, a 180px touch icon, the 1200×630 social preview and a 1024px avatar. its output is committed into the consuming project; nothing is installed in consumers. 0nb.dev's current images were made by hand once, so the script is new work. the geometries to reproduce, all on black, stroke `#e6e6e6`, round nothing except the favicon tile:

| asset | canvas | ring radius | line | stroke |
|---|---|---|---|---|
| mark (`Sigil`) | 40×40 | 11 | y 2→38 | 1.6 (scales with size) |
| favicon | 40×40, black tile rx 8 | 9 | y 5→35 | 3.2 |
| avatar | 1024×1024 | 150 | y 262→762 | 40 |
| social preview / banner | 1200×630 / 1280×400 | 44 / 33 | 144 / 108 long | 6 / 5 |

## 8. performance budget

- theme + base CSS: ≤ 8 KB gzipped in a consumer's build.
- each component: small enough that a typical page using 6–8 of them adds ≤ 10 KB gzipped of compiled JS.
- zero runtime dependencies; `svelte` and `tailwindcss` are peer dependencies.
- no web fonts, no icon fonts, no images except inline svg.
- `Horizon` is never in the main bundle; it loads only where used.

## 9. accessibility

- all readable text meets 4.5:1 on black (`#e6e6e6`, `#8a8a8a`); `#4a4a4a` is decoration only.
- every interactive element is reachable and usable by keyboard, with a visible focus state in the terminal style (`>` marker / block cursor / underline brightening). outlines are never removed without that replacement.
- prompts have real labels (visually hidden where the `>` stands in).
- motion stops under `prefers-reduced-motion`.

## 10. reference (local, in the repo)

- everything stays local and in the repo. no hosted reference, no claude.ai artifacts.
- the repo's playground doubles as the reference: one local page (run with the dev server) showing the tokens, every component with live examples and states, the terminal rules, voice and copy rules, and the assets.
- `README.md` holds the written rules (install, the two Tailwind lines, terminal rules, copy rules, budget) so they are readable without running anything.
- 0nb projects (and agents working on them) read the README, and the playground when needed, before building UI.

## 11. left to the builder

- exact token names, component props and file layout
- the form of the local playground/reference page (it is required; section 10 says what it must show)
- test approach and tooling
- how the favicon/preview/avatar scripts render (headless browser, wasm renderer, etc.), as long as it adds nothing to consumers
- lint/format tooling
