<script>
  /** @type {{ name?: string, home?: string, nav?: { href: string, label: string, current?: boolean }[], grid?: boolean, tags?: { left?: string, right?: string }, account?: import('svelte').Snippet, children: import('svelte').Snippet }} */
  let { name, home = '/', nav = [], grid, tags, account, children } = $props();
</script>

<div class="sg-shell relative min-h-dvh" data-left={tags?.left} data-right={tags?.right}>
  <div
    class="sg-gutter relative"
  >
      <header class="sg-bar">
        <a href={home} class="sg-link flex items-center gap-3 text-fg">
          <span aria-hidden="true" class="sg-sigil"></span>{name}
        </a>
        <div class="flex flex-wrap items-center gap-6">
            <nav aria-label="main" class="flex flex-wrap gap-6">
              {#each nav as item (item.href)}
                <a
                  href={item.href}
                  aria-current={item.current ? 'page' : undefined}
                  class="sg-link {item.current ? 'text-fg' : 'text-dim'}"
                  >{item.label}</a
                >
              {/each}
            </nav>
          {@render account?.()}
        </div>
      </header>
    <main>{@render children()}</main>
  </div>
</div>
