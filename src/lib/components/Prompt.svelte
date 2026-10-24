<script>
  import Line from './Line.svelte';

  /** @type {{ name: string, label: string, value?: string, type?: 'text' | 'url' | 'password' | 'search', placeholder?: string, error?: string, disabled?: boolean, required?: boolean, autofocus?: boolean }} */
  let {
    name,
    label,
    value = $bindable(''),
    type,
    placeholder,
    error,
    disabled,
    required,
    autofocus,
  } = $props();

  // ids are fixed at mount; a renamed field keeps its first id
  // svelte-ignore state_referenced_locally
  const id = `sg-${name}`;
</script>

<div class="w-full">
  <label for={id} class="sr-only">{label}</label>
  <div
    class="sg-prompt {error ? 'border-fg' : ''}"
  >
    <!-- svelte-ignore a11y_autofocus -->
    <input
      {id}
      {name}
      {type}
      {placeholder}
      {disabled}
      {required}
      {autofocus}
      {value}
      oninput={(e) => (value = e.currentTarget.value)}
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={error ? `${id}-err` : undefined}
      class="sg-prompt-in min-w-0 w-full"
    />
  </div>
  {#if error}<Line kind="err" id="{id}-err">{error}</Line>{/if}
</div>
