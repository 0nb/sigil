# changelog

## [0.7.0](https://github.com/0nb/sigil/compare/v0.6.0...v0.7.0) (2026-10-28)


### features

* sg-prose for reading pages ([#13](https://github.com/0nb/sigil/issues/13)) ([b7a3fde](https://github.com/0nb/sigil/commit/b7a3fde7de2f6d2a7f890d4a99faa7b3625f19ff))

## [0.6.0](https://github.com/0nb/sigil/compare/v0.5.0...v0.6.0) (2026-10-27)


### features

* chip, choice, tiles, bars, flap; nav beside the name ([#11](https://github.com/0nb/sigil/issues/11)) ([d8e3fd4](https://github.com/0nb/sigil/commit/d8e3fd46aa6e857eb4be65cf213d6aef3ed9c705))

## [0.5.0](https://github.com/0nb/sigil/compare/v0.4.0...v0.5.0) (2026-10-26)


### ⚠ BREAKING CHANGES

* friendly look — sans text, button variants, Field replaces Prompt and Flag, worded Confirm, Card, top-bar Shell, restyled components and visitor pages

### features

* friendly look — sans text, button variants, Field replaces Prompt and Flag, worded Confirm, Card, top-bar Shell, restyled components and visitor pages ([be1d5ef](https://github.com/0nb/sigil/commit/be1d5eff772f26a3f2ceb049e5a62fda0fef2294))
* pages.css for static visitor pages ([be1d5ef](https://github.com/0nb/sigil/commit/be1d5eff772f26a3f2ceb049e5a62fda0fef2294))
* red accent token ([#8](https://github.com/0nb/sigil/issues/8)) ([1234fa5](https://github.com/0nb/sigil/commit/1234fa5f1522c823a7e82a267623d244af7d0d9d))


### fixes

* disabled buttons look disabled, invalid fields show focus, the grid sits behind content ([be1d5ef](https://github.com/0nb/sigil/commit/be1d5eff772f26a3f2ceb049e5a62fda0fef2294))

## [0.4.0](https://github.com/0nb/sigil/compare/v0.3.0...v0.4.0) (2026-10-25)


### features

* locked action is optional; without it the form posts to the current url ([5421385](https://github.com/0nb/sigil/commit/54213856087ef2f3555d631e101c53c9e8f34147))


### fixes

* visitor pages put their content in a main landmark named after their heading ([5421385](https://github.com/0nb/sigil/commit/54213856087ef2f3555d631e101c53c9e8f34147))

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
