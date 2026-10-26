<script>
  import { Shell, Field, Button, Line, Ls, Pager } from '../../src/lib/index.js';

  // tailwind sees these and must generate nothing for them
  const bait = 'rounded-lg shadow-md bg-red-500 text-xl';

  const rows = [
    { id: 'a', short: '/x7kq2mp', dest: 'github.com/0nb/sigil', clicks: 1284 },
    { id: 'b', short: '/horizon', dest: '0nb.dev', clicks: 412 },
    { id: 'c', short: '/q3vbn8w', dest: 'docs.google.com/document/d/1x', clicks: 9 },
  ];
  const columns = [
    { key: 'short', label: 'short' },
    { key: 'dest', label: 'destination', dim: true },
    { key: 'clicks', label: 'clicks', align: /** @type {'right'} */ ('right') },
  ];
  let page = $state(1);
</script>

<Shell name="fold" nav={[{ href: '/', label: 'links', current: true }, { href: '/keys', label: 'keys' }]} data-bait={bait}>
  <form class="flex flex-col gap-3 py-6">
    <div class="flex items-center gap-4">
      <Field name="url" label="paste a long link" type="url" mono error="that doesn't look like a link." />
      <Button variant="primary">fold it</Button>
    </div>
    <div class="grid gap-4 sm:grid-cols-2">
      <Field name="slug" label="custom ending" prefix="fld.0nb.dev/" mono hint="letters, numbers and dashes" />
      <Field name="password" label="password" type="password" placeholder="none" />
      <Field name="expires" label="stop working on" type="date" />
    </div>
    <Line kind="ok">ready</Line>
  </form>
  <Ls caption="your links" {columns} {rows} key={(r) => r.id} />
  <Pager {page} pages={4} onpage={(p) => (page = p)} />
</Shell>
