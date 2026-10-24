<script>
  import Line from './Line.svelte';

  /** @type {{ message?: string, kind?: 'err' | 'ok' | 'plain', timeout?: number }} */
  let { message = '', kind = 'plain', timeout = 4000 } = $props();

  let cleared = $state(false);
  const shown = $derived(cleared ? '' : message);

  $effect(() => {
    message;
    cleared = false;
    if (!message || !timeout) return;
    const t = setTimeout(() => (cleared = true), timeout);
    return () => clearTimeout(t);
  });
</script>

<div role="status" aria-live="polite" class="min-h-[1.55em]">
  {#if shown}<Line {kind} announce={false}>{shown}</Line>{/if}
</div>
