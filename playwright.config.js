import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  timeout: 45000, // 45s timeout
  reporter: 'html',

  use: {
    /* Your local Vite frontend URL */
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
  },

  /* Test in Chromium (faster and reliable) */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Automatically boot Vite before testing if it's not already running */
  webServer: {
    command: 'npx vite --host 127.0.0.1 --port 5173',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: true,
    timeout: 60 * 1000,
  },
});