<script>
  /** @type {{ text: string, lock?: boolean }} */
  let { text, lock } = $props();
</script>

<span class="sg-chip" title={text}
  >{#if lock}<svg aria-hidden="true" viewBox="0 0 12 12" fill="none" stroke="currentColor" class="size-[11px] shrink-0"
      ><rect x="2.5" y="5.5" width="7" height="5" rx="1" /><path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" /></svg
    >{/if}<span class="truncate">{text}</span></span
>
