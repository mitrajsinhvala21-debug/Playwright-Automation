import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const isCI = process.env.CI === 'true';

export default defineConfig({
  testDir: './tests/generated',
  timeout: Number(process.env.TEST_TIMEOUT ?? 30000),
  expect: { timeout: Number(process.env.EXPECT_TIMEOUT ?? 5000) },
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.addwebsolution.com/',
    headless: process.env.HEADLESS !== 'false',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
