import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

// System testing of https://www.addwebsolution.com/ across 3 browsers x 3 screen sizes.
// Read-only: no form is filled in or submitted, no meeting is booked.
const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  phone: { width: 390, height: 844 },
} as const;

const ENGINES = {
  chromium: devices['Desktop Chrome'],
  firefox: devices['Desktop Firefox'],
  webkit: devices['Desktop Safari'],
} as const;

export default defineConfig({
  testDir: './tests/system',
  outputDir: './test-results/system',
  timeout: 180_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  workers: 2,
  retries: 0,
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results/system-results.json' }],
    ['html', { outputFolder: 'playwright-report-system', open: 'never' }],
  ],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.addwebsolution.com/',
    navigationTimeout: 45_000,
    actionTimeout: 15_000,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  projects: Object.entries(ENGINES).flatMap(([engine, device]) =>
    Object.entries(VIEWPORTS).map(([size, viewport]) => ({
      name: `${engine}-${size}`,
      use: {
        ...device,
        viewport,
        isMobile: engine === 'chromium' && size === 'phone' ? true : undefined,
        hasTouch: size !== 'desktop' && engine === 'chromium' ? true : undefined,
      },
    })),
  ),
});
