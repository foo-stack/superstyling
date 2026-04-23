import type { ComponentOverride, ThemeComponents, ThemeInput } from "./types";

/**
 * adaptChakraTheme — convert a Chakra v2 `extendTheme(...)` output into a
 * Superstyling `ThemeInput`. Most fields pass through unchanged because
 * the two theme shapes are deliberately compatible. Fields that have no
 * Superstyling equivalent are dropped with a warning recorded in the
 * `warnings` array (and logged to the console once per call).
 *
 *   import { extendTheme } from "@chakra-ui/react";
 *   import { adaptChakraTheme, createSystem } from "@superstyling/core";
 *
 *   const chakraTheme = extendTheme({ colors: { brand: {…} }, components: {…} });
 *   const { theme, warnings } = adaptChakraTheme(chakraTheme);
 *   const system = createSystem(theme);
 *
 * Known gaps (collected in `warnings`):
 *   - `styles.global` — no global CSS surface yet (use a CSS file)
 *   - `layerStyles` / `textStyles` — deferred; flatten into `components.*.variants` manually
 *   - Function-valued `baseStyle` / `sizes` / `variants` — rely on Chakra's
 *     `StyleFunctionProps` runtime (`colorMode`, `theme`, …) which we don't
 *     implement. The adapter skips these and flags the path.
 *   - `cssVar` / `mode()` helpers — not resolved; caller must hand-convert.
 */

export interface ChakraThemeLike {
  colors?: Record<string, unknown>;
  space?: Record<string, unknown>;
  sizes?: Record<string, unknown>;
  fonts?: Record<string, unknown>;
  fontSizes?: Record<string, unknown>;
  fontWeights?: Record<string, unknown>;
  lineHeights?: Record<string, unknown>;
  letterSpacings?: Record<string, unknown>;
  radii?: Record<string, unknown>;
  shadows?: Record<string, unknown>;
  zIndices?: Record<string, unknown>;
  breakpoints?: Record<string, unknown>;
  semanticTokens?: Record<string, unknown>;
  components?: Record<string, unknown>;
  config?: Record<string, unknown>;
  styles?: { global?: unknown };
  layerStyles?: Record<string, unknown>;
  textStyles?: Record<string, unknown>;
  [extraKey: string]: unknown;
}

export interface AdaptChakraThemeResult {
  theme: ThemeInput;
  warnings: string[];
}

export interface AdaptChakraThemeOptions {
  /** Print warnings to console.warn. Default `true`. */
  logWarnings?: boolean;
}

export function adaptChakraTheme(
  chakra: ChakraThemeLike,
  options: AdaptChakraThemeOptions = {},
): AdaptChakraThemeResult {
  const { logWarnings = true } = options;
  const warnings: string[] = [];

  if (chakra.styles?.global) {
    warnings.push(
      "`styles.global` is not supported — apply app-wide CSS via a stylesheet or <SuperStylingProvider> body styles.",
    );
  }
  if (chakra.layerStyles) {
    warnings.push(
      "`layerStyles` is not supported — flatten into `components.<Name>.variants` or inline the styles on usage.",
    );
  }
  if (chakra.textStyles) {
    warnings.push(
      "`textStyles` is not supported — inline the typography props or add a `Text` variant.",
    );
  }

  const components = chakra.components
    ? adaptComponents(chakra.components as Record<string, unknown>, warnings)
    : undefined;

  const theme: ThemeInput = {
    colors: chakra.colors as ThemeInput["colors"],
    space: chakra.space as ThemeInput["space"],
    sizes: chakra.sizes as ThemeInput["sizes"],
    fonts: chakra.fonts as ThemeInput["fonts"],
    fontSizes: chakra.fontSizes as ThemeInput["fontSizes"],
    fontWeights: chakra.fontWeights as ThemeInput["fontWeights"],
    lineHeights: chakra.lineHeights as ThemeInput["lineHeights"],
    letterSpacings: chakra.letterSpacings as ThemeInput["letterSpacings"],
    radii: chakra.radii as ThemeInput["radii"],
    shadows: chakra.shadows as ThemeInput["shadows"],
    zIndices: chakra.zIndices as ThemeInput["zIndices"],
    breakpoints: chakra.breakpoints as ThemeInput["breakpoints"],
    semanticTokens: chakra.semanticTokens as ThemeInput["semanticTokens"],
    components,
    config: chakra.config as ThemeInput["config"],
  };

  // Drop undefined top-level keys so merge with defaults is cleaner.
  for (const key of Object.keys(theme) as (keyof ThemeInput)[]) {
    if (theme[key] === undefined) delete theme[key];
  }

  if (logWarnings && warnings.length > 0 && typeof console !== "undefined") {
    // eslint-disable-next-line no-console
    console.warn(
      `[superstyling] adaptChakraTheme: ${warnings.length} unsupported field(s) dropped. See \`warnings\` for details.`,
    );
  }

  return { theme, warnings };
}

function adaptComponents(components: Record<string, unknown>, warnings: string[]): ThemeComponents {
  const out: ThemeComponents = {};
  for (const [name, raw] of Object.entries(components)) {
    if (!raw || typeof raw !== "object") continue;
    const cfg = raw as Record<string, unknown>;
    const override: ComponentOverride = {};

    override.baseStyle = adaptStyleSlot(cfg.baseStyle, name, "baseStyle", warnings);
    override.sizes = adaptStyleMap(cfg.sizes, name, "sizes", warnings);
    override.variants = adaptStyleMap(cfg.variants, name, "variants", warnings);
    override.defaultProps = cfg.defaultProps as ComponentOverride["defaultProps"];

    // Drop empty fields so merge logic sees undefined, not {}.
    if (!override.baseStyle) delete override.baseStyle;
    if (!override.sizes) delete override.sizes;
    if (!override.variants) delete override.variants;
    if (!override.defaultProps) delete override.defaultProps;

    if (Object.keys(override).length > 0) out[name] = override;
  }
  return out;
}

function adaptStyleSlot(
  value: unknown,
  componentName: string,
  slot: string,
  warnings: string[],
): Record<string, unknown> | undefined {
  if (value == null) return undefined;
  if (typeof value === "function") {
    warnings.push(
      `components.${componentName}.${slot} is a function (StyleFunctionProps) — skipped. Convert to a static object to migrate.`,
    );
    return undefined;
  }
  if (typeof value === "object") return value as Record<string, unknown>;
  return undefined;
}

function adaptStyleMap(
  value: unknown,
  componentName: string,
  slot: "sizes" | "variants",
  warnings: string[],
): Record<string, Record<string, unknown>> | undefined {
  if (value == null) return undefined;
  if (typeof value !== "object") return undefined;
  const map = value as Record<string, unknown>;
  const out: Record<string, Record<string, unknown>> = {};
  for (const [key, entry] of Object.entries(map)) {
    const adapted = adaptStyleSlot(entry, componentName, `${slot}.${key}`, warnings);
    if (adapted) out[key] = adapted;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}
