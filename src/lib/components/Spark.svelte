<script>
  import { linear, pathFrom } from '../util/scale.js';

  /** @type {{ values: number[], width?: number, height?: number, label?: string }} */
  let { values, width = 70, height = 16, label } = $props();

  const d = $derived.by(() => {
    if (values.length < 2) return pathFrom([{ x: 0, y: height / 2 }, { x: width, y: height / 2 }]);
    const x = linear([0, values.length - 1], [1, width - 1]);
    const y = linear([Math.min(...values), Math.max(...values)], [height - 1, 1]);
    return pathFrom(values.map((v, i) => ({ x: x(i), y: y(v) })));
  });
</script>

<svg
  {width}
  {height}
  viewBox="0 0 {width} {height}"
  class="inline-block align-middle"
  aria-hidden={label ? undefined : 'true'}
  role={label ? 'img' : undefined}
  aria-label={label}
>
  <path {d} fill="none" class="stroke-fg" stroke-width="1" />
</svg>
