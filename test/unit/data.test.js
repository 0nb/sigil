import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import Ls from '../../src/lib/components/Ls.svelte';
import Readout from '../../src/lib/components/Readout.svelte';
import Pager from '../../src/lib/components/Pager.svelte';
import { snip } from '../helpers.js';

const user = userEvent.setup();

const rows = [
  { id: 'a', short: '/x7kq2mp', dest: 'github.com/0nb/sigil', clicks: 1284 },
  { id: 'b', short: '/q3vbn8w', dest: 'docs.google.com/' + 'x'.repeat(2000), clicks: 9 },
];
const columns = [
  { key: 'short', label: 'short' },
  { key: 'dest', label: 'destination', dim: true },
  { key: 'clicks', label: 'clicks', align: 'right' },
];

test('Ls is a captioned table', () => {
  render(Ls, { props: { caption: 'your links', columns, rows, key: (r) => r.id } });
  expect(screen.getByRole('table', { name: 'your links' })).toBeInTheDocument();
  expect(screen.getAllByRole('row')).toHaveLength(3);
});

test('Ls truncates long values and keeps them in title', () => {
  render(Ls, { props: { caption: 'l', columns, rows, key: (r) => r.id } });
  expect(screen.getByTitle(rows[1].dest)).toHaveClass('truncate');
});

test('Ls rows open with enter', async () => {
  const onrowclick = vi.fn();
  render(Ls, { props: { caption: 'l', columns, rows, key: (r) => r.id, onrowclick } });
  const row = screen.getAllByRole('row')[1];
  row.focus();
  await user.keyboard('{Enter}');
  expect(onrowclick).toHaveBeenCalledWith(rows[0]);
});

test('Readout lists key value pairs', () => {
  render(Readout, { props: { items: [{ key: 'clicks', value: 1284 }, { key: 'created', value: '3d' }] } });
  expect(screen.getByText('clicks').tagName).toBe('DT');
  expect(screen.getByText('1284').tagName).toBe('DD');
});

test.each([
  [0, 0],
  [1, 1],
])('Pager hides with %i pages', (pages, page) => {
  const { container } = render(Pager, { props: { page, pages } });
  expect(container.querySelector('nav')).toBeNull();
});

test('Pager clamps and never links past the ends', () => {
  render(Pager, { props: { page: 99, pages: 12, href: (p) => `?p=${p}` } });
  expect(screen.getByRole('navigation', { name: 'pages' })).toHaveTextContent('12/12');
  const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'));
  expect(hrefs).toEqual(['?p=11']);
});

test('row actions do not open the row', async () => {
  const onrowclick = vi.fn();
  const act = { key: 'act', label: 'actions', cell: snip('<button type="button">delete</button>') };
  render(Ls, { props: { caption: 'l', columns: [columns[0], act], rows, key: (r) => r.id, onrowclick } });
  const btn = screen.getAllByRole('button', { name: 'delete' })[0];
  const spy = vi.fn();
  btn.addEventListener('click', spy);
  btn.focus();
  await user.keyboard('{Enter}');
  expect(spy).toHaveBeenCalledTimes(1);
  await user.click(btn);
  expect(onrowclick).not.toHaveBeenCalled();
});

test('focused rows show focus in the stacked phone layout', () => {
  render(Ls, { props: { caption: 'l', columns, rows, key: (r) => r.id, onrowclick: () => {} } });
  expect(screen.getAllByRole('row')[1].className).toMatch(/max-sm:focus-visible:/);
});
