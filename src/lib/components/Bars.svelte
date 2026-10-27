<script>
  /** @type {{ label: string, items: { key: string, n: number }[], percent?: boolean }} */
  let { label, items, percent } = $props();

  const total = $derived(items.reduce((sum, item) => sum + item.n, 0));
  // each bar is its share of the whole list; nothing counted means empty bars, never NaN
  const share = (/** @type {number} */ n) => (total ? Math.round((n / total) * 1000) / 10 : 0);
</script>

{#if items.length}
  <figure class="sg-bars">
    <figcaption class="mb-3.5 text-small text-dim">{label}</figcaption>
    <ul aria-label={label}>
      <!-- unkeyed: names can repeat (several unknown countries) and the list is display-only -->
      {#each items as item}
        <li>
          <span title={item.key}>{item.key}</span>
          <span>{percent ? `${Math.round(share(item.n))}%` : item.n}</span>
          <span aria-hidden="true"><i style="width: {share(item.n)}%"></i></span>
        </li>
      {/each}
    </ul>
  </figure>
{/if}
