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

<figure aria-label={label} class="text-small">
  <!-- scrolling content must be keyboard-reachable (wcag 2.1.1, axe scrollable-region-focusable) -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" class="sg-link overflow-x-auto py-2 text-fg"><code>{code}</code></pre>
  {#if mounted}
    <div class="flex flex-wrap items-baseline gap-4">
      <Button type="button" onclick={copy}>copy</Button>
      {#if result === 'ok'}
        <Line kind="ok">copied</Line>
      {:else if result === 'err'}
        <Line kind="err">copy failed. select the text and copy it.</Line>
      {/if}
    </div>
  {/if}
</figure>
