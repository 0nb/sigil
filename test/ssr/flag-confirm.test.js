import { render } from 'svelte/server';
import Flag from '../../src/lib/components/Flag.svelte';
import Confirm from '../../src/lib/components/Confirm.svelte';

test('flags and confirm work as plain forms', () => {
  expect(render(Flag, { props: { name: 'slug', flag: 'slug' } }).body).toMatch(/<input[^>]*name="slug"/);
  expect(render(Flag, { props: { name: 'd', flag: 'd', kind: 'choice', options: ['a'] } }).body).toMatch(
    /<select[^>]*name="d"/,
  );
  const c = render(Confirm, { props: { question: 'delete?', name: 'confirm' } }).body;
  expect(c.match(/type="submit"/g)).toHaveLength(2);
  expect(c.match(/name="confirm"/g)).toHaveLength(2);
  expect(c).toContain('value="y"');
  expect(c).toContain('value="n"');
});
