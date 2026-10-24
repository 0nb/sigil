import { render } from 'svelte/server';
import Sigil from '../../src/lib/components/Sigil.svelte';
import Line from '../../src/lib/components/Line.svelte';
import Status from '../../src/lib/components/Status.svelte';
import Spinner from '../../src/lib/components/Spinner.svelte';
import Empty from '../../src/lib/components/Empty.svelte';

test.each([
  [Sigil, {}],
  [Line, { kind: 'ok' }],
  [Status, { message: 'x' }],
  [Spinner, {}],
  [Empty, { title: 'no links yet' }],
])('%o renders on the server without scripts', (C, props) => {
  const { body } = render(C, { props });
  expect(body).not.toMatch(/<script/);
});

test('Spinner renders a static ellipsis on the server', () => {
  expect(render(Spinner).body).toContain('…');
});
