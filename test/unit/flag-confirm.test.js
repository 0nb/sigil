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

test('toggle flag toggles with enter and with space', async () => {
  render(Flag, { props: { name: 'private', flag: 'private', kind: 'toggle' } });
  const box = screen.getByLabelText(/--private/);
  box.focus();
  await user.keyboard('{Enter}');
  expect(box).toBeChecked();
  await user.keyboard(' ');
  expect(box).not.toBeChecked();
});

test('choice flag is a select with the given options', () => {
  render(Flag, {
    props: { name: 'domain', flag: 'domain', kind: 'choice', options: ['fld.0nb.dev', '0nb.dev'], value: 'fld.0nb.dev' },
  });
  expect(screen.getByLabelText(/--domain/)).toHaveDisplayValue('fld.0nb.dev');
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
