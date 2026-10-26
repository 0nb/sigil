import { render } from 'svelte/server';
import Confirm from '../../src/lib/components/Confirm.svelte';

test('confirm works as a plain form', () => {
  const c = render(Confirm, { props: { question: 'delete?', name: 'confirm' } }).body;
  expect(c.match(/type="submit"/g)).toHaveLength(2);
  expect(c.match(/name="confirm"/g)).toHaveLength(2);
  expect(c).toContain('value="y"');
  expect(c).toContain('value="n"');
});
