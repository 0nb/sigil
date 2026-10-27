<script>
  /** @type {{ name?: string, home?: string, nav?: { href: string, label: string, current?: boolean }[], grid?: boolean, tags?: { left?: string, right?: string }, account?: import('svelte').Snippet, children: import('svelte').Snippet }} */
  let { name, home = '/', nav = [], grid, tags, account, children } = $props();
</script>

<div class="sg-shell relative min-h-dvh" data-left={tags?.left} data-right={tags?.right}>
  <header class="sg-top sg-gutter">
    <!-- the nav sits beside the name; the account, when there is one, at the far end -->
    <div class="flex min-w-0 flex-wrap items-center gap-x-7 gap-y-1">
      <a href={home} class="sg-link flex items-center gap-2.5 font-mono text-fg">
        <span aria-hidden="true" class="sg-sigil"></span>{name}
      </a>
      {#if nav.length}
        <nav aria-label="main" class="flex flex-wrap gap-x-6">
          {#each nav as item (item.href)}
            <a href={item.href} aria-current={item.current ? 'page' : undefined} class="sg-tab">{item.label}</a>
          {/each}
        </nav>
      {/if}
    </div>
    {@render account?.()}
  </header>
  <main class="sg-gutter relative py-8" data-grid={grid ? '' : undefined}>{@render children()}</main>
</div>
