import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import Flag from '../../src/lib/components/Flag.svelte';
import Confirm from '../../src/lib/components/Confirm.svelte';

const user = userEvent.setup();

test('text flag edits in place and is named', async () => {
  render(Flag, { props: { name: 'slug', flag: 'slug', empty: 'auto' } });
  const input = screen.getByLabelText(/--slug/);
  expect(input).toHaveAttribute('placeholder', 'auto');
  await user.click(input);
  await user.keyboard('horizon');
  expect(input).toHaveValue('horizon');
  expect(input).toHaveAttribute('name', 'slug');
});

test('password flag hides what is typed', () => {
  render(Flag, { props: { name: 'password', flag: 'password', kind: 'password' } });
  expect(screen.getByLabelText(/--password/)).toHaveAttribute('type', 'password');
});

test('date flag submits its value', () => {
  render(Flag, { props: { name: 'expires', flag: 'expires', kind: 'date', value: '2026-11-01' } });
  expect(screen.getByLabelText(/--expires/)).toHaveValue('2026-11-01');
});

test('Confirm focuses n and answers by key', async () => {
  const onyes = vi.fn();
  const onno = vi.fn();
  render(Confirm, { props: { question: 'delete /x7kq2mp?', onyes, onno } });
  expect(screen.getByRole('button', { name: 'n' })).toHaveFocus();
  await user.keyboard('y');
  expect(onyes).toHaveBeenCalledOnce();
  await user.keyboard('{Escape}');
  expect(onno).toHaveBeenCalledOnce();
});

test('text flag with a long value stays narrow', () => {
  render(Flag, { props: { name: 'slug', flag: 'slug', value: 'x'.repeat(60) } });
  const input = screen.getByLabelText(/--slug/);
  expect(Number(input.getAttribute('size'))).toBeLessThanOrEqual(24);
  expect(input).toHaveClass('min-w-0');
});

test('Confirm ignores keys pressed with modifiers', async () => {
  const onyes = vi.fn();
  render(Confirm, { props: { question: 'delete /x7kq2mp?', onyes } });
  await user.keyboard('{Control>}y{/Control}');
  await user.keyboard('{Meta>}y{/Meta}');
  await user.keyboard('{Alt>}y{/Alt}');
  expect(onyes).not.toHaveBeenCalled();
});
