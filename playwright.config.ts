import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/generated",
  // Each ticket now holds a dozen independent cases, and the cart ones are slow.
  // Without this, one worker would sit on a single ticket while the others idle.
  fullyParallel: true,
  // These run against the live production site, whose cart AJAX degrades sharplyre
  // under concurrency: at four workers, cart totals and the header count were
  // still stale after 45s. Two keeps the suite honest without hammering the site.
  workers: 2,
  // One retry, so a dropped cart fragment does not read as a broken feature. A
  // case that only passes on the retry is reported as flaky rather than clean.
  retries: 1,
  reporter: [
    // Playwright's own report cannot be opened off disk - it fetches each test's
    // data at runtime, which file:// blocks - so it lives out of the way under
    // reports/ and is read through "npm run report", which serves it.
    ["html", { open: "never", outputFolder: "reports/playwright" }],
    ["json", { outputFile: "test-results/results.json" }],
  ],
  use: {
    baseURL: "https://www.shreeradheydairy.com/",
    // Every test case owes the Jira ticket a screenshot of its final state, so
    // capture one on pass and on failure rather than leaving it to each spec.
    screenshot: "on",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
