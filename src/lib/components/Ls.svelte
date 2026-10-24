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
    empty,
  }: {
    caption: string;
    columns: Column[];
    rows: T[];
    key: (row: T) => string;
    empty?: Snippet;
  } = $props();

  const valueOf = (row: T, col: Column) => (row as Record<string, unknown>)[col.key];
</script>

<table class="w-full border-collapse text-small max-sm:block">
  <caption class="sr-only">{caption}</caption>
  <thead class="max-sm:hidden">
    <tr>
      {#each columns as col (col.key)}
        <th
          scope="col"
          class="sg-th {col.align === 'right' ? 'pl-4 text-right' : 'pr-4 text-left'}">{col.label}</th
        >
      {/each}
    </tr>
  </thead>
  <tbody class="max-sm:block">
    {#each rows as row (key(row))}
      <tr class="group max-sm:block max-sm:py-2">
        {#each columns as col (col.key)}
          {@const v = valueOf(row, col)}
          <td
            data-label={col.label}
            title={typeof v === 'string' ? v : undefined}
            class="sg-td truncate {col.align === 'right' ? 'sg-td-r' : 'pr-4'} {col.dim ? 'text-dim' : 'text-fg'}"
          >
            {#if col.cell}{@render col.cell(row)}{:else}{v}{/if}
          </td>
        {/each}
      </tr>
    {:else}
      {#if empty}
        <tr><td colspan={columns.length} class="py-4">{@render empty()}</td></tr>
      {/if}
    {/each}
  </tbody>
</table>
