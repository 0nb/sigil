<script>
  /** @type {{ items: { key: string, value: string | number }[] }} */
  let { items } = $props();
</script>

<dl class="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-1 text-small">
  {#each items as item (item.key)}
    <dt class="text-label text-dim">{item.key}</dt>
    <dd class="truncate text-body text-fg tabular-nums" title={String(item.value)}>{item.value}</dd>
  {/each}
</dl>
