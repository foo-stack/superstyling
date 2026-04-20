/**
 * `@superstyling/vite` — Vite integration.
 *
 * Surface:
 *   - `superstylingVitePlugin(options)` — wraps `@tamagui/vite-plugin`'s
 *     `tamaguiPlugin` with preset defaults (`components: ["tamagui"]`,
 *     rnw-lite alias on by default) plus dev-server `optimizeDeps` hints
 *     that pre-bundle `react-native-web` so cold starts don't thrash.
 *   - `superstylingAliases(options)` — re-exports Tamagui's alias entries
 *     for users who need manual `resolve.alias` ordering control.
 *   - `colorModeScriptSnippet({ storageKey?, cookie?, initialMode? })` —
 *     returns the blocking `<script>` HTML that reads persisted mode before
 *     hydration. Drop into `index.html` to kill FOUC.
 */

import type { Plugin, PluginOption } from "vite";
import { tamaguiPlugin, tamaguiAliases } from "@tamagui/vite-plugin";
import { buildColorModeScript, DEFAULT_STORAGE_KEY } from "@superstyling/core";
import type { InitialColorMode } from "@superstyling/core";

// ────────────────────────────────────────────────────────────────────────
// Plugin

export interface SuperStylingVitePluginOptions {
  /**
   * Path to your `tamagui.config.ts` (or compatible). Required so Tamagui can
   * load tokens, themes, and media queries at build time.
   */
  config: string;

  /**
   * Module paths containing Tamagui components. Defaults to `["tamagui"]` so
   * the extractor traverses Tamagui's own primitives. Add `"@superstyling/core"`
   * to extract through Superstyling's wrappers too.
   */
  components?: string[];

  /**
   * Platform target. `"web"` uses `react-native-web` (default); `"native"`
   * produces output for RN runtimes but is rarely what a Vite user wants.
   */
  platform?: "native" | "web";

  /**
   * Use the lighter `@tamagui/react-native-web-lite` alias (smaller bundle,
   * no Animated runtime). Pass `"without-animated"` for the no-Animated
   * build explicitly. Default: `true`.
   */
  rnwLite?: boolean | "without-animated";

  /**
   * Alias `react-native-svg` to `@tamagui/react-native-svg`. Default: `true`.
   */
  svg?: boolean;

  /**
   * Disable static extraction entirely (useful for debugging). Default: off.
   */
  disableExtraction?: boolean;

  /**
   * Additional `optimizeDeps.include` entries. Merged after defaults.
   */
  optimizeDepsInclude?: string[];
}

/**
 * Compose the Tamagui Vite plugin plus Superstyling-specific dev-server
 * optimizations. Returns an array that can be spread into `vite.config.ts`'s
 * `plugins`.
 *
 * Example:
 * ```ts
 * import { superstylingVitePlugin } from "@superstyling/vite";
 * export default defineConfig({
 *   plugins: [superstylingVitePlugin({ config: "./tamagui.config.ts" })],
 * });
 * ```
 */
export function superstylingVitePlugin(options: SuperStylingVitePluginOptions): PluginOption[] {
  const {
    config,
    components = ["tamagui"],
    platform = "web",
    rnwLite = true,
    svg = true,
    disableExtraction,
    optimizeDepsInclude = [],
  } = options;

  const tamaguiPluginInstance = tamaguiPlugin({
    config,
    components,
    platform,
    disableExtraction,
  });

  // Dev-server hints: pre-bundle react-native-web (or the Tamagui lite
  // version) so Vite's dep-optimizer doesn't hot-load it on first navigation.
  const rnwTarget =
    rnwLite === true || rnwLite === "without-animated"
      ? "@tamagui/react-native-web-lite"
      : "react-native-web";

  const devDepsPlugin: Plugin = {
    name: "superstyling:vite:dev-deps",
    config() {
      return {
        optimizeDeps: {
          include: [rnwTarget, "tamagui", ...components, ...optimizeDepsInclude],
        },
        // Keep our own source out of SSR-externalization so HMR works on
        // SuperStylingProvider changes.
        ssr: {
          noExternal: ["@superstyling/core", "@superstyling/icons"],
        },
      };
    },
  };

  // Single aliases plugin so ordering is predictable (Tamagui's rnw aliases
  // must win over any npm-installed `react-native-web`).
  const aliasEntries = tamaguiAliases({ rnwLite, svg });
  const aliasPlugin: Plugin = {
    name: "superstyling:vite:aliases",
    config() {
      return { resolve: { alias: aliasEntries } };
    },
  };

  return [aliasPlugin, devDepsPlugin, tamaguiPluginInstance];
}

// ────────────────────────────────────────────────────────────────────────
// Alias helper (re-export for manual ordering)

export { tamaguiAliases as superstylingAliases } from "@tamagui/vite-plugin";

// ────────────────────────────────────────────────────────────────────────
// FOUC-prevention script

export interface ColorModeScriptOptions {
  /** localStorage key the script reads. Defaults to `@superstyling/core`'s key. */
  storageKey?: string;
  /** Also read from cookie (for SSR consistency). Default: `false`. */
  cookie?: boolean;
  /** Fallback when nothing is persisted. Default: `"light"`. */
  initialMode?: InitialColorMode;
}

/**
 * Returns the blocking `<script>` HTML to inline in your `index.html` before
 * any CSS/JS so the `<html>` root has the right color-mode class before
 * paint. Eliminates FOUC on color-mode-aware themes.
 *
 * Usage:
 * ```html
 * <head>
 *   <!--SUPERSTYLING-COLOR-MODE-SCRIPT-->
 * </head>
 * ```
 * Then in `vite.config.ts`, use `transformIndexHtml` or a plugin to replace
 * the marker with `colorModeScriptSnippet()`. Or paste the output statically.
 */
export function colorModeScriptSnippet(options: ColorModeScriptOptions = {}): string {
  const { storageKey = DEFAULT_STORAGE_KEY, initialMode = "light" } = options;
  // `cookie` option is accepted for forward-compatibility with the Next SSR
  // path; the pure-browser build script reads localStorage only.
  const body = buildColorModeScript(initialMode, storageKey);
  return `<script>${body}</script>`;
}

export { DEFAULT_STORAGE_KEY } from "@superstyling/core";
