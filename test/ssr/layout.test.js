import { render } from 'svelte/server';
import { snip } from '../helpers.js';
import Shell from '../../src/lib/components/Shell.svelte';
import Code from '../../src/lib/components/Code.svelte';

test('Code renders no copy button without JS', () => {
  const body = render(Code, { props: { code: 'x' } }).body;
  expect(body).toContain('<pre');
  expect(body).not.toMatch(/<button/);
});

test('Shell renders without the bar for visitor pages', () => {
  expect(render(Shell, { props: { bar: false, children: snip('<p>x</p>') } }).body).not.toMatch(/<header/);
});
