<script>
  /** @type {{ label: string, before: import('svelte').Snippet, after: import('svelte').Snippet, height?: number }} */
  let { label, before, after, height = 150 } = $props();
</script>

<!-- css only, so it plays on a page with no js: "before" folds away like a flap and leaves "after".
     with reduced motion only "after" shows, still -->
<figure aria-label={label} class="sg-flap" style="height: {height}px">
  <div class="sg-flap-after">{@render after()}</div>
  <div aria-hidden="true" class="sg-flap-before">{@render before()}</div>
</figure>
