import { render } from 'svelte/server';
import { snip } from '../helpers.js';
import Shell from '../../src/lib/components/Shell.svelte';
import Code from '../../src/lib/components/Code.svelte';
import NotFound from '../../src/lib/pages/NotFound.svelte';

test('Code renders no copy button without JS', () => {
  const body = render(Code, { props: { code: 'x' } }).body;
  expect(body).toContain('<pre');
  expect(body).not.toMatch(/<button/);
});

test('visitor pages render no app bar', () => {
  expect(render(NotFound).body).not.toMatch(/<header/);
});
