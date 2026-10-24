<script>
  import Sigil from '../components/Sigil.svelte';

  /** @type {{ home?: string, tags?: { left?: string, right?: string } }} */
  let { home = '/', tags = {} } = $props();
</script>

<div class='sg-shell min-h-dvh' data-left={tags.left} data-right={tags.right ?? '404'}><div class='sg-gutter' data-grid>
  <section class="flex min-h-dvh flex-col items-center justify-center gap-6 text-center">
    <Sigil size={64} class="text-dim" />
    <p class="text-body">nothing here.</p>
    <a href={home} class="group sg-btn"><span class="sg-btn-label">home</span></a>
  </section>
</div></div>
