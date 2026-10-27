<script>
  /** @type {{ items: { key: string, value: string | number, hint?: string, dim?: boolean }[] }} */
  let { items } = $props();
</script>

<!-- a row of big numbers; a short last row grows to the edge instead of leaving a gap -->
<dl class="sg-tiles">
  {#each items as item (item.key)}
    <div>
      <dt class="text-label text-dim">{item.key}</dt>
      <dd class="text-[32px] leading-none font-semibold tracking-[-0.03em] tabular-nums {item.dim ? 'text-dim' : 'text-fg'}">
        {item.value}
      </dd>
      {#if item.hint}<dd class="text-[12px] text-dim">{item.hint}</dd>{/if}
    </div>
  {/each}
</dl>
