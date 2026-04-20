/**
 * Theme types — Chakra-shaped, Tamagui-backed.
 *
 * The user's theme input is a Chakra-shaped object (see PLAN.md §3.7 / Q19).
 * At `createSystem()` time we translate it into Tamagui's `createTamagui` config.
 *
 * This file defines the *input* shape users write. The *output* (a Tamagui
 * config) lives behind `System` in createSystem.ts.
 */

/** A Chakra-style 50 → 950 color scale, keys are string digits. */
export type ColorScale = Record<
  "50" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | "950",
  string
>;

/** Alpha scale used for `blackAlpha` / `whiteAlpha`. */
export type AlphaScale = Record<
  "50" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900",
  string
>;

/** Colors map — user may add their own scales. */
export interface ThemeColors {
  transparent: string;
  current: string;
  black: string;
  white: string;
  whiteAlpha: AlphaScale;
  blackAlpha: AlphaScale;
  gray: ColorScale;
  red: ColorScale;
  orange: ColorScale;
  yellow: ColorScale;
  green: ColorScale;
  teal: ColorScale;
  blue: ColorScale;
  cyan: ColorScale;
  purple: ColorScale;
  pink: ColorScale;
  [custom: string]: string | ColorScale | AlphaScale;
}

/** Chakra's space/sizing scale keys. */
export type SpaceKey =
  | "px"
  | "0"
  | "0.5"
  | "1"
  | "1.5"
  | "2"
  | "2.5"
  | "3"
  | "3.5"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "12"
  | "14"
  | "16"
  | "20"
  | "24"
  | "28"
  | "32"
  | "36"
  | "40"
  | "44"
  | "48"
  | "52"
  | "56"
  | "60"
  | "64"
  | "72"
  | "80"
  | "96";

export type ThemeSpace = Record<SpaceKey, string>;

export interface ThemeSizes extends Partial<ThemeSpace> {
  max?: string;
  min?: string;
  full?: string;
  "3xs"?: string;
  "2xs"?: string;
  xs?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  "2xl"?: string;
  "3xl"?: string;
  "4xl"?: string;
  "5xl"?: string;
  "6xl"?: string;
  "7xl"?: string;
  "8xl"?: string;
  container?: { sm: string; md: string; lg: string; xl: string };
  [custom: string]: unknown;
}

export interface ThemeFonts {
  body: string;
  heading: string;
  mono: string;
  [custom: string]: string;
}

export interface ThemeFontSizes {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  "3xl": string;
  "4xl": string;
  "5xl": string;
  "6xl": string;
  "7xl": string;
  "8xl": string;
  "9xl": string;
  [custom: string]: string;
}

export interface ThemeFontWeights {
  hairline: number;
  thin: number;
  light: number;
  normal: number;
  medium: number;
  semibold: number;
  bold: number;
  extrabold: number;
  black: number;
  [custom: string]: number;
}

export interface ThemeLineHeights {
  normal: string | number;
  none: number;
  shorter: number;
  short: number;
  base: number;
  tall: number;
  taller: string | number;
  [custom: string]: string | number;
}

export interface ThemeLetterSpacings {
  tighter: string;
  tight: string;
  normal: string;
  wide: string;
  wider: string;
  widest: string;
  [custom: string]: string;
}

export interface ThemeRadii {
  none: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  "3xl": string;
  full: string;
  [custom: string]: string;
}

export interface ThemeShadows {
  xs: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  outline: string;
  inner: string;
  dark_lg: string;
  none: string;
  [custom: string]: string;
}

export interface ThemeZIndices {
  hide: number;
  auto: string;
  base: number;
  docked: number;
  dropdown: number;
  sticky: number;
  banner: number;
  overlay: number;
  modal: number;
  popover: number;
  skipLink: number;
  toast: number;
  tooltip: number;
  [custom: string]: string | number;
}

/** Chakra-style breakpoints. Keys: base, sm, md, lg, xl, 2xl. Values in `em`. */
export interface ThemeBreakpoints {
  base: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  [custom: string]: string;
}

