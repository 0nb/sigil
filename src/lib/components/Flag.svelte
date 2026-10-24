<script>
  /** @type {{ name: string, flag: string, kind?: 'text' | 'toggle' | 'choice' | 'date', value?: string | boolean, options?: string[], empty?: string }} */
  let {
    name,
    flag,
    kind = 'text',
    value = $bindable(kind === 'toggle' ? false : ''),
    options = [],
    empty = 'none',
  } = $props();

  const control =
    'bg-transparent text-fg outline-none border-b border-transparent focus:border-fg placeholder:text-dim';

  /** @param {KeyboardEvent} e */
  function enterToggles(e) {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    value = !value;
  }
</script>

<label class="inline-flex cursor-pointer items-baseline gap-2 text-small">
  <span class="text-dim">--{flag}</span>
  {#if kind === 'toggle'}
    <input
      type="checkbox"
      {name}
      value="on"
      checked={value === true}
      onchange={(e) => (value = e.currentTarget.checked)}
      onkeydown={enterToggles}
      class="peer sr-only"
    />
    <span
      aria-hidden="true"
      class="border-b border-transparent text-dim peer-checked:text-fg peer-focus-visible:border-fg before:content-[attr(data-off)] peer-checked:before:content-['on']"
      data-off={empty}
    ></span>
  {:else if kind === 'choice'}
    <select {name} bind:value class="{control} cursor-pointer appearance-none">
      {#each options as o (o)}<option value={o} class="bg-ground">{o}</option>{/each}
    </select>
  {:else if kind === 'date'}
    <span class="relative inline-block">
      <input
        type="date"
        {name}
        bind:value
        class="{control} peer {value ? '' : 'text-transparent focus:text-fg'}"
      />
      {#if !value}<span
          aria-hidden="true"
          class="pointer-events-none absolute top-0 left-0 text-dim peer-focus:hidden">{empty}</span
        >{/if}
    </span>
  {:else}
    <input
      type="text"
      {name}
      bind:value
      placeholder={empty}
      size={Math.max(String(value ?? '').length, empty.length, 4)}
      class={control}
    />
  {/if}
</label>
