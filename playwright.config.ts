import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for real-browser web component tests.
 * Files matching `*.playwright.test.{ts,tsx}` run in Chromium.
 *
 * For the @playwright/experimental-ct-react component test runner, we'll
 * configure a CT-specific entrypoint when we have actual CT specs. For now,
 * this config supports both standard and CT-style spec discovery.
 */
export default defineConfig({
  testDir: "./packages",
  testMatch: "**/*.playwright.test.{ts,tsx}",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
