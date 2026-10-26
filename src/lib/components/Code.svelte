<script>
  import Button from './Button.svelte';
  import Line from './Line.svelte';

  /** @type {{ code: string, label?: string }} */
  let { code, label = 'code' } = $props();

  let mounted = $state(false);
  /** @type {'ok' | 'err' | null} */
  let result = $state(null);

  $effect(() => {
    mounted = true;
  });

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      result = 'ok';
      setTimeout(() => {
        if (result === 'ok') result = null;
      }, 2000);
    } catch {
      result = 'err';
    }
  }
</script>

<figure aria-label={label} class="flex flex-col gap-2 text-small">
  <!-- scrolling content must be keyboard-reachable (wcag 2.1.1, axe scrollable-region-focusable) -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" class="overflow-x-auto rounded-ctl border border-rule bg-card px-3.5 py-3 font-mono text-fg outline-hidden focus-visible:border-fg"><code>{code}</code></pre>
  {#if mounted}
    <div class="flex flex-wrap items-center gap-3">
      <Button type="button" size="small" onclick={copy}>copy</Button>
      {#if result === 'ok'}
        <Line kind="ok">copied</Line>
      {:else if result === 'err'}
        <Line kind="err">copy failed. select the text and copy it.</Line>
      {/if}
    </div>
  {/if}
</figure>
