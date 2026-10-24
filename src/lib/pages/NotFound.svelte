<script>
  import Shell from '../components/Shell.svelte';
  import Sigil from '../components/Sigil.svelte';
  import Button from '../components/Button.svelte';

  /** @type {{ home?: string, tags?: { left?: string, right?: string } }} */
  let { home = '/', tags = {} } = $props();
</script>

<Shell bar={false} grid tags={{ left: tags.left, right: tags.right ?? '404' }}>
  <section class="flex min-h-dvh flex-col items-center justify-center gap-6 text-center">
    <Sigil size={64} class="text-dim" />
    <p class="text-body">nothing here.</p>
    <Button href={home}>home</Button>
  </section>
</Shell>
