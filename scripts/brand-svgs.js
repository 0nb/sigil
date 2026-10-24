// pure: builds the brand svgs for a project. safe to import in the browser.
const FG = '#e6e6e6';
const GHOST = '#4a4a4a';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

const esc = (/** @type {string} */ s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * @param {{ w: number, h: number, cx: number, cy: number, r: number, len: number, stroke: number, fade: number, tag: { size: number, spacing: number, x: number, y: number }, left: string, right: string, frame?: number }} o
 */
function scene(o) {
  const half = o.len / 2;
  const frame = o.frame
    ? `<clipPath id="frame"><rect width="${o.w}" height="${o.h}" rx="${o.frame}"/></clipPath>`
    : '';
  const open = o.frame ? '<g clip-path="url(#frame)">' : '<g>';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${o.w}" height="${o.h}" viewBox="0 0 ${o.w} ${o.h}" fill="none">
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" stroke="#ffffff" stroke-opacity="0.09" stroke-width="1"/></pattern>
    <radialGradient id="fade" cx="${o.cx}" cy="${o.cy}" r="${o.fade}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <mask id="vignette"><rect width="${o.w}" height="${o.h}" fill="url(#fade)"/></mask>
    ${frame}
  </defs>
  ${open}
    <rect width="${o.w}" height="${o.h}" fill="#000"/>
    <rect width="${o.w}" height="${o.h}" fill="url(#grid)" mask="url(#vignette)"/>
  </g>
  <g stroke="${FG}" stroke-width="${o.stroke}">
    <circle cx="${o.cx}" cy="${o.cy}" r="${o.r}"/>
    <path d="M${o.cx} ${o.cy - half}V${o.cy + half}"/>
  </g>
  <g font-family="${MONO}" font-size="${o.tag.size}" letter-spacing="${o.tag.spacing}" fill="${GHOST}">
    <text x="${o.tag.x}" y="${o.tag.y}">${esc(o.left)}</text>
    <text x="${o.w - o.tag.x}" y="${o.tag.y}" text-anchor="end">${esc(o.right)}</text>
  </g>
</svg>
`;
}

/**
 * @param {{ left: string, right: string }} tags corner tags, e.g. { left: 'fold', right: 'fld.0nb.dev' }
 * @returns {{ favicon: string, avatar: string, og: string, banner: string }}
 */
export function brandSvgs({ left, right }) {
  return {
    favicon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="8" fill="#000"/><g stroke="${FG}" stroke-width="3.2"><circle cx="20" cy="20" r="9"/><path d="M20 5V35"/></g></svg>
`,
    avatar: `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024" fill="none"><rect width="1024" height="1024" fill="#000"/><g stroke="${FG}" stroke-width="40"><circle cx="512" cy="512" r="150"/><path d="M512 262V762"/></g></svg>
`,
    og: scene({
      w: 1200, h: 630, cx: 600, cy: 315, r: 44, len: 144, stroke: 6, fade: 640,
      tag: { size: 18, spacing: 5, x: 40, y: 590 }, left, right,
    }),
    banner: scene({
      w: 1280, h: 400, cx: 640, cy: 200, r: 33, len: 108, stroke: 5, fade: 620,
      tag: { size: 16, spacing: 4.5, x: 32, y: 368 }, left, right, frame: 12,
    }),
  };
}
