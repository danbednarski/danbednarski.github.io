import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:8787',
    browserName: 'chromium',
  },
  webServer: {
    command: 'npx wrangler dev --port 8787',
    port: 8787,
    reuseExistingServer: true,
    timeout: 15000,
  },
});
