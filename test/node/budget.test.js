import { build } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const root = resolve('test/budget');
/** @type {Map<string, Promise<{ css: string[], js: string[] }>>} */
const built = new Map();

function buildEntry(/** @type {string} */ name) {
  if (!built.has(name)) {
    built.set(
      name,
      (async () => {
        const outDir = join(root, '.out', name);
        await build({
          root,
          configFile: false,
          logLevel: 'silent',
          plugins: [svelte(), tailwindcss()],
          build: { outDir, emptyOutDir: true, rollupOptions: { input: join(root, `${name}.html`) } },
        });
        const dir = join(outDir, 'assets');
        const files = readdirSync(dir).map((f) => join(dir, f));
        return { css: files.filter((f) => f.endsWith('.css')), js: files.filter((f) => f.endsWith('.js')) };
      })(),
    );
  }
  return /** @type {Promise<{ css: string[], js: string[] }>} */ (built.get(name));
}

const gz = (/** @type {string[]} */ files) => files.reduce((n, f) => n + gzipSync(readFileSync(f)).length, 0);
const text = (/** @type {string[]} */ files) => files.map((f) => readFileSync(f, 'utf8')).join('');

test('css and js stay within budget', async () => {
  const empty = await buildEntry('baseline');
  const typ = await buildEntry('typical');
  const css = gz(typ.css);
  const js = gz(typ.js) - gz(empty.js);
  console.log(`budget: css ${css} B gz, js +${js} B gz over an empty svelte app`);
  expect(css).toBeLessThanOrEqual(8 * 1024);
  expect(js).toBeLessThanOrEqual(10 * 1024);
}, 60_000);

test('horizon is not in a normal page bundle', async () => {
  expect(text((await buildEntry('typical')).js)).not.toContain('webgl2');
}, 60_000);

test('generic saas utilities do not exist', async () => {
  const css = text((await buildEntry('typical')).css);
  for (const cls of ['.rounded-lg', '.shadow-md', '.bg-red-500', '.text-xl']) {
    expect(css).not.toContain(cls);
  }
  expect(css).not.toMatch(/@font-face/);
}, 60_000);
