import { render, screen } from '@testing-library/svelte';
import { snip } from '../helpers.js';
import Sigil from '../../src/lib/components/Sigil.svelte';
import Line from '../../src/lib/components/Line.svelte';
import Status from '../../src/lib/components/Status.svelte';
import Spinner from '../../src/lib/components/Spinner.svelte';
import Empty from '../../src/lib/components/Empty.svelte';

afterEach(() => {
  vi.useRealTimers();
  globalThis.__reduceMotion = false;
});

test('Sigil is decorative without a title', () => {
  const { container } = render(Sigil);
  const svg = container.querySelector('svg');
  expect(svg).toHaveAttribute('aria-hidden', 'true');
  expect(svg.querySelector('circle')).toHaveAttribute('r', '11');
  expect(svg.querySelector('path')).toHaveAttribute('d', 'M20 2V38');
});

test('Sigil with a title is an image', () => {
  render(Sigil, { props: { title: '0nb' } });
  expect(screen.getByRole('img', { name: '0nb' })).toBeInTheDocument();
});

test('Line err is an alert with an err prefix', () => {
  render(Line, { props: { kind: 'err', children: snip('<span>not a valid url.</span>') } });
  expect(screen.getByRole('alert')).toHaveTextContent(/^err\s+not a valid url\.$/);
});

test('Status clears after timeout', async () => {
  vi.useFakeTimers();
  render(Status, { props: { message: 'copied', kind: 'ok', timeout: 1000 } });
  expect(screen.getByRole('status')).toHaveTextContent('copied');
  await vi.advanceTimersByTimeAsync(1000);
  expect(screen.getByRole('status')).not.toHaveTextContent('copied');
});

test('Spinner animates, and is static under reduced motion', async () => {
  vi.useFakeTimers();
  globalThis.__reduceMotion = false;
  const a = render(Spinner);
  await vi.advanceTimersByTimeAsync(80);
  expect(a.container.textContent).toMatch(/[⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏]/);
  a.unmount();
  globalThis.__reduceMotion = true;
  const b = render(Spinner);
  await vi.advanceTimersByTimeAsync(400);
  expect(b.container.textContent).toContain('…');
  expect(screen.getByText('loading')).toHaveClass('sr-only');
});

test('Empty shows title and hint', () => {
  render(Empty, { props: { title: 'no links yet', hint: 'paste a url above and press enter.' } });
  expect(screen.getByText('no links yet')).toBeInTheDocument();
  expect(screen.getByText('paste a url above and press enter.')).toHaveClass('text-dim');
});

test('Status shows the same message again through show()', async () => {
  vi.useFakeTimers();
  const { component } = render(Status, { props: { timeout: 1000 } });
  component.show('copied', 'ok');
  await vi.advanceTimersByTimeAsync(0);
  expect(screen.getByRole('status')).toHaveTextContent('copied');
  await vi.advanceTimersByTimeAsync(1000);
  expect(screen.getByRole('status')).not.toHaveTextContent('copied');
  component.show('copied', 'ok');
  await vi.advanceTimersByTimeAsync(0);
  expect(screen.getByRole('status')).toHaveTextContent('copied');
});

test('Line wraps long unbroken text', () => {
  render(Line, { props: { kind: 'err', children: snip(`<span>${'a'.repeat(2000)}</span>`) } });
  expect(screen.getByRole('alert')).toHaveClass('[overflow-wrap:anywhere]');
});
