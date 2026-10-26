import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { snip } from '../helpers.js';
import Field from '../../src/lib/components/Field.svelte';
import * as sigil from '../../src/lib/index.js';
import Button from '../../src/lib/components/Button.svelte';
import Check from '../../src/lib/components/Check.svelte';

const user = userEvent.setup();

test('Field has a visible label that names its input', async () => {
  render(Field, { props: { name: 'url', label: 'paste a long link' } });
  const input = screen.getByLabelText('paste a long link');
  expect(input).toHaveAttribute('name', 'url');
  expect(input).toHaveAttribute('type', 'text');
  expect(screen.getByText('paste a long link')).not.toHaveClass('sr-only');
  await user.type(input, 'fld.0nb.dev');
  expect(input).toHaveValue('fld.0nb.dev');
});

test('Field hint and error describe the input; the error is announced', () => {
  render(Field, {
    props: { name: 'slug', label: 'custom ending', hint: 'letters, numbers and dashes', error: 'that ending is taken. try another.' },
  });
  const input = screen.getByLabelText('custom ending');
  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(input).toHaveAccessibleDescription('letters, numbers and dashes that ending is taken. try another.');
  expect(screen.getByRole('alert')).toHaveTextContent('that ending is taken. try another.');
});

test('Field with only a hint is described and valid', () => {
  render(Field, { props: { name: 'note', label: 'note', hint: 'only you see it' } });
  const input = screen.getByLabelText('note');
  expect(input).not.toHaveAttribute('aria-invalid');
  expect(input).toHaveAccessibleDescription('only you see it');
  expect(screen.queryByRole('alert')).toBeNull();
});

test('Field prefix comes before the input, in mono', () => {
  render(Field, { props: { name: 'slug', label: 'custom ending', prefix: 'fld.0nb.dev/', mono: true } });
  const prefix = screen.getByText('fld.0nb.dev/');
  const input = screen.getByLabelText('custom ending');
  expect(prefix.compareDocumentPosition(input) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(prefix).toHaveClass('font-mono');
  expect(input).toHaveClass('font-mono');
});

test('Field value follows its prop', async () => {
  const { rerender } = render(Field, { props: { name: 'url', label: 'u', value: 'a' } });
  expect(screen.getByLabelText('u')).toHaveValue('a');
  await rerender({ value: 'b' });
  expect(screen.getByLabelText('u')).toHaveValue('b');
});

test('Field with a hidden label keeps its accessible name', () => {
  render(Field, { props: { name: 'q', label: 'search your links', type: 'search', labelHidden: true } });
  expect(screen.getByRole('searchbox', { name: 'search your links' })).toBeInTheDocument();
  expect(screen.getByText('search your links')).toHaveClass('sr-only');
});

test('Field passes type and autocomplete through, and keeps long values inside', () => {
  render(Field, { props: { name: 'password', label: 'password', type: 'password', autocomplete: 'off', value: 'a'.repeat(2000) } });
  const input = screen.getByLabelText('password');
  expect(input).toHaveAttribute('type', 'password');
  expect(input).toHaveAttribute('autocomplete', 'off');
  expect(input).toHaveClass('min-w-0');
});

test('Prompt and Flag are gone', () => {
  expect(sigil).toHaveProperty('Field');
  expect(sigil).not.toHaveProperty('Prompt');
  expect(sigil).not.toHaveProperty('Flag');
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
  expect(box).not.toHaveClass('sr-only');
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

test('Button label names a symbol-only button', () => {
  render(Button, { props: { type: 'button', variant: 'ghost', label: 'more for fld.0nb.dev/x7kq2mp', children: snip('<span>⋯</span>') } });
  expect(screen.getByRole('button', { name: 'more for fld.0nb.dev/x7kq2mp' })).toBeInTheDocument();
});
