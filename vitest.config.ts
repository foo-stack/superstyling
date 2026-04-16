import { defineConfig } from "vitest/config";

/**
 * Two test projects:
 *   - logic: pure TS/JS logic tests, run in Node, files matching `*.test.ts`
 *   - web-component: web component tests, run in happy-dom, files matching `*.web.test.{ts,tsx}`
 *
 * Native tests live in `*.native.test.{ts,tsx}` and are handled by Jest + jest-expo.
 * Playwright component tests live in `*.playwright.test.{ts,tsx}` and are handled by Playwright.
 */
export default defineConfig({
  test: {
    passWithNoTests: true,
    projects: [
      {
        test: {
          name: "logic",
          environment: "node",
          include: ["packages/*/src/**/*.test.ts", "packages/*/src/**/*.test.tsx"],
          exclude: [
            "**/node_modules/**",
            "**/dist/**",
            "**/*.web.test.*",
            "**/*.native.test.*",
            "**/*.playwright.test.*",
          ],
          passWithNoTests: true,
        },
      },
      {
        test: {
          name: "web-component",
          environment: "happy-dom",
          include: ["packages/*/src/**/*.web.test.{ts,tsx}"],
          exclude: ["**/node_modules/**", "**/dist/**"],
          setupFiles: ["./vitest.setup.web.ts"],
          passWithNoTests: true,
        },
      },
    ],
  },
});
