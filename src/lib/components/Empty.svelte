<script>
  /** @type {{ title: string, hint?: string }} */
  let { title, hint } = $props();
</script>

<div class="flex flex-col gap-1 text-body">
  <p class="text-title font-semibold text-fg">{title}</p>
  {#if hint}<p class="text-dim">{hint}</p>{/if}
</div>
