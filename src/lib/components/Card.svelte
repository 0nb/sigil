<script>
  /** @type {{ as?: 'div' | 'section', class?: string, children: import('svelte').Snippet }} */
  let { as = 'div', class: klass = '', children } = $props();
</script>

<!-- other elements (a form, a link) take the same look with class="sg-card" -->
{#if as === 'section'}
  <section class="sg-card {klass}">{@render children()}</section>
{:else}
  <div class="sg-card {klass}">{@render children()}</div>
{/if}
