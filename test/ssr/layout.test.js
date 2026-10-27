import { render } from 'svelte/server';
import { snip } from '../helpers.js';
import Shell from '../../src/lib/components/Shell.svelte';
import Code from '../../src/lib/components/Code.svelte';
import Flap from '../../src/lib/components/Flap.svelte';
import NotFound from '../../src/lib/pages/NotFound.svelte';

test('Code renders no copy button without JS', () => {
  const body = render(Code, { props: { code: 'x' } }).body;
  expect(body).toContain('<pre');
  expect(body).not.toMatch(/<button/);
});

test('visitor pages render no app bar', () => {
  expect(render(NotFound).body).not.toMatch(/<header/);
});

test('Flap renders both panels without js, the long one hidden from screen readers', () => {
  const body = render(Flap, { props: { label: 'example', before: snip('<p>long</p>'), after: snip('<p>short</p>') } }).body;
  expect(body).toMatch(/<figure[^>]*aria-label="example"/);
  expect(body).toMatch(/<div[^>]*(aria-hidden="true"[^>]*class="sg-flap-before"|class="sg-flap-before"[^>]*aria-hidden="true")[^>]*><p>long<\/p>/);
  expect(body).toMatch(/class="sg-flap-after"[^>]*><p>short<\/p>/);
  expect(body).not.toMatch(/<script/);
});
