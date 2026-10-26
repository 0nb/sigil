<script>
  /** @type {{ name: string, label: string, value?: string, type?: 'text' | 'url' | 'password' | 'date' | 'search', placeholder?: string, hint?: string, error?: string, prefix?: string, mono?: boolean, required?: boolean, disabled?: boolean, autofocus?: boolean, autocomplete?: import('svelte/elements').FullAutoFill, labelHidden?: boolean }} */
  let {
    name,
    label,
    value = $bindable(''),
    type = 'text',
    placeholder,
    hint,
    error,
    prefix,
    mono,
    required,
    disabled,
    autofocus,
    autocomplete,
    labelHidden,
  } = $props();

  // ids are fixed at mount; a renamed field keeps its first id
  // svelte-ignore state_referenced_locally
  const id = `sg-${name}`;
</script>

<div class="sg-field">
  <label for={id} class={labelHidden ? 'sr-only' : 'text-label text-dim'}>{label}</label>
  <div class="sg-field-box" data-invalid={error ? '' : undefined}>
    {#if prefix}<span class="font-mono text-dim">{prefix}</span>{/if}
    <!-- svelte-ignore a11y_autofocus -->
    <input
      {id}
      {name}
      {type}
      {placeholder}
      {required}
      {disabled}
      {autofocus}
      {autocomplete}
      {value}
      oninput={(e) => (value = e.currentTarget.value)}
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={hint || error ? `${hint ? `${id}-hint` : ''} ${error ? `${id}-err` : ''}`.trim() : undefined}
      class="sg-field-in min-w-0 {mono ? 'font-mono' : ''}"
    />
  </div>
  {#if hint}<p id="{id}-hint" class="text-label text-dim">{hint}</p>{/if}
  {#if error}<p id="{id}-err" role="alert" class="text-small text-fg">{error}</p>{/if}
</div>
