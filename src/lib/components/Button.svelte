<script>
  /** @type {{ type?: 'submit' | 'button', name?: string, value?: string, href?: string, disabled?: boolean, onclick?: (e: MouseEvent) => void, children?: import('svelte').Snippet, class?: string }} */
  let {
    type = 'submit',
    name,
    value,
    href,
    disabled = false,
    onclick,
    children,
    class: klass = '',
  } = $props();

  const cls =
    'group inline-flex items-center tracking-btn text-fg outline-none cursor-pointer disabled:cursor-default disabled:text-dim';
  const bracket = 'whitespace-pre text-dim group-hover:text-fg group-focus-visible:text-fg';
</script>

{#snippet inner()}
  <span aria-hidden="true" class={bracket}>{"[ "}</span><span
    class="underline-offset-4 group-hover:underline group-focus-visible:underline group-disabled:no-underline"
    >{@render children?.()}</span
  ><span aria-hidden="true" class={bracket}>{" ]"}</span>
{/snippet}

{#if href}
  <a {href} class="{cls} {klass}">{@render inner()}</a>
{:else}
  <button {type} {name} {value} {disabled} {onclick} class="{cls} {klass}">{@render inner()}</button>
{/if}
