<script>
  import Button from './Button.svelte';

  /** @type {{ question: string, onyes?: () => void, onno?: () => void, name?: string }} */
  let { question, onyes, onno, name } = $props();

  /** @type {HTMLElement | undefined} */
  let root = $state();
  const buttons = () => /** @type {NodeListOf<HTMLButtonElement>} */ (root?.querySelectorAll('button') ?? []);

  $effect(() => {
    buttons()[1]?.focus();
  });

  /** @param {KeyboardEvent} e */
  function onkeydown(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const [yes, no] = buttons();
    if (e.key === 'y') {
      e.preventDefault();
      yes?.click();
    } else if (e.key === 'n' || e.key === 'Escape') {
      e.preventDefault();
      no?.click();
    }
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
  bind:this={root}
  role="group"
  aria-label={question}
  {onkeydown}
  class="inline-flex flex-wrap items-baseline gap-3 text-body"
>
  <span>{question}</span>
  <Button type={name ? 'submit' : 'button'} {name} value="y" onclick={() => onyes?.()}>y</Button>
  <Button type={name ? 'submit' : 'button'} {name} value="n" onclick={() => onno?.()}>n</Button>
</div>
