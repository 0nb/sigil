import { defineConfig, devices } from '@playwright/test';

const url = 'http://localhost:5173';

export default defineConfig({
  testDir: 'e2e',
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL: url },
  webServer: {
    command: 'pnpm dev --port 5173 --strictPort',
    url,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    {
      name: 'phone',
      use: { ...devices['Desktop Chrome'], viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true },
    },
  ],
});
