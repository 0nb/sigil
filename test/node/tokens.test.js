import { readFileSync } from 'node:fs';

const css = readFileSync('src/lib/tokens.css', 'utf8');
const token = (n) => css.match(new RegExp(`--sg-${n}:\\s*([^;]+);`))[1].trim();
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const contrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

test('exact token values', () => {
  expect(token('ground')).toBe('#000000');
  expect(token('fg')).toBe('#e6e6e6');
  expect(token('dim')).toBe('#8a8a8a');
  expect(token('ghost')).toBe('#4a4a4a');
  expect(token('rule')).toBe('#2a2a2a');
  expect(token('grid')).toBe('rgb(255 255 255 / 0.07)');
  expect(token('mono')).toBe('ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace');
  expect(['tag', 'label', 'small', 'body', 'input', 'display'].map(token)).toEqual(['10px', '11px', '12px', '13px', '15px', '28px']);
});

test('readable text passes AA on ground, ghost does not', () => {
  expect(contrast('#e6e6e6', '#000000')).toBeGreaterThanOrEqual(4.5);
  expect(contrast('#8a8a8a', '#000000')).toBeGreaterThanOrEqual(4.5);
  expect(contrast('#4a4a4a', '#000000')).toBeLessThan(4.5);
});

test('dark only', () => {
  expect(css).toMatch(/color-scheme:\s*dark/);
  expect(css).not.toMatch(/prefers-color-scheme/);
});
