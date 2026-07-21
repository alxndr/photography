import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4001/photography/',
    trace: 'on-first-retry',
  },
  webServer: {
    // Build once and serve the static output, rather than Hexo's live dev
    // server: that server renders each route on-demand on first request,
    // which races with Playwright's readiness check and can serve
    // incomplete pages to the first test that hits a given route.
    command: 'npx hexo generate && node tests/static-server.js',
    url: 'http://localhost:4001/photography/',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
