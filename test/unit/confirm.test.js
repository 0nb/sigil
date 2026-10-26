import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import Confirm from '../../src/lib/components/Confirm.svelte';

const user = userEvent.setup();

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

test('Confirm ignores keys pressed with modifiers', async () => {
  const onyes = vi.fn();
  render(Confirm, { props: { question: 'delete /x7kq2mp?', onyes } });
  await user.keyboard('{Control>}y{/Control}');
  await user.keyboard('{Meta>}y{/Meta}');
  await user.keyboard('{Alt>}y{/Alt}');
  expect(onyes).not.toHaveBeenCalled();
});
