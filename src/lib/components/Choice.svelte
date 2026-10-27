<script>
  /** @type {{ label: string, options: { value: string, label: string }[], value?: string, onchange?: (value: string) => void }} */
  let { label, options, value = $bindable(), onchange } = $props();

  function pick(/** @type {string} */ next) {
    value = next;
    onchange?.(next);
  }
</script>

<div role="group" aria-label={label} class="sg-choice">
  {#each options as option (option.value)}
    <button type="button" aria-pressed={value === option.value} onclick={() => pick(option.value)}>{option.label}</button>
  {/each}
</div>
