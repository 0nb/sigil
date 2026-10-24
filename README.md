# sigil

```json
"@0nb/sigil": "github:0nb/sigil#v0.1.0"
```

```css
@import "@0nb/sigil/theme.css";
@source "../node_modules/@0nb/sigil/src/lib";
```

hand-written html: `@0nb/sigil/tokens.css`.

## rules

- black. mono. lowercase.
- no boxes, radius, shadows, color.
- inputs `>` · buttons `[ x ]` · options `--flag` · lists like `ls` · messages `err` / `ok`.

## budget

css ≤ 8 kb · js ≤ 10 kb per page, gzip. no fonts. no deps.

## dev

```
pnpm dev     # reference
pnpm brand --left fold --right fld.0nb.dev --out ../fold/public
```

all rights reserved.
