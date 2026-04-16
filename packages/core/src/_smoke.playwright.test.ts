import { test, expect } from "@playwright/test";

/**
 * Smoke placeholder. Playwright has no `--passWithNoTests` flag, so this single
 * trivial test ensures `yarn test:playwright` exits 0 even before real component
 * tests exist. Delete this file once a real `*.playwright.test.ts` ships.
 */
test("playwright runner is configured", () => {
  expect(true).toBe(true);
});
