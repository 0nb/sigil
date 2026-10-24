<script>
  import Sigil from './Sigil.svelte';

  /** @type {HTMLCanvasElement | undefined} */
  let canvas = $state();
  let live = $state(false);

  $effect(() => {
    /** @type {{ destroy(): void } | null} */
    let h = null;
    let gone = false;
    import('../horizon/horizon.js').then(({ mount }) => {
      if (gone || !canvas) return;
      h = mount(canvas, { onready: () => (live = true), onlost: () => (live = false) });
    });
    return () => {
      gone = true;
      h?.destroy();
    };
  });
</script>

<div aria-hidden="true" class="pointer-events-none fixed inset-0">
  <canvas
    bind:this={canvas}
    class="absolute inset-0 h-full w-full transition-opacity duration-[1200ms] {live ? 'opacity-100' : 'opacity-0'}"
  ></canvas>
  {#if !live}
    <div class="absolute inset-0 grid place-items-center text-fg"><Sigil size={120} /></div>
  {/if}
</div>
