/**
 * `@superstyling/expo/metro-config` — Metro config helper.
 *
 * Usage in `metro.config.js`:
 * ```js
 * const { getDefaultConfig } = require("expo/metro-config");
 * const { withSuperStylingMetro } = require("@superstyling/expo/metro-config");
 *
 * const config = getDefaultConfig(__dirname, { isCSSEnabled: true });
 * module.exports = withSuperStylingMetro(config, {
 *   projectRoot: __dirname,
 *   config: "./tamagui.config.ts",
 * });
 * ```
 *
 * What it does:
 *   1. Sets Superstyling-recommended resolver/transformer flags:
 *      - `resolver.unstable_enableSymlinks` (monorepos / workspaces)
 *      - `resolver.unstable_enablePackageExports` (required for Tamagui v2
 *        subpath exports like `@tamagui/native/setup-*`)
 *      - `transformer.unstable_allowRequireContext` (Expo Router + Tamagui
 *        theme-set splitting)
 *   2. Composes `@tamagui/metro-plugin`'s `withTamagui(config, options)` on
 *      top so Tamagui's Metro transformer loads, CSS generation is wired,
 *      and the extractor sees your `tamagui.config.ts`.
 *
 * Pass `config: undefined` to skip the Tamagui composition and just apply
 * the flag tweaks (useful when you're wiring Tamagui's transformer yourself).
 */

import { withTamagui } from "@tamagui/metro-plugin";

// Metro's types aren't stable across versions; keep the surface loose.
// oxlint-disable-next-line typescript/no-explicit-any
export type MetroConfig = any;

export interface SuperStylingMetroOptions {
  /** Absolute path to the Expo project root. Required. */
  projectRoot: string;

  /**
   * Path to `tamagui.config.ts`. When set (the normal case), the returned
   * Metro config is composed with `@tamagui/metro-plugin`'s `withTamagui`.
   * When `undefined`, only the flag tweaks are applied.
   */
  config?: string;

  /**
   * Module paths Tamagui should traverse during extraction.
   * Defaults to `["tamagui"]`. Forwarded to `@tamagui/metro-plugin`.
   */
  components?: string[];

  /**
   * Enable `require.context` (Metro experimental). Expo Router, Tamagui's
   * theme-set splitting, and a few Superstyling theme features rely on it.
   * Default: `true`.
   */
  unstable_allowRequireContext?: boolean;

  /**
   * Enable package-exports resolution. Required for Tamagui v2's subpath
   * exports (`@tamagui/native/setup-*`). Default: `true`.
   */
  unstable_enablePackageExports?: boolean;

  /**
   * Enable symlink resolution. Yarn workspaces and pnpm need this.
   * Default: `true`.
   */
  unstable_enableSymlinks?: boolean;
}

/**
 * Returns a new Metro config with Superstyling's defaults merged in, then
 * composed with `@tamagui/metro-plugin`'s `withTamagui`. Does not mutate the
 * input.
 */
export function withSuperStylingMetro(
  config: MetroConfig,
  options: SuperStylingMetroOptions,
): MetroConfig {
  const {
    config: tamaguiConfigPath,
    components = ["tamagui"],
    unstable_allowRequireContext = true,
    unstable_enablePackageExports = true,
    unstable_enableSymlinks = true,
  } = options;

  const withFlags: MetroConfig = {
    ...config,
    resolver: {
      ...config.resolver,
      unstable_enableSymlinks,
      unstable_enablePackageExports,
    },
    transformer: {
      ...config.transformer,
      unstable_allowRequireContext,
    },
  };

  if (!tamaguiConfigPath) return withFlags;

  return withTamagui(withFlags, {
    config: tamaguiConfigPath,
    components,
  });
}
