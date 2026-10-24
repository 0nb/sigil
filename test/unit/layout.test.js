import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { snip } from '../helpers.js';
import Shell from '../../src/lib/components/Shell.svelte';
import Code from '../../src/lib/components/Code.svelte';

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
  const tags = container.querySelectorAll('.corner-tag');
  expect(tags).toHaveLength(2);
  tags.forEach((t) => expect(t).toHaveAttribute('aria-hidden', 'true'));
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
