import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { snip } from '../helpers.js';
import Shell from '../../src/lib/components/Shell.svelte';
import Code from '../../src/lib/components/Code.svelte';
import Card from '../../src/lib/components/Card.svelte';

test('Shell marks the current page and hides decorative tags', () => {
  const { container } = render(Shell, {
    props: {
      name: 'fold',
      nav: [
        { href: '/', label: 'links', current: true },
        { href: '/keys', label: 'keys' },
      ],
      tags: { left: 'fold', right: 'fld.0nb.dev' },
      children: snip('<p>x</p>'),
    },
  });
  expect(screen.getByRole('link', { name: 'links' })).toHaveAttribute('aria-current', 'page');
  expect(screen.getByRole('navigation', { name: 'main' })).toBeInTheDocument();
  const shell = /** @type {HTMLElement} */ (container.querySelector('.sg-shell'));
  expect(shell.dataset.left).toBe('fold');
  expect(shell.dataset.right).toBe('fld.0nb.dev');
  expect(screen.queryByText('fld.0nb.dev')).toBeNull();
});

test('Shell is a top bar: home, tabs, account; then main', () => {
  const { container } = render(Shell, {
    props: {
      name: 'fold',
      home: '/app',
      grid: true,
      nav: [
        { href: '#/links', label: 'links', current: true },
        { href: '#/account', label: 'account' },
      ],
      account: snip('<span>u-abc234</span>'),
      children: snip('<p>body</p>'),
    },
  });
  const bar = screen.getByRole('banner');
  const home = screen.getByRole('link', { name: 'fold' });
  expect(bar).toContainElement(home);
  expect(home).toHaveAttribute('href', '/app');
  expect(home).toHaveClass('font-mono');
  expect(bar).toContainElement(screen.getByRole('navigation', { name: 'main' }));
  expect(screen.getByRole('link', { name: 'account' })).not.toHaveAttribute('aria-current');
  expect(bar).toContainElement(screen.getByText('u-abc234'));
  expect(screen.getByRole('main')).toHaveTextContent('body');
  expect(container.querySelector('[data-grid]')).not.toBeNull();
});

test('Shell puts the nav beside the name and the account at the end', () => {
  const { container } = render(Shell, {
    props: {
      name: 'fold',
      nav: [{ href: '/', label: 'links', current: true }],
      account: snip('<span>me</span>'),
      children: snip('<p>x</p>'),
    },
  });
  const header = /** @type {HTMLElement} */ (container.querySelector('header'));
  const left = /** @type {HTMLElement} */ (header.firstElementChild);
  expect(left).toContainElement(screen.getByRole('link', { name: 'fold' }));
  expect(left).toContainElement(screen.getByRole('navigation', { name: 'main' }));
  expect(header.lastElementChild).toHaveTextContent('me');
});

test('Shell without grid paints none', () => {
  const { container } = render(Shell, { props: { name: 'fold', children: snip('<p>x</p>') } });
  expect(container.querySelector('[data-grid]')).toBeNull();
  expect(screen.queryByRole('navigation')).toBeNull();
});

test('Card wraps its content, as a section when asked', () => {
  const { container } = render(Card, { props: { as: 'section', class: 'mt-4', children: snip('<p>inside</p>') } });
  const card = /** @type {HTMLElement} */ (container.querySelector('.sg-card'));
  expect(card.tagName).toBe('SECTION');
  expect(card).toHaveClass('mt-4');
  expect(card).toHaveTextContent('inside');
});

test('Card is a div by default', () => {
  const { container } = render(Card, { props: { children: snip('<p>x</p>') } });
  expect(container.querySelector('.sg-card')?.tagName).toBe('DIV');
});

test('Code copies, and reports a refused clipboard', async () => {
  const user = userEvent.setup(); // installs its own clipboard stub, so override after it
  const writeText = vi.fn().mockResolvedValueOnce().mockRejectedValueOnce(new Error('denied'));
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
  render(Code, { props: { code: 'curl -X POST https://fld.0nb.dev/api/v2/links' } });
  await user.click(screen.getByRole('button', { name: 'copy' }));
  expect(await screen.findByRole('status')).toHaveTextContent(/ok\s+copied/);
  await user.click(screen.getByRole('button', { name: 'copy' }));
  expect(await screen.findByRole('alert')).toHaveTextContent(/err\s+copy failed\. select the text and copy it\./);
});

test('Code scroll area is reachable by keyboard', () => {
  render(Code, { props: { code: 'x'.repeat(500), label: 'install' } });
  const pre = document.querySelector('pre');
  expect(pre).toHaveAttribute('tabindex', '0');
  expect(pre).toHaveClass('font-mono');
  expect(screen.getByRole('button', { name: 'copy' })).toHaveAttribute('data-size', 'small');
});
