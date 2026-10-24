import { render } from 'svelte/server';
import Ls from '../../src/lib/components/Ls.svelte';
import Pager from '../../src/lib/components/Pager.svelte';

test('Ls escapes untrusted text and renders without scripts', () => {
  const body = render(Ls, {
    props: {
      caption: 'l',
      columns: [{ key: 'd', label: 'd' }],
      rows: [{ id: '1', d: '<img src=x onerror=alert(1)>' }],
      key: (r) => r.id,
    },
  }).body;
  expect(body).toContain('&lt;img');
  expect(body).not.toMatch(/<script/);
});

test('Pager renders disabled ends on the server', () => {
  const body = render(Pager, { props: { page: 1, pages: 3 } }).body;
  expect(body.match(/<button[^>]*disabled/g)).toHaveLength(1);
});
