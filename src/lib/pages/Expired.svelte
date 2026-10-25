<script>
  import Sigil from '../components/Sigil.svelte';

  /** @type {{ home?: string, tags?: { left?: string, right?: string } }} */
  let { home = '/', tags } = $props();
</script>

<div class='sg-shell min-h-dvh' data-left={tags?.left} data-right={tags?.right}><div class='sg-gutter' data-grid>
  <section class="flex min-h-dvh flex-col items-center justify-center gap-6 text-center">
    <Sigil size={64} class="text-dim" />
    <h1 class="text-body font-normal">this link has expired.</h1>
    <a href={home} class="group sg-btn"><span class="sg-btn-label">home</span></a>
  </section>
</div></div>
