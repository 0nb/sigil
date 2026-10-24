// copied verbatim from 0nb.dev public/main.js
export const VS = `#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

export const FS = `#version 300 es
precision highp float;
uniform vec2 R;   // resolution (px)
uniform float T;  // time since load (s)
uniform vec2 M;   // smoothed pointer, -1..1
uniform float V;  // smoothed pointer speed, 0..1
out vec4 o;
const float TAU = 6.2831853;

float h12(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vn(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h12(i), h12(i + vec2(1, 0)), f.x), mix(h12(i + vec2(0, 1)), h12(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p) { float a = .5, s = 0.; for (int i = 0; i < 5; i++) { s += a * vn(p); p = p * 2.03 + 17.1; a *= .5; } return s; }

// box-filtered grid (after iq): line coverage 0..1, stays correct when the grid is crushed by lensing
float grid(vec2 p) {
  const float N = 36.0;
  vec2 w = max(abs(dFdx(p)), abs(dFdy(p))) + 1e-4;
  vec2 a = p + .5 * w, b = p - .5 * w;
  vec2 i = (floor(a) + min(fract(a) * N, 1.) - floor(b) - min(fract(b) * N, 1.)) / (N * w);
  return 1. - (1. - i.x) * (1. - i.y);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - .5 * R) / R.y;
  float px = 1. / R.y;
  float k = smoothstep(0., 4.5, T); k = k * k * (3. - 2. * k);
  float r = length(uv), ang = atan(uv.y, uv.x);
  float rs = .085 * k, rp = .0885 * k, E = .15 * k * (1. + .03 * sin(T * .4));

  // one beam: ring (Tc), then the stroke (Tl)
  float Tc = 3.2, Tl = 1.4, cyc = Tc + Tl, ph = mod(T, cyc), tau = 1.4, L = .16;
  vec2 head = ph < Tc
    ? rp * vec2(cos(1.5707963 - TAU * ph / Tc), sin(1.5707963 - TAU * ph / Tc))
    : vec2(0., L - 2. * L * (ph - Tc) / Tl);

  // signal: unlocked noise at start, rare glitch, cursor interference
  float lock = smoothstep(1., 4.5, T);
  float glitch = exp(-mod(T, 9.) * 4.) * step(5., T);
  vec2 mp = M * vec2(.5 * R.x / R.y, .5);
  float near = exp(-dot(uv - mp, uv - mp) / .01);
  float A = mix(.03, .0008, lock) + .012 * glitch + .02 * V * near;

  // lensed grid (thin-lens point mass), nearly invisible, lit only by the beam head and the cursor
  vec2 src = uv * (1. - E * E / max(r * r, 1e-6));
  src += vec2(T * .004, T * .0025) + M * .02;
  src += (A + .0004) * 2. * vec2(vn(src * 40. + T * 3.), vn(src * 40. - T * 3.));
  float vig = 1. - smoothstep(.1, .8, length(uv * vec2(.75, 1.)));
  float lit = .16 + 1.2 * exp(-length(uv - head) / .09) + .7 * exp(-length(uv - mp) / .12);
  vec3 col = vec3(grid(src / .045) * .11 * lit * vig);
  col *= smoothstep(rs - px, rs + px, r);

  // ring, written by the beam, doppler-brightened on one side
  float nC = (fbm(vec2(cos(ang), sin(ang)) * 3. + vec2(T * 2.3, -T * 1.7)) - .5) * 2. + .25 * sin(ang * 40. + T * 20.);
  float dr = r - (rp + A * nC);
  float hd = dr > 0. ? dr : -dr * 6.;
  float ring = exp(-pow(dr / (1.3 * px), 2.)) * .95 + exp(-hd / .010) * .22 + exp(-hd / .045) * .05;
  float bC = .1 + exp(-mod(ph - mod(1.5707963 - ang, TAU) / TAU * Tc, cyc) / tau);
  float beam = .7 + .45 * cos(ang - .6 - T * .08);
  col += ring * bC * beam * k;

  // stroke / jet, written by the beam
  float ay = abs(uv.y);
  float turb = fbm(vec2(uv.x * 40., ay * 10. - T * .9));
  float nL = (fbm(vec2(uv.y * 12. + T * 1.9, T * 2.7)) - .5) * 2. + .25 * sin(uv.y * 120. - T * 25.);
  float dL = uv.x - A * nL;
  float jw = .0011 + .010 * ay * ay;
  float bL = .1 + exp(-mod(ph - (Tc + (L - clamp(uv.y, -L, L)) / (2. * L) * Tl), cyc) / tau);
  float jet = exp(-pow(dL / jw, 2.)) * (.5 + .6 * turb) + exp(-pow(dL / (.012 + .05 * ay), 2.)) * .04 * turb;
  col += jet * bL * smoothstep(L + .12, L - .04, ay) * smoothstep(2., 4.5, T);

  // write head
  float hdist = length(uv - head);
  col += (exp(-hdist / .004) * .7 + exp(-hdist / .03) * .1) * smoothstep(1., 3., T);

  col = 1. - exp(-col * 1.6);                                       // soft tone map
  col += (h12(gl_FragCoord.xy + fract(T * 61.) * 500.) - .5) * (.012 + .05 * col);  // grain
  o = vec4(max(col, 0.) * .92, 1.);                                 // #e6e6e6 ceiling
}`;
