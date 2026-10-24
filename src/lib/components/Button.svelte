<script>
  /** @type {{ type?: 'submit' | 'button', name?: string, value?: string, disabled?: boolean, onclick?: (e: MouseEvent) => void, children?: import('svelte').Snippet, class?: string }} */
  let { type = 'submit', name, value, disabled, onclick, children, class: klass = '' } = $props();
</script>

<!-- links take the same look with: <a class="group sg-btn"><span class="sg-btn-label">…</span></a> -->
<button {type} {name} {value} {disabled} {onclick} class="group sg-btn {klass}"
  ><span class="sg-btn-label">{@render children?.()}</span></button
>
