<script>
  import Sigil from '../components/Sigil.svelte';

  /** @type {{ home?: string, tags?: { left?: string, right?: string } }} */
  let { home = '/', tags = {} } = $props();
</script>

<div class='sg-shell min-h-dvh' data-left={tags.left} data-right={tags.right ?? '404'}><div class='sg-gutter' data-grid>
  <main aria-labelledby="sg-page-title" class="flex min-h-dvh flex-col items-center justify-center gap-6 text-center">
    <Sigil size={64} class="text-dim" />
    <h1 id="sg-page-title" class="text-body font-normal">nothing here.</h1>
    <a href={home} class="group sg-btn"><span class="sg-btn-label">home</span></a>
  </main>
</div></div>
