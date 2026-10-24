// dev-only: node scripts/brand.js --left fold --right fld.0nb.dev --out ../fold/public
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { Resvg } from '@resvg/resvg-js';
import { brandSvgs } from './brand-svgs.js';

const { values } = parseArgs({
  options: {
    left: { type: 'string', default: '0nb' },
    right: { type: 'string', default: 'est. 2023' },
    out: { type: 'string', default: 'brand' },
  },
});

const out = /** @type {string} */ (values.out);
const s = brandSvgs({ left: /** @type {string} */ (values.left), right: /** @type {string} */ (values.right) });

const png = (/** @type {string} */ svg, /** @type {number} */ width) =>
  new Resvg(svg, { fitTo: { mode: 'width', value: width }, font: { loadSystemFonts: true } }).render().asPng();

mkdirSync(out, { recursive: true });
/** @type {[string, string | Buffer][]} */
const files = [
  ['favicon.svg', s.favicon],
  ['banner.svg', s.banner],
  ['apple-touch-icon.png', png(s.avatar, 180)],
  ['avatar.png', png(s.avatar, 1024)],
  ['og.png', png(s.og, 1200)],
];
for (const [name, data] of files) {
  writeFileSync(join(out, name), data);
  console.log(join(out, name));
}
