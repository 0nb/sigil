/**
 * @param {[number, number]} domain
 * @param {[number, number]} range
 * @returns {(v: number) => number}
 */
export function linear([d0, d1], [r0, r1]) {
  if (d0 === d1) {
    const mid = (r0 + r1) / 2;
    return () => mid;
  }
  return (v) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);
}

/**
 * nice ticks (1, 2, 5 x 10^n) covering [min, max]
 * @param {number} min
 * @param {number} max
 * @param {number} count
 * @returns {number[]}
 */
export function ticks(min, max, count) {
  if (min === max) return [min];
  const raw = (max - min) / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = /** @type {number} */ ([1, 2, 5, 10].map((m) => m * mag).find((s) => s >= raw));
  const out = [];
  for (let i = Math.floor(min / step); i <= Math.ceil(max / step); i++) {
    out.push(Number((i * step).toPrecision(12)));
  }
  return out;
}

const r2 = (/** @type {number} */ n) => Math.round(n * 100) / 100;

/**
 * @param {{ x: number, y: number }[]} points
 * @returns {string}
 */
export function pathFrom(points) {
  return points.map((p, i) => `${i ? 'L' : 'M'}${r2(p.x)} ${r2(p.y)}`).join(' ');
}
