<script>
  /** @type {{ kind?: 'err' | 'ok' | 'plain', id?: string, announce?: boolean, children?: import('svelte').Snippet }} */
  let { kind = 'plain', id, announce = true, children } = $props();
  const role = $derived(
    announce ? (kind === 'err' ? 'alert' : kind === 'ok' ? 'status' : undefined) : undefined,
  );
</script>

<p {id} {role} class="text-small text-fg [overflow-wrap:anywhere]">
  {#if kind !== 'plain'}<span class="text-dim whitespace-pre">{kind}{'  '}</span>{/if}{@render children?.()}
</p>
