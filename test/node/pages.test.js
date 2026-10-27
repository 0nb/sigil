import { build } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { render } from 'svelte/server';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import NotFound from '../../src/lib/pages/NotFound.svelte';
import Expired from '../../src/lib/pages/Expired.svelte';
import Locked from '../../src/lib/pages/Locked.svelte';

// a consumer serves each visitor page as one static document: server-rendered html, the pages css inline
const root = resolve('test/pages');
const outDir = join(root, '.out');
let css = '';

beforeAll(async () => {
  await build({ root, configFile: false, logLevel: 'silent', plugins: [tailwindcss()], build: { outDir, emptyOutDir: true } });
  const dir = join(outDir, 'assets');
  css = readdirSync(dir).filter((f) => f.endsWith('.css')).map((f) => readFileSync(join(dir, f), 'utf8')).join('');
}, 60_000);

const doc = (/** @type {string} */ body) =>
  '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width, initial-scale=1">' +
  '<meta name="theme-color" content="#000000">' +
  `<title>fold</title><style>${css}</style></head><body>${body}</body></html>`;

const tags = { left: 'fold' };
test.each([
  ['not found', NotFound, { home: '/', tags }],
  ['expired', Expired, { home: '/', tags }],
  ['locked', Locked, { tags }],
  ['locked, with the longest error', Locked, { tags, error: 'too many tries. wait a minute.' }],
])('%s page is one static document of at most 10 240 bytes', (_, Page, props) => {
  const html = doc(render(/** @type {any} */ (Page), { props }).body);
  console.log(`page: ${_} ${Buffer.byteLength(html)} B`);
  expect(html).not.toMatch(/<script/i);
  expect(Buffer.byteLength(html)).toBeLessThanOrEqual(10_240);
});

test('the pages css styles the field and the button', () => {
  expect(css).toContain('.sg-field-box');
  expect(css).toContain('.sg-btn');
});

test('the pages css carries none of the dashboard and homepage pieces', () => {
  for (const piece of ['sg-flap', 'sg-tiles', 'sg-bars', 'sg-chip', 'sg-choice']) expect(css).not.toContain(piece);
});