/**
 * Semantic tokens resolve per color mode.
 * Values are either literal strings (raw colors) or dotted references into
 * `theme.colors` (e.g., `'gray.900'`).
 *
 * Per PLAN.md §3.7: we resolve token references to raw values at
 * `createSystem()` time; the runtime sees only concrete values.
 */
export interface SemanticTokenValue {
  default: string;
  _dark?: string;
  _light?: string;
  [mode: string]: string | undefined;
}

export interface ThemeSemanticTokens {
  colors?: Record<string, SemanticTokenValue>;
  [category: string]: Record<string, SemanticTokenValue> | undefined;
}

export type InitialColorMode = "light" | "dark" | "system";

export interface ThemeConfig {
  /** Initial color mode when no user preference is stored. Default: 'light'. */
  initialColorMode?: InitialColorMode;
  /**
   * When true, the app reacts to OS color-scheme changes after initial load.
   * When false, only explicit toggles via `useColorMode` change the mode.
   */
  useSystemColorMode?: boolean;
  /** CSS variable prefix used for generated tokens on web. Default: 'ss'. */
  cssVarPrefix?: string;
}

/**
 * A per-component override in the Chakra shape (Q23).
 *   - `baseStyle`: always-on styles merged into every instance
 *   - `sizes`: mapping from `size` prop value → style object
 *   - `variants`: mapping from `variant` prop value → style object
 *   - `defaultProps`: props applied unless the user sets them explicitly
 *
 * At `createSystem()` time these are bound into each primitive via a thin
 * React wrapper. A future Babel plugin (PLAN.md §9) can expand this at build
 * time into Tamagui `styled()` calls for compile-time extraction.
 */
export interface ComponentOverride {
  baseStyle?: Record<string, unknown>;
  sizes?: Record<string, Record<string, unknown>>;
  variants?: Record<string, Record<string, unknown>>;
  defaultProps?: Record<string, unknown>;
}

/**
 * Theme-level per-component overrides. Keyed by primitive name; custom
 * component keys are allowed for user-authored components that wire through
 * `bindComponent()` themselves.
 */
export interface ThemeComponents {
  Box?: ComponentOverride;
  Stack?: ComponentOverride;
  HStack?: ComponentOverride;
  VStack?: ComponentOverride;
  Text?: ComponentOverride;
  Heading?: ComponentOverride;
  [customComponent: string]: ComponentOverride | undefined;
}

/**
 * The full Chakra-shaped theme input that users pass to `createSystem()`.
 * Every field is optional; omitted fields inherit from the default theme.
 */
export interface ThemeInput {
  colors?: Partial<ThemeColors>;
  space?: Partial<ThemeSpace>;
  sizes?: Partial<ThemeSizes>;
  fonts?: Partial<ThemeFonts>;
  fontSizes?: Partial<ThemeFontSizes>;
  fontWeights?: Partial<ThemeFontWeights>;
  lineHeights?: Partial<ThemeLineHeights>;
  letterSpacings?: Partial<ThemeLetterSpacings>;
  radii?: Partial<ThemeRadii>;
  shadows?: Partial<ThemeShadows>;
  zIndices?: Partial<ThemeZIndices>;
  breakpoints?: Partial<ThemeBreakpoints>;
  semanticTokens?: ThemeSemanticTokens;
  components?: ThemeComponents;
  config?: ThemeConfig;
}

/** The fully-resolved theme after merging user input onto defaults. */
export interface Theme {
  colors: ThemeColors;
  space: ThemeSpace;
  sizes: ThemeSizes;
  fonts: ThemeFonts;
  fontSizes: ThemeFontSizes;
  fontWeights: ThemeFontWeights;
  lineHeights: ThemeLineHeights;
  letterSpacings: ThemeLetterSpacings;
  radii: ThemeRadii;
  shadows: ThemeShadows;
  zIndices: ThemeZIndices;
  breakpoints: ThemeBreakpoints;
  semanticTokens: ThemeSemanticTokens;
  components: ThemeComponents;
  config: Required<ThemeConfig>;
}

/**
 * Users extend this interface via declaration merging to get typed access to
 * their own theme tokens in style props. See PLAN.md Q18.
 *
 * Default state is empty; `createSystem` types still work without augmentation.
 */
export interface SuperStylingCustomTheme {
  // Intentionally empty — augmented by users.
}
