/**
 * `@superstyling/expo` — Expo integration (barrel + type re-exports).
 *
 * The six subpath entries are the real surface:
 *
 * | entry                              | what it does                              |
 * | ---------------------------------- | ----------------------------------------- |
 * | `@superstyling/expo/setup`         | Side-effect import: required native setup |
 * | `@superstyling/expo/setup-all`     | Side-effect import: setup + optionals     |
 * | `@superstyling/expo/babel-plugin`  | `babelPreset()` helper for babel.config   |
 * | `@superstyling/expo/metro-config`  | `withSuperStylingMetro(config)` helper    |
 * | `@superstyling/expo/app-plugin`    | Expo config plugin (default export)       |
 *
 * This barrel only re-exports the non-side-effect helpers so users who want
 * a single import can still access `babelPreset`, `withSuperStylingMetro`,
 * and the config plugin without pulling in the setup side-effects.
 */

export { babelPreset, type BabelPresetOptions } from "./babel-plugin";
export { withSuperStylingMetro, type SuperStylingMetroOptions } from "./metro-config";
export { default as withSuperStyling } from "./app-plugin";
