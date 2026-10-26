<script>
  /** @type {{ page: number, pages: number, onpage?: (p: number) => void, label?: string }} */
  let { page, pages, onpage, label = 'pages' } = $props();

  const at = $derived(Math.min(Math.max(1, Math.round(page) || 1), pages));
</script>

{#snippet arrow(/** @type {number} */ to, /** @type {string} */ label, /** @type {string} */ name)}
  <button type="button" aria-label={name} disabled={to < 1 || to > pages} onclick={() => onpage?.(to)} class="sg-btn" data-size="small"
    >{label}</button
  >
{/snippet}

{#if pages > 1}
  <nav aria-label={label} class="flex items-center gap-3 text-small tabular-nums">
    {@render arrow(at - 1, '←', 'previous page')}
    <span class="text-dim">{at} of {pages}</span>
    {@render arrow(at + 1, '→', 'next page')}
  </nav>
{/if}
