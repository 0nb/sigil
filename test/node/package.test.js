import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

test('package metadata', () => {
  expect(pkg.name).toBe('@0nb/sigil');
  expect(pkg.license).toBe('UNLICENSED');
  expect(pkg.dependencies ?? {}).toEqual({});
  expect(pkg.peerDependencies).toEqual({ svelte: '^5', tailwindcss: '^4' });
  expect(pkg.files).toEqual(['src/lib']);
});

test('licence text is exact', () => {
  expect(readFileSync('LICENSE', 'utf8').trim()).toBe(
    'copyright (c) 2026 the 0nb authors. all rights reserved.\n\n' +
      'no licence is granted to use, copy, modify or distribute this software,\n' +
      "except the rights github's terms of service give other github users\n" +
      'for public repositories (viewing and forking on github).',
  );
});
