/**
 * `@superstyling/expo/babel-plugin` — babel.config helper.
 *
 * Usage in `babel.config.js`:
 * ```js
 * const { babelPreset } = require("@superstyling/expo/babel-plugin");
 * module.exports = (api) => {
 *   api.cache(true);
 *   return {
 *     presets: ["babel-preset-expo"],
 *     plugins: babelPreset({ config: "./tamagui.config.ts" }),
 *   };
 * };
 * ```
 *
 * Returns a Babel plugin array in the correct order:
 *   1. `@tamagui/babel-plugin` — compile-time style extraction + flattening.
 *   2. `react-native-worklets/plugin` — MUST be last per Reanimated/Worklets
 *      docs; transforms `'worklet'` directives. We only append it if the
 *      caller doesn't already include it.
 *
 * The user's `plugins` array can be concatenated with this return value.
 */

export interface BabelPresetOptions {
  /** Path to `tamagui.config.ts`. Required. */
  config: string;

  /**
   * Module paths Tamagui should traverse during extraction.
   * Defaults to `["tamagui"]`.
   */
  components?: string[];

  /**
   * Disable static extraction entirely (debug builds). Default: off.
   */
  disableExtraction?: boolean;

  /**
   * If `true`, append `react-native-worklets/plugin` at the end. Default:
   * `true`. Set to `false` if you're adding it yourself (e.g., with custom
   * options) so it isn't listed twice.
   */
  includeWorkletsPlugin?: boolean;
}

/**
 * Builds the Superstyling-recommended Babel plugin list. Spread this into
 * your `babel.config.js` `plugins` array — order is preserved.
 */
// oxlint-disable-next-line typescript/no-explicit-any
export function babelPreset(options: BabelPresetOptions): any[] {
  const {
    config,
    components = ["tamagui"],
    disableExtraction,
    includeWorkletsPlugin = true,
  } = options;

  // oxlint-disable-next-line typescript/no-explicit-any
  const plugins: any[] = [
    [
      "@tamagui/babel-plugin",
      {
        config,
        components,
        disableExtraction,
      },
    ],
  ];

  if (includeWorkletsPlugin) {
    // Must be last. If the user's other plugins include transformations that
    // produce new `'worklet'` directives, the worklets plugin needs to see
    // the fully-transformed AST.
    plugins.push("react-native-worklets/plugin");
  }

  return plugins;
}
