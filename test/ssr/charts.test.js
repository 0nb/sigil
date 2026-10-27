import { render } from 'svelte/server';
import Scope from '../../src/lib/components/Scope.svelte';
import Spark from '../../src/lib/components/Spark.svelte';

const pts = (vs) => vs.map((v, i) => ({ t: i * 864e5, v }));

test.each([[[]], [[5]], [[4, 4, 4]], [[0, 12, 3, 1284]]])('Scope renders %j without NaN', (vs) => {
  const body = render(Scope, { props: { points: pts(vs), label: 'clicks, last 7 days' } }).body;
  expect(body).not.toMatch(/NaN|Infinity/);
});

test('Scope with no points says so', () => {
  expect(render(Scope, { props: { points: [], label: 'clicks' } }).body).toContain('no data yet');
});

test('Scope describes min, max and last', () => {
  expect(render(Scope, { props: { points: pts([3, 9, 4]), label: 'clicks' } }).body).toMatch(/min 3, max 9, last 4/);
});

test.each([[[]], [[2]], [[1, 1]], [[1, 5, 2]]])('Spark renders %j without NaN', (values) => {
  expect(render(Spark, { props: { values } }).body).not.toMatch(/NaN|Infinity/);
});

test('Scope keeps its outer x labels inside the frame', () => {
  const body = render(Scope, { props: { points: pts([3, 9, 4, 12, 30]), label: 'clicks' } }).body;
  const xs = [...body.matchAll(/data-align="(\w+)"[^>]*>\d\d-\d\d</g)].map((m) => m[1]);
  expect(xs[0]).toBe('start');
  expect(xs[xs.length - 1]).toBe('end');
});

test('Scope labels keep their size at any width', () => {
  const body = render(Scope, { props: { points: pts([3, 9, 4]), label: 'clicks' } }).body;
  expect(body).not.toMatch(/<text/);
  expect(body).toMatch(/preserveAspectRatio="none"/);
  expect(body).toMatch(/class="[^"]*text-tag/);
});

test.each([[[5]], [[0, 12, 3, 1284]]])('Scope fills under %j only when asked, without NaN', (vs) => {
  const filled = (/** @type {string} */ body) => (body.match(/class="fill-fg"/g) ?? []).length;
  const plain = render(Scope, { props: { points: pts(vs), label: 'c' } }).body;
  const area = render(Scope, { props: { points: pts(vs), label: 'c', area: true } }).body;
  expect(filled(plain)).toBe(0);
  expect(filled(area)).toBe(1);
  expect(area).not.toMatch(/NaN|Infinity/);
});
