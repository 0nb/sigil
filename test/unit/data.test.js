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

test('Pager clamps and never pages past the ends', async () => {
  const onpage = vi.fn();
  render(Pager, { props: { page: 99, pages: 12, onpage } });
  expect(screen.getByRole('navigation', { name: 'pages' })).toHaveTextContent('12/12');
  expect(screen.getByRole('button', { name: 'next page' })).toBeDisabled();
  await user.click(screen.getByRole('button', { name: 'previous page' }));
  expect(onpage).toHaveBeenCalledWith(11);
});
test('rows are not focus traps; links in cells are the way in', () => {
  const link = { key: 'short', label: 'short', cell: snip('<a href="/x7kq2mp">/x7kq2mp</a>') };
  render(Ls, { props: { caption: 'l', columns: [link], rows, key: (r) => r.id } });
  expect(screen.getAllByRole('row')[1]).not.toHaveAttribute('tabindex');
  expect(screen.getAllByRole('link', { name: '/x7kq2mp' })).toHaveLength(2);
});
