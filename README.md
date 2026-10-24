# sigil

the 0nb design system. svelte 5 + tailwind v4.

## install

```json
"@0nb/sigil": "github:0nb/sigil#v0.1.0"
```

```css
@import "tailwindcss";
@import "@0nb/sigil/theme.css";
@source "../node_modules/@0nb/sigil/src/lib";
```

```svelte
<script>
  import { Shell, Prompt, Button } from '@0nb/sigil';
</script>

<Shell name="fold">
  <form>
    <Prompt name="url" label="destination url" />
    <Button>fold</Button>
  </form>
</Shell>
```

plain html: `@0nb/sigil/tokens.css`.

## rules

- black. mono. lowercase.
- no boxes, radius, shadows, color.
- inputs `>` · buttons `[ x ]` · options `--flag` · lists like `ls` · messages `err` / `ok`.

## budget

css ≤ 8 kb · js ≤ 10 kb per page, gzip. no fonts. no deps.

## dev

```
pnpm dev      # reference
pnpm test
pnpm brand --left fold --right fld.0nb.dev --out ../fold/public
```

## licence

all rights reserved. this repository is not licensed for reuse. see `LICENSE`.
