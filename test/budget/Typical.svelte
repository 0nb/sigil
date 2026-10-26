<script>
  import { Shell, Prompt, Button, Flag, Line, Ls, Pager } from '../../src/lib/index.js';

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
      <Prompt name="url" label="destination url" error="not a valid url." />
      <Button>fold</Button>
    </div>
    <div class="flex flex-wrap gap-6">
      <Flag name="slug" flag="slug" empty="auto" />
      <Flag name="password" flag="password" kind="password" />
      <Flag name="expires" flag="expires" kind="date" empty="never" />
    </div>
    <Line kind="ok">ready</Line>
  </form>
  <Ls caption="your links" {columns} {rows} key={(r) => r.id} />
  <Pager {page} pages={4} onpage={(p) => (page = p)} />
</Shell>
