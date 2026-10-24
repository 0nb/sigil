<script>
  import Empty from './Empty.svelte';
  import { linear, ticks, pathFrom } from '../util/scale.js';

  /** @type {{ points: { t: number, v: number }[], label: string, height?: number, format?: (v: number) => string, formatT?: (t: number) => string }} */
  let {
    points,
    label,
    height = 160,
    format = String,
    formatT = (t) => new Date(t).toISOString().slice(5, 10),
  } = $props();

  const W = 600;
  const pad = { l: 44, r: 8, t: 8, b: 22 };

  const chart = $derived.by(() => {
    const vs = points.map((p) => p.v);
    const min = Math.min(...vs);
    const max = Math.max(...vs);
    const ys = ticks(0, Math.max(max, 0), 3);
    const top = ys[ys.length - 1];
    const x = linear([points[0]?.t ?? 0, points[points.length - 1]?.t ?? 0], [pad.l, W - pad.r]);
    const y = linear([0, top], [height - pad.b, pad.t]);
    const n = points.length;
    const xIdx = [...new Set([0, 1, 2, 3].map((i) => Math.round((i * (n - 1)) / 3)))];
    const xy = points.map((p) => ({ x: x(p.t), y: y(p.v) }));
    return {
      path: pathFrom(xy),
      end: xy[n - 1],
      yLines: ys.map((v) => ({ v, y: y(v) })),
      xLabels: xIdx.map((i) => ({ t: points[i].t, x: xy[i].x })),
      desc: `min ${format(min)}, max ${format(max)}, last ${format(vs[n - 1])}`,
    };
  });
</script>

{#if points.length === 0}
  <Empty title="no data yet" />
{:else}
  <svg role="img" aria-label={label} viewBox="0 0 {W} {height}" width="100%" class="block text-tag">
    <desc>{chart.desc}</desc>
    {#each chart.yLines as line (line.v)}
      <line x1={pad.l} x2={W - pad.r} y1={line.y} y2={line.y} class="stroke-rule" vector-effect="non-scaling-stroke" />
      <text x={pad.l - 8} y={line.y} text-anchor="end" dominant-baseline="middle" class="fill-dim" font-size="10"
        >{format(line.v)}</text
      >
    {/each}
    {#each chart.xLabels as l (l.t)}
      <text x={l.x} y={height - 4} text-anchor="middle" class="fill-dim" font-size="10">{formatT(l.t)}</text>
    {/each}
    <path d={chart.path} fill="none" class="stroke-fg" stroke-width="4" opacity="0.15" vector-effect="non-scaling-stroke" />
    <path d={chart.path} fill="none" class="stroke-fg" stroke-width="1" vector-effect="non-scaling-stroke" />
    <circle cx={chart.end.x} cy={chart.end.y} r="2.5" class="fill-fg" />
  </svg>
{/if}
