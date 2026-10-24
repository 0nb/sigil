<script>
  /** @type {{ size?: number, weight?: number, title?: string, class?: string }} */
  let { size = 40, weight = 1.6, title, class: klass = '' } = $props();
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 40 40"
  fill="none"
  stroke="currentColor"
  stroke-width={weight}
  class="{klass}"
  aria-hidden={title ? undefined : 'true'}
  role={title ? 'img' : undefined}
  aria-label={title}
>
  {#if title}<title>{title}</title>{/if}
  <circle cx="20" cy="20" r="11" />
  <path d="M20 2V38" />
</svg>
