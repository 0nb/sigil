<script>
  /** @type {{ kind?: 'err' | 'ok' | 'plain', id?: string, announce?: boolean, children?: import('svelte').Snippet }} */
  let { kind = 'plain', id, announce = true, children } = $props();
</script>

<p
  {id}
  role={announce ? (kind === 'err' ? 'alert' : kind === 'ok' ? 'status' : undefined) : undefined}
  class="text-small text-fg [overflow-wrap:anywhere]">
<span class="text-dim whitespace-pre">{kind === 'plain' ? '' : `${kind}  `}</span>{@render children?.()}
</p>
