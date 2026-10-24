<script>
  import Shell from '../components/Shell.svelte';
  import Sigil from '../components/Sigil.svelte';
  import Prompt from '../components/Prompt.svelte';
  import Button from '../components/Button.svelte';

  /** @type {{ action: string, error?: string, tags?: { left?: string, right?: string } }} */
  let { action, error, tags } = $props();
</script>

<Shell bar={false} grid {tags}>
  <section class="flex min-h-dvh flex-col items-center justify-center gap-6">
    <Sigil size={64} class="text-dim" />
    <p class="text-body">this link is locked.</p>
    <form method="post" {action} class="flex w-full max-w-sm items-start gap-4">
      <Prompt type="password" name="password" label="password" autofocus {error} />
      <Button class="mt-2.5">open</Button>
    </form>
  </section>
</Shell>
