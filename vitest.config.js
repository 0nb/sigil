import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig({
  test: {
    projects: [
      {
        plugins: [svelte(), svelteTesting()],
        test: {
          name: 'dom',
          environment: 'jsdom',
          globals: true,
          setupFiles: ['test/setup.js'],
          include: ['test/unit/**/*.test.js'],
        },
      },
      {
        extends: false,
        plugins: [svelte()],
        test: { name: 'ssr', environment: 'node', globals: true, include: ['test/ssr/**/*.test.js'] },
      },
      {
        extends: false,
        plugins: [svelte()],
        test: { name: 'node', environment: 'node', globals: true, include: ['test/node/**/*.test.js'] },
      },
    ],
  },
});
