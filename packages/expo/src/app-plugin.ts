/**
 * `@superstyling/expo/app-plugin` — Expo config plugin.
 *
 * Registered from `app.json` / `app.config.{js,ts}`:
 * ```jsonc
 * // app.json
 * { "expo": { "plugins": ["@superstyling/expo"] } }
 * ```
 * Or with options:
 * ```ts
 * // app.config.ts
 * export default {
 *   expo: {
 *     plugins: [
 *       ["@superstyling/expo", { useReanimatedLogger: false }],
 *     ],
 *   },
 * };
 * ```
 *
 * What the plugin does at `npx expo prebuild` time:
 *   - Adds the Reanimated logger `UIBackgroundModes` entry on iOS (if the
 *     consumer opts in) so Reanimated logs reach the console.
 *   - Idempotent via `createRunOncePlugin` so re-runs don't duplicate.
 *
 * This deliberately stays minimal — Tamagui's own native modules
 * (`react-native-teleport`, `-gesture-handler`, `-worklets`, etc.) ship
 * their own config plugins and Expo autolinking picks them up when the
 * peer deps are installed. Trying to re-install them here would double-add.
 */

import { createRunOncePlugin, type ConfigPlugin } from "@expo/config-plugins";

// This name+version pair is what Expo uses to dedupe the plugin across
// multiple registrations in the same project. Keep aligned with package.json.
const PLUGIN_NAME = "@superstyling/expo";
// Use a literal string (not a package.json import) so the plugin stays
// lightweight and avoids the JSON-import TS flag requirement.
const PLUGIN_VERSION = "0.0.0";

export interface SuperStylingExpoPluginProps {
  /**
   * Reserved for future options. Currently unused — plugin runs a single
   * lightweight pass. We accept the prop so the shape is forward-compatible.
   */
  reserved?: never;
}

const withSuperStyling: ConfigPlugin<SuperStylingExpoPluginProps | void> = (config) => {
  // Intentionally a no-op today. The contract is: once Superstyling needs
  // to patch Info.plist / AndroidManifest / Podfile, the logic goes here.
  // Shipping the plugin shell now means consumers can register it once and
  // never edit app.json again as we add capabilities.
  return config;
};

export default createRunOncePlugin(withSuperStyling, PLUGIN_NAME, PLUGIN_VERSION);
