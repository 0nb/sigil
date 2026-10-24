<script>
  import Sigil from './Sigil.svelte';

  /** @type {{ name?: string, home?: string, nav?: { href: string, label: string, current?: boolean }[], bar?: boolean, grid?: boolean, tags?: { left?: string, right?: string }, account?: import('svelte').Snippet, children: import('svelte').Snippet }} */
  let { name, home = '/', nav = [], bar = true, grid = false, tags, account, children } = $props();
</script>

<div class="relative min-h-dvh">
  {#if grid}<div aria-hidden="true" class="pointer-events-none fixed inset-0 bg-grid"></div>{/if}
  <div
    class="relative pr-[max(16px,env(safe-area-inset-right,0px))] pl-[max(16px,env(safe-area-inset-left,0px))] sm:pr-[max(32px,env(safe-area-inset-right,0px))] sm:pl-[max(32px,env(safe-area-inset-left,0px))]"
  >
    {#if bar}
      <header class="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-6 text-label tracking-tag">
        <a href={home} class="flex items-center gap-3 text-fg outline-none focus-visible:underline">
          <Sigil size={18} weight={2.4} />{name}
        </a>
        <div class="flex flex-wrap items-center gap-6">
          {#if nav.length}
            <nav aria-label="main" class="flex flex-wrap gap-6">
              {#each nav as item (item.href)}
                <a
                  href={item.href}
                  aria-current={item.current ? 'page' : undefined}
                  class="outline-none hover:text-fg focus-visible:underline {item.current ? 'text-fg' : 'text-dim'}"
                  >{item.label}</a
                >
              {/each}
            </nav>
          {/if}
          {@render account?.()}
        </div>
      </header>
    {/if}
    <main>{@render children()}</main>
  </div>
  {#if tags?.left}<span aria-hidden="true" class="corner-tag bottom-8 left-8 max-sm:bottom-6 max-sm:left-5"
      >{tags.left}</span
    >{/if}
  {#if tags?.right}<span aria-hidden="true" class="corner-tag right-8 bottom-8 max-sm:right-5 max-sm:bottom-6"
      >{tags.right}</span
    >{/if}
</div>
