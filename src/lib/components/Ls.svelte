<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';

  type Column = {
    key: string;
    label: string;
    align?: 'left' | 'right';
    dim?: boolean;
    cell?: Snippet<[T]>;
  };

  let {
    caption,
    columns,
    rows,
    key,
    onrowclick,
    empty,
  }: {
    caption: string;
    columns: Column[];
    rows: T[];
    key: (row: T) => string;
    onrowclick?: (row: T) => void;
    empty?: Snippet;
  } = $props();

  const valueOf = (row: T, col: Column) => (row as Record<string, unknown>)[col.key];

  function onkeydown(e: KeyboardEvent, row: T) {
    if (e.key !== 'Enter' || !onrowclick) return;
    e.preventDefault();
    onrowclick(row);
  }
</script>

<table class="w-full border-collapse text-small max-sm:block">
  <caption class="sr-only">{caption}</caption>
  <thead class="max-sm:hidden">
    <tr>
      <th aria-hidden="true" class="w-[2ch] border-b border-rule"></th>
      {#each columns as col (col.key)}
        <th
          scope="col"
          class="border-b border-rule pb-1.5 text-tag font-normal tracking-tag text-dim {col.align === 'right'
            ? 'pl-4 text-right'
            : 'pr-4 text-left'}">{col.label}</th
        >
      {/each}
    </tr>
  </thead>
  <tbody class="max-sm:block">
    {#each rows as row (key(row))}
      <tr
        tabindex={onrowclick ? 0 : undefined}
        onclick={onrowclick ? () => onrowclick(row) : undefined}
        onkeydown={(e) => onkeydown(e, row)}
        class="group outline-none max-sm:block max-sm:py-2 {onrowclick ? 'cursor-pointer' : ''}"
      >
        <td
          aria-hidden="true"
          class="invisible w-[2ch] text-dim group-hover:visible group-focus-within:visible group-focus:visible max-sm:hidden"
          >&gt;</td
        >
        {#each columns as col (col.key)}
          {@const v = valueOf(row, col)}
          <td
            data-label={col.label}
            title={typeof v === 'string' ? v : undefined}
            class="max-w-0 truncate py-1 max-sm:block max-sm:max-w-full max-sm:before:mr-[2ch] max-sm:before:text-dim max-sm:before:content-[attr(data-label)] {col.align ===
            'right'
              ? 'pl-4 text-right tabular-nums max-sm:pl-0 max-sm:text-left'
              : 'pr-4'} {col.dim ? 'text-dim' : 'text-fg'}"
          >
            {#if col.cell}{@render col.cell(row)}{:else}{v}{/if}
          </td>
        {/each}
      </tr>
    {:else}
      {#if empty}
        <tr><td colspan={columns.length + 1} class="py-4">{@render empty()}</td></tr>
      {/if}
    {/each}
  </tbody>
</table>
