import type {
  Theme,
  ThemeBreakpoints,
  ThemeFontSizes,
  ThemeFontWeights,
  ThemeFonts,
  ThemeInput,
  ThemeLetterSpacings,
  ThemeLineHeights,
  ThemeRadii,
  ThemeShadows,
  ThemeSizes,
  ThemeSpace,
  ThemeZIndices,
} from "./types";
import { defaultTheme, defaultConfig } from "./default";

/**
 * Merge user `ThemeInput` onto `defaultTheme`.
 *
 * Merge depth is two levels: each top-level category (colors, space, …) is
 * shallow-merged, so users can override individual entries without losing the
 * rest of the default. Inside a color scale, shades are also shallow-merged
 * so `{ colors: { blue: { 500: '#xxx' } } }` only replaces the 500 shade.
 *
 * Runtime guarantee: since `defaultTheme` always provides every required key,
 * spreading it first means the result always satisfies the strict `Theme`
 * types. TypeScript can't prove this through generic index signatures, so we
 * cast at the seam.
 */
export function mergeTheme(input: ThemeInput = {}): Theme {
  return {
    colors: mergeColors(input.colors),
    space: { ...defaultTheme.space, ...input.space } as ThemeSpace,
    sizes: { ...defaultTheme.sizes, ...input.sizes } as ThemeSizes,
    fonts: { ...defaultTheme.fonts, ...input.fonts } as ThemeFonts,
    fontSizes: { ...defaultTheme.fontSizes, ...input.fontSizes } as ThemeFontSizes,
    fontWeights: {
      ...defaultTheme.fontWeights,
      ...input.fontWeights,
    } as ThemeFontWeights,
    lineHeights: {
      ...defaultTheme.lineHeights,
      ...input.lineHeights,
    } as ThemeLineHeights,
    letterSpacings: {
      ...defaultTheme.letterSpacings,
      ...input.letterSpacings,
    } as ThemeLetterSpacings,
    radii: { ...defaultTheme.radii, ...input.radii } as ThemeRadii,
    shadows: { ...defaultTheme.shadows, ...input.shadows } as ThemeShadows,
    zIndices: { ...defaultTheme.zIndices, ...input.zIndices } as ThemeZIndices,
    breakpoints: {
      ...defaultTheme.breakpoints,
      ...input.breakpoints,
    } as ThemeBreakpoints,
    semanticTokens: mergeSemanticTokens(input.semanticTokens),
    components: { ...defaultTheme.components, ...input.components },
    config: { ...defaultConfig, ...input.config },
  };
}

function mergeColors(input: ThemeInput["colors"]): Theme["colors"] {
  if (!input) return defaultTheme.colors;
  const merged: Record<string, unknown> = { ...defaultTheme.colors };
  for (const [name, value] of Object.entries(input)) {
    const existing = merged[name];
    if (existing && typeof existing === "object" && value && typeof value === "object") {
      merged[name] = {
        ...(existing as Record<string, string>),
        ...(value as Record<string, string>),
      };
    } else if (value !== undefined) {
      merged[name] = value;
    }
  }
  return merged as Theme["colors"];
}

function mergeSemanticTokens(input: ThemeInput["semanticTokens"]): Theme["semanticTokens"] {
  if (!input) return defaultTheme.semanticTokens;
  return {
    ...defaultTheme.semanticTokens,
    ...input,
    colors: {
      ...defaultTheme.semanticTokens.colors,
      ...input.colors,
    },
  };
}
