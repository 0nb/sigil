<script>
  /** @type {{ name: string, flag: string, kind?: 'text' | 'password' | 'date', value?: string, empty?: string }} */
  let { name, flag, kind = 'text', value = $bindable(''), empty = 'none' } = $props();
</script>

<label class="sg-flag">
  <span class="text-dim">--{flag}</span>
  <span class="sg-flag-date" data-empty={kind === 'date' && !value ? empty : undefined}>
    <input
      type={kind}
      {name}
      {value}
      oninput={(e) => (value = e.currentTarget.value)}
      placeholder={empty}
      size={Math.min(Math.max(value.length, empty.length, 4), 24)}
      class="sg-flag-in max-w-full min-w-0 {kind === 'date' && !value ? 'text-transparent focus:text-fg' : ''}"
    />
  </span>
</label>
