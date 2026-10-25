import { render } from 'svelte/server';
import NotFound from '../../src/lib/pages/NotFound.svelte';
import Expired from '../../src/lib/pages/Expired.svelte';
import Locked from '../../src/lib/pages/Locked.svelte';
import Horizon from '../../src/lib/components/Horizon.svelte';

test.each([NotFound, Expired])('%o has no script and links home', (Page) => {
  const body = render(Page, { props: { home: 'https://fld.0nb.dev' } }).body;
  expect(body).not.toMatch(/<script/);
  expect(body).toMatch(/href="https:\/\/fld\.0nb\.dev"/);
});

test('Expired says so', () => {
  expect(render(Expired).body).toContain('this link has expired.');
});

test('Locked posts a password form that works without JS', () => {
  const body = render(Locked, { props: { action: '/q3vbn8w', error: 'wrong password.' } }).body;
  const form = body.match(/<form[^>]*>/)[0];
  expect(form).toContain('method="post"');
  expect(form).toContain('action="/q3vbn8w"');
  const input = body.match(/<input[^>]*type="password"[^>]*>/)[0];
  expect(input).toContain('name="password"');
  expect(body).toMatch(/<button[^>]*type="submit"/);
  expect(body).toContain('wrong password.');
});

test('Horizon server render is just the fallback', () => {
  expect(render(Horizon).body).toMatch(/<circle/);
});

test.each([
  [NotFound, {}, 'nothing here.'],
  [Expired, {}, 'this link has expired.'],
  [Locked, { action: '/x' }, 'this link is locked.'],
])('%o states its message as the page heading', (Page, props, text) => {
  expect(render(Page, { props }).body).toMatch(new RegExp(`<h1[^>]*>${text.replace('.', '\\.')}</h1>`));
});

test.each([
  [NotFound, {}],
  [Expired, {}],
  [Locked, {}],
])('%o puts its content in a main landmark', (Page, props) => {
  expect(render(Page, { props }).body.match(/<main[\s>]/g)).toHaveLength(1);
});

test('Locked without an action posts back to the current url', () => {
  const form = render(Locked, { props: {} }).body.match(/<form[^>]*>/)[0];
  expect(form).not.toContain('action=');
});

test.each([
  [NotFound, {}],
  [Expired, {}],
  [Locked, {}],
])('%o names its main landmark after its heading', (Page, props) => {
  const body = render(Page, { props }).body;
  const id = body.match(/<h1[^>]*id="([^"]+)"/)?.[1];
  expect(id).toBeTruthy();
  expect(body).toMatch(new RegExp(`<main[^>]*aria-labelledby="${id}"`));
});
