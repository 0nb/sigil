<script>
  /** @type {{ type?: 'submit' | 'button', name?: string, value?: string, disabled?: boolean, pressed?: boolean, onclick?: (e: MouseEvent) => void, children?: import('svelte').Snippet, class?: string }} */
  let { type = 'submit', name, value, disabled, pressed, onclick, children, class: klass = '' } = $props();
</script>

<!-- links take the same look with: <a class="group sg-btn"><span class="sg-btn-label">…</span></a> -->
<button {type} {name} {value} {disabled} aria-pressed={pressed} {onclick} class="group sg-btn {klass}"
  ><span class="sg-btn-label">{@render children?.()}</span></button
>
