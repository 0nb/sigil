<script>
  /** @type {{ page: number, pages: number, href?: (p: number) => string, onpage?: (p: number) => void }} */
  let { page, pages, href, onpage } = $props();

  const current = $derived(Math.min(Math.max(1, Math.round(page) || 1), pages));
  const arrows = $derived([
    { label: '<-', name: 'previous page', to: current - 1, ok: current > 1 },
    { label: '->', name: 'next page', to: current + 1, ok: current < pages },
  ]);
  const link = 'text-dim outline-none hover:text-fg focus-visible:text-fg focus-visible:underline';
</script>

{#snippet arrow(/** @type {{ label: string, name: string, to: number, ok: boolean }} */ a)}
  {#if !a.ok}
    <span aria-disabled="true" class="text-ghost">{a.label}</span>
  {:else if href}
    <a href={href(a.to)} aria-label={a.name} class={link}>{a.label}</a>
  {:else}
    <button type="button" aria-label={a.name} onclick={() => onpage?.(a.to)} class="{link} cursor-pointer"
      >{a.label}</button
    >
  {/if}
{/snippet}

{#if pages > 1}
  <nav aria-label="pages" class="flex items-baseline gap-4 text-small tabular-nums">
    {@render arrow(arrows[0])}
    <span class="text-fg">{current}/{pages}</span>
    {@render arrow(arrows[1])}
  </nav>
{/if}
