<script>
  /** @type {{ title: string, hint?: string }} */
  let { title, hint } = $props();
</script>

<div class="text-body">
  <p class="text-fg">{title}</p>
  {#if hint}<p class="text-dim">{hint}</p>{/if}
</div>
