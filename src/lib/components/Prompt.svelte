<script>
  import Line from './Line.svelte';

  /** @type {{ name: string, label: string, value?: string, type?: 'text' | 'url' | 'password' | 'search', placeholder?: string, error?: string, disabled?: boolean, required?: boolean, autofocus?: boolean }} */
  let {
    name,
    label,
    value = $bindable(''),
    type = 'text',
    placeholder,
    error,
    disabled = false,
    required = false,
    autofocus = false,
  } = $props();

  const id = $props.id();
</script>

<div class="w-full">
  <label for={id} class="sr-only">{label}</label>
  <div
    class="flex items-center gap-3 border-b py-2 focus-within:border-fg {error
      ? 'border-fg'
      : 'border-rule'}"
  >
    <span aria-hidden="true" class="text-dim">&gt;</span>
    <!-- svelte-ignore a11y_autofocus -->
    <input
      {id}
      {name}
      {type}
      {placeholder}
      {disabled}
      {required}
      {autofocus}
      bind:value
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={error ? `${id}-err` : undefined}
      class="min-w-0 w-full flex-1 bg-transparent text-input text-fg outline-none placeholder:text-dim disabled:text-dim [caret-color:var(--sg-fg)] [caret-shape:block]"
    />
  </div>
  {#if error}<Line kind="err" id="{id}-err">{error}</Line>{/if}
</div>
