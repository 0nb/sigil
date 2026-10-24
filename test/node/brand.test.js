import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { brandSvgs } from '../../scripts/brand-svgs.js';

const s = brandSvgs({ left: 'fold', right: 'fld.0nb.dev' });
const pngSize = (/** @type {string} */ path) => {
  const b = readFileSync(path);
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
};

test('favicon geometry', () => {
  expect(s.favicon).toMatch(/rx="8"/);
  expect(s.favicon).toMatch(/r="9"/);
  expect(s.favicon).toMatch(/d="M20 5V35"/);
  expect(s.favicon).toMatch(/stroke-width="3.2"/);
});

test('avatar geometry', () => {
  expect(s.avatar).toMatch(/r="150"/);
  expect(s.avatar).toMatch(/d="M512 262V762"/);
  expect(s.avatar).toMatch(/stroke-width="40"/);
});

test('og carries the project tags', () => {
  expect(s.og).toContain('>fold<');
  expect(s.og).toContain('>fld.0nb.dev<');
  expect(s.og).toMatch(/r="44"/);
});

test('tags are escaped', () => {
  expect(brandSvgs({ left: '<x>', right: '&' }).og).toContain('&lt;x&gt;');
});

test('cli renders pngs at the right sizes', () => {
  const out = mkdtempSync(join(tmpdir(), 'brand-'));
  execFileSync('node', ['scripts/brand.js', '--left', 'fold', '--right', 'fld.0nb.dev', '--out', out]);
  expect(existsSync(join(out, 'favicon.svg'))).toBe(true);
  expect(existsSync(join(out, 'banner.svg'))).toBe(true);
  expect(pngSize(join(out, 'og.png'))).toEqual([1200, 630]);
  expect(pngSize(join(out, 'apple-touch-icon.png'))).toEqual([180, 180]);
  expect(pngSize(join(out, 'avatar.png'))).toEqual([1024, 1024]);
}, 30_000);
