import { render, screen, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import Ls from '../../src/lib/components/Ls.svelte';
import Readout from '../../src/lib/components/Readout.svelte';
import Pager from '../../src/lib/components/Pager.svelte';
import Chip from '../../src/lib/components/Chip.svelte';
import Tiles from '../../src/lib/components/Tiles.svelte';
import Bars from '../../src/lib/components/Bars.svelte';
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
  expect(screen.getByRole('navigation', { name: 'pages' })).toHaveTextContent('12 of 12');
  expect(screen.getByRole('button', { name: 'next page' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'next page' })).toHaveClass('sg-btn');
  expect(screen.getByRole('button', { name: 'next page' })).toHaveAttribute('data-size', 'small');
  await user.click(screen.getByRole('button', { name: 'previous page' }));
  expect(onpage).toHaveBeenCalledWith(11);
});
test('rows are not focus traps; links in cells are the way in', () => {
  const link = { key: 'short', label: 'short', cell: snip('<a href="/x7kq2mp">/x7kq2mp</a>') };
  render(Ls, { props: { caption: 'l', columns: [link], rows, key: (r) => r.id } });
  expect(screen.getAllByRole('row')[1]).not.toHaveAttribute('tabindex');
  expect(screen.getAllByRole('link', { name: '/x7kq2mp' })).toHaveLength(2);
});

test('Pager takes a label so two pagers stay distinct', () => {
  render(Pager, { props: { page: 1, pages: 3, label: 'links pages' } });
  expect(screen.getByRole('navigation', { name: 'links pages' })).toBeInTheDocument();
});

test('Chip shows its text, keeps it in title, and truncates', () => {
  const long = 'note '.repeat(60).trim();
  render(Chip, { props: { text: long } });
  const chip = screen.getByTitle(long);
  expect(chip).toHaveClass('sg-chip');
  expect(chip).toHaveTextContent(long);
  expect(chip.querySelector('svg')).toBeNull();
});

test('Chip with lock shows a decorative lock', () => {
  render(Chip, { props: { text: 'password', lock: true } });
  expect(screen.getByTitle('password').querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
});

test('Tiles are a description list, each value right after its name', () => {
  render(Tiles, {
    props: {
      items: [
        { key: 'people', value: 128, hint: 'the last 7 days' },
        { key: 'link previews', value: 37, dim: true },
      ],
    },
  });
  const dt = screen.getByText('people');
  expect(dt.tagName).toBe('DT');
  expect(dt.nextElementSibling).toHaveTextContent('128');
  expect(screen.getByText('37')).toHaveClass('text-dim');
  expect(screen.getByText('128')).not.toHaveClass('text-dim');
  expect(screen.getByText('the last 7 days').tagName).toBe('DD');
});

test('Bars rank names with numbers and a share-of-total bar', () => {
  const { container } = render(Bars, {
    props: { label: 'countries', items: [{ key: 'belgium', n: 3 }, { key: 'france', n: 1 }] },
  });
  const list = screen.getByRole('list', { name: 'countries' });
  expect(within(list).getAllByRole('listitem')[0]).toHaveTextContent(/belgium\s*3/);
  const fills = [...container.querySelectorAll('[aria-hidden="true"] i')].map((i) => /** @type {HTMLElement} */ (i).style.width);
  expect(fills).toEqual(['75%', '25%']);
});

test('Bars in percent', () => {
  render(Bars, { props: { label: 'c', percent: true, items: [{ key: 'a', n: 1 }, { key: 'b', n: 2 }] } });
  expect(screen.getByText('67%')).toBeInTheDocument();
  expect(screen.getByText('33%')).toBeInTheDocument();
});

test('Bars with nothing render nothing; all zeros never say NaN', () => {
  expect(render(Bars, { props: { label: 'c', items: [] } }).container.querySelector('figure')).toBeNull();
  const { container } = render(Bars, { props: { label: 'z', percent: true, items: [{ key: 'a', n: 0 }] } });
  expect(container.innerHTML).not.toContain('NaN');
});
