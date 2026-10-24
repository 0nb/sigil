<script>
  import { reducedMotion } from '../util/motion.js';

  /** @type {{ label?: string }} */
  let { label = 'loading' } = $props();

  const frames = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';
  let i = $state(-1);

  $effect(() => {
    if (reducedMotion()) return;
    i = 0;
    const t = setInterval(() => (i = (i + 1) % frames.length), 80);
    return () => clearInterval(t);
  });
</script>

<span role="status" class="text-dim"
  ><span aria-hidden="true">{i < 0 ? '…' : frames[i]}</span><span class="sr-only">{label}</span></span
>
