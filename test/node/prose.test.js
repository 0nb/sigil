import { build } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

// reading pages (terms, privacy) are plain markup under one class
const root = resolve('test/prose');
const outDir = join(root, '.out');
let css = '';

beforeAll(async () => {
  await build({ root, configFile: false, logLevel: 'silent', plugins: [tailwindcss()], build: { outDir, emptyOutDir: true } });
  const dir = join(outDir, 'assets');
  css = readdirSync(dir).filter((f) => f.endsWith('.css')).map((f) => readFileSync(join(dir, f), 'utf8')).join('');
}, 60_000);

const rule = (/** @type {string} */ selector) => css.match(new RegExp(`${selector}\\{([^}]*)\\}`))?.[1] ?? '';

test('links in running text are underlined, so they never rely on colour alone', () => {
  expect(rule('\\.sg-prose a')).toContain('text-decoration-line:underline');
});

test('list items carry a dim dash', () => {
  expect(rule('\\.sg-prose li:{1,2}before')).toMatch(/content:"–"/);
});

test('blocks are spaced, headings more', () => {
  expect(rule('\\.sg-prose>\\*\\+\\*')).toContain('margin-top');
  expect(rule('\\.sg-prose>h2')).toContain('margin-top');
});
