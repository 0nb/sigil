# changelog

## [0.3.0](https://github.com/0nb/sigil/compare/v0.2.0...v0.3.0) (2026-10-25)


### features

* button pressed state ([38533a2](https://github.com/0nb/sigil/commit/38533a2b2fb5304b75deb39ffe5698833d3da6a1))
* pager takes a label ([8dd5b39](https://github.com/0nb/sigil/commit/8dd5b39a9ccf95b4812380782b511c90b229ecf5))


### fixes

* code scroll area is keyboard reachable ([8dd5b39](https://github.com/0nb/sigil/commit/8dd5b39a9ccf95b4812380782b511c90b229ecf5))
* ls cells rendered through a snippet get no raw-value tooltip ([38533a2](https://github.com/0nb/sigil/commit/38533a2b2fb5304b75deb39ffe5698833d3da6a1))
* visitor pages state their message as h1 ([8dd5b39](https://github.com/0nb/sigil/commit/8dd5b39a9ccf95b4812380782b511c90b229ecf5))

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
