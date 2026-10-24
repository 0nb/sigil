import { readFileSync } from 'node:fs';
import * as lib from '../../src/lib/index.js';

const app = readFileSync('playground/App.svelte', 'utf8');

test('the reference shows every exported component', () => {
  for (const name of Object.keys(lib)) expect(app).toMatch(new RegExp(`<${name}[\\s>/]`));
});

test('the readme documents install and the two tailwind lines', () => {
  const md = readFileSync('README.md', 'utf8');
  expect(md).toContain('"@0nb/sigil": "github:0nb/sigil#v0.1.0"');
  expect(md).toContain('@import "@0nb/sigil/theme.css";');
  expect(md).toContain('@source "../node_modules/@0nb/sigil/src/lib";');
  expect(md).toMatch(/not licensed for reuse|all rights reserved/);
});
