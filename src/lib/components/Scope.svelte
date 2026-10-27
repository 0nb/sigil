<script>
  import Empty from './Empty.svelte';
  import { linear, ticks, pathFrom } from '../util/scale.js';

  /** @type {{ points: { t: number, v: number }[], label: string, height?: number, area?: boolean, format?: (v: number) => string, formatT?: (t: number) => string }} */
  let {
    points,
    label,
    height = 160,
    area = false,
    format = String,
    formatT = (t) => new Date(t).toISOString().slice(5, 10),
  } = $props();

  // lines live in a stretched 1000x100 svg; text is html so it keeps its size at any width
  const chart = $derived.by(() => {
    const vs = points.map((p) => p.v);
    const n = points.length;
    const max = Math.max(...vs);
    const ys = ticks(0, Math.max(max, 0), 3);
    const top = ys[ys.length - 1];
    const x = linear([points[0]?.t ?? 0, points[n - 1]?.t ?? 0], [0, 1000]);
    const y = linear([0, top], [100, 0]);
    const xy = points.map((p) => ({ x: x(p.t), y: y(p.v) }));
    const idx = [...new Set([0, 1, 2, 3].map((i) => Math.round((i * (n - 1)) / 3)))];
    return {
      path: pathFrom(xy),
      end: xy[n - 1],
      yLines: ys.map((v) => ({ v, y: y(v) })),
      xLabels: idx.map((i, j) => ({
        t: points[i].t,
        left: xy[i].x / 10,
        align: j === 0 ? 'start' : j === idx.length - 1 ? 'end' : 'middle',
      })),
      desc: `min ${format(Math.min(...vs))}, max ${format(max)}, last ${format(vs[n - 1])}`,
    };
  });

  /** @type {Record<string, string>} */
  const shift = { start: '', middle: '-translate-x-1/2', end: '-translate-x-full' };
</script>

{#if points.length === 0}
  <Empty title="no data yet" />
{:else}
  <figure class="relative text-tag text-dim tabular-nums" style="height: {height}px">
    <figcaption class="sr-only">{label}: {chart.desc}</figcaption>
    <div aria-hidden="true" class="absolute top-2 right-2 bottom-6 left-11">
      <svg viewBox="0 0 1000 100" preserveAspectRatio="none" class="absolute inset-0 h-full w-full overflow-visible">
        {#each chart.yLines as line (line.v)}
          <path d="M0 {line.y}H1000" class="stroke-rule" stroke-width="1" vector-effect="non-scaling-stroke" />
        {/each}
        {#if area}<path d="{chart.path}L{chart.end.x} 100L0 100Z" class="fill-fg" opacity="0.05" />{/if}
        <path d={chart.path} fill="none" class="stroke-fg" stroke-width="4" opacity="0.15" vector-effect="non-scaling-stroke" />
        <path d={chart.path} fill="none" class="stroke-fg" stroke-width="1" vector-effect="non-scaling-stroke" />
        <path d="M{chart.end.x} {chart.end.y}h0" class="stroke-fg" stroke-width="5" stroke-linecap="square" vector-effect="non-scaling-stroke" />
      </svg>
      {#each chart.yLines as line (line.v)}
        <span class="absolute right-[calc(100%+8px)] -translate-y-1/2 text-tag whitespace-nowrap" style="top: {line.y}%">{format(line.v)}</span>
      {/each}
      {#each chart.xLabels as l (l.t)}
        <span data-align={l.align} class="absolute top-[calc(100%+6px)] text-tag whitespace-nowrap {shift[l.align]}" style="left: {l.left}%"
          >{formatT(l.t)}</span
        >
      {/each}
    </div>
  </figure>
{/if}
