import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { snip } from '../helpers.js';
import Prompt from '../../src/lib/components/Prompt.svelte';
import Button from '../../src/lib/components/Button.svelte';
import Check from '../../src/lib/components/Check.svelte';

const user = userEvent.setup();

test('Prompt is a labelled named input', async () => {
  render(Prompt, { props: { name: 'url', label: 'destination url' } });
  const input = screen.getByLabelText('destination url');
  expect(input).toHaveAttribute('name', 'url');
  await user.type(input, 'fld.0nb.dev');
  expect(input).toHaveValue('fld.0nb.dev');
});

test('Prompt error is announced and linked', () => {
  render(Prompt, {
    props: { name: 'url', label: 'destination url', error: 'not a valid url. check the dot before "com".' },
  });
  const input = screen.getByLabelText('destination url');
  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(input).toHaveAccessibleDescription(/not a valid url/);
  expect(screen.getByRole('alert')).toHaveTextContent(/^err/);
});

test('Prompt keeps a 2,000-char value inside its width', () => {
  render(Prompt, { props: { name: 'url', label: 'u', value: 'a'.repeat(2000) } });
  expect(screen.getByLabelText('u')).toHaveClass('min-w-0', 'w-full');
});

test('Button is a secondary submit button by default', () => {
  render(Button, { props: { children: snip('<span>fold</span>') } });
  const b = screen.getByRole('button', { name: 'fold' });
  expect(b).toHaveAttribute('type', 'submit');
  expect(b.textContent.trim()).toBe('fold');
  expect(b).toHaveClass('sg-btn');
  expect(b).toHaveAttribute('data-variant', 'secondary');
  expect(b).not.toHaveAttribute('data-size');
});

test('Button variants and small size', async () => {
  const { rerender } = render(Button, { props: { variant: 'primary', children: snip('<span>fold</span>') } });
  const b = screen.getByRole('button', { name: 'fold' });
  expect(b).toHaveAttribute('data-variant', 'primary');
  await rerender({ variant: 'ghost', size: 'small' });
  expect(b).toHaveAttribute('data-variant', 'ghost');
  expect(b).toHaveAttribute('data-size', 'small');
});

test('Button accepts an extra class', () => {
  render(Button, { props: { class: 'mt-2', children: snip('<span>open</span>') } });
  expect(screen.getByRole('button', { name: 'open' })).toHaveClass('sg-btn', 'mt-2');
});

test('Check toggles with space and submits its value', async () => {
  render(Check, { props: { name: 'private', label: 'private' } });
  const box = screen.getByRole('checkbox', { name: 'private' });
  box.focus();
  await user.keyboard(' ');
  expect(box).toBeChecked();
  expect(box).toHaveAttribute('name', 'private');
});

test('Button pressed is a toggle', async () => {
  const { rerender } = render(Button, { props: { type: 'button', pressed: true, children: snip('<span>7d</span>') } });
  expect(screen.getByRole('button', { name: '7d' })).toHaveAttribute('aria-pressed', 'true');
  await rerender({ pressed: false });
  expect(screen.getByRole('button', { name: '7d' })).toHaveAttribute('aria-pressed', 'false');
});

test('Button without pressed is a plain button', () => {
  render(Button, { props: { children: snip('<span>fold</span>') } });
  expect(screen.getByRole('button', { name: 'fold' })).not.toHaveAttribute('aria-pressed');
});
