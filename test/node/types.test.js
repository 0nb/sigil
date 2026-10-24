import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

// a consumer project with sigil installed as a real copy in node_modules, like a github install
function consumer() {
  const dir = mkdtempSync(join(tmpdir(), 'sigil-ts-'));
  const pkg = join(dir, 'node_modules/@0nb/sigil');
  mkdirSync(pkg, { recursive: true });
  cpSync('package.json', join(pkg, 'package.json'));
  cpSync('src/lib', join(pkg, 'src/lib'), { recursive: true });
  symlinkSync(resolve('node_modules/svelte'), join(dir, 'node_modules/svelte'));
  writeFileSync(
    join(dir, 'consumer.ts'),
    `import { Pager, Ls, Prompt } from '@0nb/sigil';
import { mount } from '@0nb/sigil/horizon';
const handle: { destroy(): void } | null = mount(document.createElement('canvas'), { onready: () => {} });
handle?.destroy();
export const used = [Pager, Ls, Prompt];
`,
  );
  writeFileSync(
    join(dir, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        strict: true, allowJs: true, noEmit: true, module: 'esnext', moduleResolution: 'bundler',
        target: 'esnext', skipLibCheck: true, types: ['svelte'], lib: ['esnext', 'dom'],
      },
      files: ['consumer.ts'],
    }),
  );
  return dir;
}

test('typescript consumers resolve types for the package and horizon', () => {
  const dir = consumer();
  let out = '';
  try {
    execFileSync(resolve('node_modules/.bin/tsc'), ['-p', join(dir, 'tsconfig.json')], { encoding: 'utf8', stdio: 'pipe' });
  } catch (e) {
    out = String(/** @type {any} */ (e).stdout) + String(/** @type {any} */ (e).stderr);
  }
  expect(out).toBe('');
}, 60_000);
