export { SuperStylingProvider, type SuperStylingProviderProps } from "./SuperStylingProvider";
export { createSystem, defaultSystem, type System } from "./createSystem";

// Style engine
export { chakraShortcuts, type ChakraShortcutMap, type ChakraShortcutName } from "./shortcuts";
export {
  pseudoPropMap,
  crossPlatformPseudoPropMap,
  webOnlyPseudoPropMap,
  ariaStatePseudoPropMap,
  type PseudoPropName,
} from "./pseudoProps";
export { translateProps, type TranslateOptions } from "./translateProps";

// Color mode
export {
  ColorModeProvider,
  useColorMode,
  useColorModeValue,
  ColorModeScript,
  buildColorModeScript,
  createWebStorage,
  DEFAULT_STORAGE_KEY,
  type ColorModeProviderProps,
  type ColorModeScriptProps,
  type ColorMode,
  type ColorModeContextValue,
  type ColorModeStorage,
  type SystemSchemeWatcher,
} from "./colorMode";

// Theme API
export {
  defaultTheme,
  mergeTheme,
  resolveTheme,
  buildColorTokens,
  buildThemes,
  buildColorSchemeThemes,
  buildMediaQueries,
  resolveColorReference,
  type Theme,
  type ThemeInput,
  type ThemeColors,
  type ThemeSpace,
  type ThemeSizes,
  type ThemeFonts,
  type ThemeFontSizes,
  type ThemeFontWeights,
  type ThemeLineHeights,
  type ThemeLetterSpacings,
  type ThemeRadii,
  type ThemeShadows,
  type ThemeZIndices,
  type ThemeBreakpoints,
  type ThemeSemanticTokens,
  type ThemeConfig,
  type ColorScale,
  type AlphaScale,
  type SemanticTokenValue,
  type InitialColorMode,
  type SuperStylingCustomTheme,
  type ResolvedTamaguiInput,
  type SpaceKey,
} from "./theme";

// Primitives (authored in P2.5 with Chakra-shaped pseudo/sx/responsive props)
export {
  Box,
  Stack,
  HStack,
  VStack,
  Text,
  Heading,
  type BoxProps,
  type StackProps,
  type StackDirection,
  type TextProps,
  type HeadingProps,
  type HeadingLevel,
} from "./components";

// Breakpoint context (for custom components that want theme-aware responsive parsing)
export { BreakpointProvider, useBreakpointNames } from "./system/BreakpointContext";

// Overlay registry
export {
  OverlayRegistryProvider,
  useOverlayRegistry,
  type OverlayRegistryProviderProps,
  type OverlayRegistryAPI,
  type RegisteredOverlay,
} from "./overlay";

// Direct Tamagui re-exports retained for users who want the unwrapped primitives.
export { XStack, YStack, H1, H2, H3, H4, H5, H6 } from "tamagui";
