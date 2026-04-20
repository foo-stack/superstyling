/**
 * `@superstyling/next` — Next.js integration.
 *
 * This entry point exposes router-agnostic surface:
 *   - `withSuperStyling(options)` — wraps a Next config with
 *     `@tamagui/next-plugin`'s `withTamagui`, toggling `appDir` based on the
 *     user's choice.
 *   - `colorModeScriptSnippet({storageKey, initialMode})` — returns the raw
 *     blocking-script body (without surrounding `<script>` tags) so either
 *     router's helper can embed it.
 *   - `DEFAULT_STORAGE_KEY` — re-exported from core for convenience.
 *
 * Router-specific helpers live at:
 *   - `@superstyling/next/app`  — App Router (layout.tsx, server components)
 *   - `@superstyling/next/pages` — Pages Router (_document.tsx class API)
 */

import { buildColorModeScript as buildCore, DEFAULT_STORAGE_KEY } from "@superstyling/core";
import type { InitialColorMode } from "@superstyling/core";

// ────────────────────────────────────────────────────────────────────────
// Config wrapper

export interface SuperStylingNextOptions {
  /** Path to your `tamagui.config.ts`. Required. */
  config: string;

  /** Module paths Tamagui should extract through. Default: `["tamagui"]`. */
  components?: string[];

  /**
   * Enable App Router support. Default: `true`. Set to `false` only if your
   * project is pure Pages Router and you want to opt out of App Router
   * transforms.
   */
  appDir?: boolean;

  /** Disable Tamagui's static extraction (debug). Default: off. */
  disableExtraction?: boolean;

  /** Forwarded `shouldExtract` predicate for external packages. */
  // oxlint-disable-next-line typescript/no-explicit-any
  shouldExtract?: (path: string, projectRoot: string) => boolean | undefined;
}

/**
 * Wrap a Next config. Call site:
 * ```ts
 * // next.config.mjs
 * import { withSuperStyling } from "@superstyling/next";
 * export default withSuperStyling({ config: "./tamagui.config.ts" })({
 *   reactStrictMode: true,
 * });
 * ```
 */
export function withSuperStyling(options: SuperStylingNextOptions) {
  const {
    config,
    components = ["tamagui"],
    appDir = true,
    disableExtraction,
    shouldExtract,
  } = options;
  // Lazy-load Tamagui's plugin so this module is importable from contexts
  // where webpack isn't installed (tests, RSC analysis). The plugin itself
  // only runs during `next build`/`next dev`, where webpack is always present.
  // oxlint-disable-next-line typescript/no-require-imports, unicorn/prefer-module
  const { withTamagui } = require("@tamagui/next-plugin") as typeof import("@tamagui/next-plugin");
  return withTamagui({
    config,
    components,
    appDir,
    disableExtraction,
    shouldExtract,
  });
}

// ────────────────────────────────────────────────────────────────────────
// FOUC script body

export interface ColorModeScriptOptions {
  storageKey?: string;
  initialMode?: InitialColorMode;
}

/**
 * Returns the raw JS body (no `<script>` wrapper) that reads the persisted
 * color mode from `localStorage` and applies a `class` on `<html>` before
 * React hydrates. Used by the router-specific helpers; exposed here for
 * consumers who want to ship the script themselves.
 */
export function buildColorModeScript(options: ColorModeScriptOptions = {}): string {
  const { storageKey = DEFAULT_STORAGE_KEY, initialMode = "light" } = options;
  return buildCore(initialMode, storageKey);
}

export { DEFAULT_STORAGE_KEY };
export type { InitialColorMode };
