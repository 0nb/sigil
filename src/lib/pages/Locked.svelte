<script>
  import Sigil from '../components/Sigil.svelte';
  import Field from '../components/Field.svelte';
  import Button from '../components/Button.svelte';

  /** @type {{ action?: string, error?: string, tags?: { left?: string, right?: string } }} */
  let { action, error, tags } = $props();
</script>

<div class='sg-shell min-h-dvh' data-left={tags?.left} data-right={tags?.right}><div class='sg-gutter' data-grid>
  <main aria-labelledby="sg-page-title" class="flex min-h-dvh flex-col items-center justify-center gap-6">
    <Sigil size={64} class="text-dim" />
    <h1 id="sg-page-title" class="text-body font-normal">this link is locked.</h1>
    <form method="post" {action} class="flex w-full max-w-sm items-start gap-4">
      <Field type="password" name="password" label="password" autofocus {error} />
      <Button class="mt-2.5">open</Button>
    </form>
  </main>
</div></div>
