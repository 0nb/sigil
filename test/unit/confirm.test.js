import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import Confirm from '../../src/lib/components/Confirm.svelte';

const user = userEvent.setup();

test('Confirm starts on keep; enter answers keep', async () => {
  const onyes = vi.fn();
  const onno = vi.fn();
  render(Confirm, { props: { question: 'delete fld.0nb.dev/x7kq2mp?', onyes, onno } });
  expect(screen.getByRole('group', { name: 'delete fld.0nb.dev/x7kq2mp?' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'keep' })).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(onno).toHaveBeenCalledOnce();
  expect(onyes).not.toHaveBeenCalled();
});

test('Confirm escape answers keep', async () => {
  const onno = vi.fn();
  render(Confirm, { props: { question: 'delete?', onno } });
  await user.keyboard('{Escape}');
  expect(onno).toHaveBeenCalledOnce();
});

test('Confirm delete is a click away, never a letter', async () => {
  const onyes = vi.fn();
  render(Confirm, { props: { question: 'delete?', onyes } });
  await user.keyboard('yn');
  expect(onyes).not.toHaveBeenCalled();
  await user.click(screen.getByRole('button', { name: 'delete' }));
  expect(onyes).toHaveBeenCalledOnce();
});

test('Confirm takes its own words', () => {
  render(Confirm, { props: { question: 'sign out everywhere?', yes: 'sign out', no: 'cancel' } });
  expect(screen.getByRole('button', { name: 'sign out' })).toHaveAttribute('data-variant', 'primary');
  expect(screen.getByRole('button', { name: 'cancel' })).toHaveFocus();
});
