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

test('Pager with href renders real links', () => {
  expect(render(Pager, { props: { page: 2, pages: 3, href: (p) => `?p=${p}` } }).body).toMatch(
    /href="\?p=1"[\s\S]*href="\?p=3"/,
  );
});
