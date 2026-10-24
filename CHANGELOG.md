# changelog

## 0.2.0

- strict budget: a typical page adds ≤ 10 kb gzip over an empty svelte app (+10.2 kb)
- flag: kinds text, password, date (toggle, choice removed)
- button: buttons only; links use `class="group sg-btn"`
- pager: buttons with `onpage` only
- ls: rows not clickable; put links in cells
- shell: no `bar` prop; visitor pages draw their own frame
- status: `show(text, kind)`
- types: index.d.ts, horizon.d.ts
- theme: `sg-*` utilities; grid utility renamed `sg-grid`

## 0.1.0

- tokens.css, theme.css (tailwind v4)
- sigil, line, status, spinner, empty
- prompt, button, check, flag, confirm
- ls, readout, pager, scope, spark
- shell, code, horizon
- pages: notfound, expired, locked
- brand script: favicon, touch icon, avatar, og, banner
