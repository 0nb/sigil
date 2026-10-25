import { render } from 'svelte/server';
import Prompt from '../../src/lib/components/Prompt.svelte';
import Button from '../../src/lib/components/Button.svelte';
import Check from '../../src/lib/components/Check.svelte';

test('controls render native form elements on the server', () => {
  expect(render(Prompt, { props: { name: 'url', label: 'u' } }).body).toMatch(/<input[^>]*name="url"/);
  expect(render(Button, { props: {} }).body).toMatch(/<button[^>]*type="submit"/);
  const check = render(Check, { props: { name: 'p', label: 'p', checked: true } }).body;
  expect(check).toContain('type="checkbox"');
  expect(check).toMatch(/\schecked(=""|\s|>)/);
});

test('pressed renders on the server', () => {
  expect(render(Button, { props: { pressed: false } }).body).toContain('aria-pressed="false"');
});
