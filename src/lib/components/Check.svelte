<script>
  /** @type {{ name: string, label: string, checked?: boolean, value?: string, disabled?: boolean }} */
  let { name, label, checked = $bindable(false), value = 'on', disabled = false } = $props();

  const id = $props.id();
</script>

<label for={id} class="inline-flex cursor-pointer items-center gap-2 text-body">
  <input {id} type="checkbox" {name} {value} {disabled} {checked} onchange={(e) => (checked = e.currentTarget.checked)} class="peer sr-only" />
  <span
    aria-hidden="true"
    class="whitespace-pre text-dim peer-checked:text-fg peer-focus-visible:text-fg before:content-['[_]'] peer-checked:before:content-['[x]']"
  ></span>
  <span class="underline-offset-4 peer-focus-visible:underline">{label}</span>
</label>
