<script>
  import Button from './Button.svelte';

  /** @type {{ question: string, yes?: string, no?: string, onyes?: () => void, onno?: () => void, name?: string }} */
  let { question, yes = 'delete', no = 'keep', onyes, onno, name } = $props();

  /** @type {HTMLElement | undefined} */
  let root = $state();
  const safe = () => /** @type {HTMLButtonElement | undefined} */ (root?.querySelectorAll('button')[1]);

  // the safe answer has focus, so enter never deletes by accident
  $effect(() => {
    safe()?.focus();
  });
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
  bind:this={root}
  role="group"
  aria-label={question}
  onkeydown={(e) => e.key === 'Escape' && (e.preventDefault(), safe()?.click())}
  class="flex flex-wrap items-center gap-3"
>
  <span class="mr-2">{question}</span>
  <Button variant="primary" type={name ? 'submit' : 'button'} {name} value="y" onclick={() => onyes?.()}>{yes}</Button>
  <Button type={name ? 'submit' : 'button'} {name} value="n" onclick={() => onno?.()}>{no}</Button>
</div>
