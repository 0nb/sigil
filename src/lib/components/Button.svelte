<script>
  /** @type {{ type?: 'submit' | 'button', name?: string, value?: string, disabled?: boolean, pressed?: boolean, variant?: 'primary' | 'secondary' | 'ghost', size?: 'small', onclick?: (e: MouseEvent) => void, children?: import('svelte').Snippet, class?: string }} */
  let { type = 'submit', name, value, disabled, pressed, variant = 'secondary', size, onclick, children, class: klass = '' } = $props();
</script>

<!-- links take the same look with: <a class="sg-btn" data-variant="primary">…</a> -->
<button {type} {name} {value} {disabled} aria-pressed={pressed} data-variant={variant} data-size={size} {onclick} class="sg-btn {klass}"
  >{@render children?.()}</button
>
