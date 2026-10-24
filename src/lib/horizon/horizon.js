// the horizon: lensed grid + photon ring + jet, traced by a single phosphor beam.
import { VS, FS } from './shader.js';
import { reducedMotion } from '../util/motion.js';

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{ onready?: () => void, onlost?: () => void }} [opts]
 * @returns {{ destroy(): void } | null} null when motion is reduced or webgl2 is unavailable
 */
export function mount(canvas, opts = {}) {
  if (reducedMotion()) return null;
  const gl = /** @type {WebGL2RenderingContext | null} */ (
    canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'high-performance' })
  );
  if (!gl) return null;

  const prog = gl.createProgram();
  for (const [type, src] of /** @type {const} */ ([
    [gl.VERTEX_SHADER, VS],
    [gl.FRAGMENT_SHADER, FS],
  ])) {
    const s = /** @type {WebGLShader} */ (gl.createShader(type));
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(s));
      return null;
    }
    gl.attachShader(prog, s);
  }
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(prog));
    return null;
  }
  /** @type {Record<string, WebGLUniformLocation | null>} */
  const u = {};
  for (const n of ['R', 'T', 'M', 'V']) u[n] = gl.getUniformLocation(prog, n);
  gl.useProgram(prog);
  gl.bindVertexArray(gl.createVertexArray());

  // resolution: dpr capped at 2, stepped down if frames run slow
  let scale = Math.min(devicePixelRatio || 1, 2);
  const resize = () => {
    canvas.width = Math.round(innerWidth * scale);
    canvas.height = Math.round(innerHeight * scale);
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  resize();

  let target = [0, 0];
  let mouse = [0, 0];
  let prev = [0, 0];
  let vel = 0;
  /** @param {PointerEvent} e */
  const onpointer = (e) => {
    target = [(e.clientX / innerWidth) * 2 - 1, 1 - (e.clientY / innerHeight) * 2];
  };

  let t = 0;
  let last = 0;
  let raf = 0;
  let frames = 0;
  let slow = 0;
  let shown = false;
  /** @param {number} now */
  const frame = (now) => {
    const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
    last = now;
    t += dt;

    mouse[0] += (target[0] - mouse[0]) * 0.06;
    mouse[1] += (target[1] - mouse[1]) * 0.06;
    const sp = Math.hypot(mouse[0] - prev[0], mouse[1] - prev[1]) * 30;
    prev = [...mouse];
    vel += (Math.min(sp, 1) - vel) * 0.08;

    gl.uniform2f(u.R, canvas.width, canvas.height);
    gl.uniform1f(u.T, t);
    gl.uniform2f(u.M, mouse[0], mouse[1]);
    gl.uniform1f(u.V, vel);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    if (!shown) {
      shown = true;
      opts.onready?.();
    }
    if (dt > 0.024) slow++;
    if (++frames === 90) {
      if (slow > 45 && scale > 0.6) {
        scale *= 0.75;
        resize();
      }
      frames = slow = 0;
    }
    raf = requestAnimationFrame(frame);
  };

  const onvisibility = () => {
    cancelAnimationFrame(raf);
    if (!document.hidden) {
      last = 0;
      raf = requestAnimationFrame(frame);
    }
  };
  /** @param {Event} e */
  const onlost = (e) => {
    e.preventDefault();
    cancelAnimationFrame(raf);
    opts.onlost?.();
  };

  addEventListener('resize', resize);
  addEventListener('pointermove', onpointer, { passive: true });
  document.addEventListener('visibilitychange', onvisibility);
  canvas.addEventListener('webglcontextlost', onlost);
  raf = requestAnimationFrame(frame);

  return {
    destroy() {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
      removeEventListener('pointermove', onpointer);
      document.removeEventListener('visibilitychange', onvisibility);
      canvas.removeEventListener('webglcontextlost', onlost);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}
