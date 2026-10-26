<script>
  /** @type {{ name: string, label: string, checked?: boolean, value?: string, disabled?: boolean }} */
  let { name, label, checked = $bindable(false), value = 'on', disabled = false } = $props();

  const id = $props.id();
</script>

<label for={id} class="inline-flex min-h-11 cursor-pointer items-center gap-2.5 text-body">
  <input {id} type="checkbox" {name} {value} {disabled} {checked} onchange={(e) => (checked = e.currentTarget.checked)} class="size-[18px] cursor-pointer accent-fg" />
  {label}
</label>
