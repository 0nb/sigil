import { render } from 'svelte/server';
import Field from '../../src/lib/components/Field.svelte';
import Button from '../../src/lib/components/Button.svelte';
import Check from '../../src/lib/components/Check.svelte';
import Choice from '../../src/lib/components/Choice.svelte';

test('controls render native form elements on the server', () => {
  const field = render(Field, { props: { name: 'url', label: 'u', type: 'date' } }).body;
  expect(field).toMatch(/<label[^>]*for="sg-url"/);
  expect(field).toMatch(/<input[^>]*name="url"/);
  expect(field).toMatch(/<input[^>]*type="date"/);
  expect(render(Button, { props: {} }).body).toMatch(/<button[^>]*type="submit"/);
  const check = render(Check, { props: { name: 'p', label: 'p', checked: true } }).body;
  expect(check).toContain('type="checkbox"');
  expect(check).toMatch(/\schecked(=""|\s|>)/);
});

test('pressed renders on the server', () => {
  expect(render(Button, { props: { pressed: false } }).body).toContain('aria-pressed="false"');
});

test('Choice renders its pressed option on the server', () => {
  const options = [{ value: '24h', label: '24h' }, { value: '7d', label: '7 days' }];
  const body = render(Choice, { props: { label: 'p', options, value: '24h' } }).body;
  expect(body.match(/aria-pressed="true"/g)).toHaveLength(1);
  expect(body).toMatch(/role="group"[^>]*aria-label="p"|aria-label="p"[^>]*role="group"/);
});
