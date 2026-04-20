/**
 * Token resolver: Chakra-shaped `Theme` → Tamagui `createTamagui` input.
 *
 * This is the core of P2.1. Every layer above (createSystem, SuperStylingProvider,
 * components) depends on the Tamagui config this module produces.
 *
 * Translation rules (per PLAN.md §3.7):
 *   - `colors.blue.500` → Tamagui tokens.color.`blue.500` (dots preserved — Tamagui
 *     accepts them; they become `$blue.500` at the call site).
 *   - `space['4']` → tokens.space.`4`.
 *   - `semanticTokens.colors.background.{default,_dark}` → Tamagui `themes.light.background`
 *     and `themes.dark.background`, with token references like `'gray.900'` resolved
 *     to the raw color value at this point in time.
 *   - `breakpoints.sm` → Tamagui `media.sm` as `{ minWidth: <px> }` (em → px conversion
 *     at 16px base).
 */
import type { Theme, ColorScale, AlphaScale, SemanticTokenValue } from "./types";

const EM_PX = 16;

/** Flatten a color scale into `{ "<name>.<shade>": value }` entries. */
function flattenColorScale(
  name: string,
  scale: ColorScale | AlphaScale | string,
  out: Record<string, string>,
): void {
  if (typeof scale === "string") {
    out[name] = scale;
    return;
  }
  for (const [shade, value] of Object.entries(scale)) {
    out[`${name}.${shade}`] = value;
  }
}

/** Build Tamagui `tokens.color` from theme.colors. */
export function buildColorTokens(colors: Theme["colors"]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [name, value] of Object.entries(colors)) {
    flattenColorScale(name, value as ColorScale | AlphaScale | string, out);
  }
  return out;
}

/** Convert an `em` string like `"30em"` or `"1.5em"` to a pixel number. */
function emToPx(emValue: string): number {
  const n = Number.parseFloat(emValue);
  if (Number.isNaN(n)) {
    throw new Error(`[superstyling] invalid em value: "${emValue}"`);
  }
  return Math.round(n * EM_PX);
}

/**
 * Resolve a semantic-token value (which may reference `theme.colors` via
 * dotted path like `"gray.900"`) to a raw color string.
 * Returns the input unchanged if it's already a raw value.
 */
export function resolveColorReference(reference: string, colors: Theme["colors"]): string {
  if (!reference.includes(".")) {
    // Either a direct color name (`"white"`, `"black"`) or a raw CSS value.
    const top = colors[reference];
    if (typeof top === "string") return top;
    return reference;
  }
  const [scaleName, shade] = reference.split(".");
  if (!scaleName || !shade) return reference;
  const scale = colors[scaleName];
  if (!scale || typeof scale === "string") return reference;
  const value = (scale as Record<string, string>)[shade];
  return typeof value === "string" ? value : reference;
}

/** Build Tamagui `themes` (light, dark, ...) from theme.semanticTokens. */
export function buildThemes(
  semanticTokens: Theme["semanticTokens"],
  colors: Theme["colors"],
): Record<string, Record<string, string>> {
  const colorTokens = semanticTokens.colors ?? {};
  const modes = collectModes(colorTokens);
  const themes: Record<string, Record<string, string>> = {};

  for (const mode of modes) {
    const flatTheme: Record<string, string> = {};
    for (const [name, value] of Object.entries(colorTokens)) {
      const raw = pickValueForMode(value, mode);
      flatTheme[name] = resolveColorReference(raw, colors);
    }
    themes[mode] = flatTheme;
  }

  return themes;
}

/**
 * Per-colorScheme shade mapping for the semantic `primary*` tokens. Values are
 * shade numbers into the color scale (e.g., `"500"`). Light and dark modes use
 * different shades so a `colorScheme` reads well against each background.
 */
const COLOR_SCHEME_SHADES = {
  light: {
    primary: "500",
    primaryHover: "600",
    primaryActive: "700",
    primaryMuted: "50",
    primaryContrast: "white",
    primaryBorder: "500",
  },
  dark: {
    primary: "400",
    primaryHover: "300",
    primaryActive: "500",
    primaryMuted: "900",
    primaryContrast: "gray.900",
    primaryBorder: "400",
  },
} as const;

/**
 * Build per-colorScheme themes from every color scale in `theme.colors`.
 *
 * Per Q22 (PLAN.md §3.7): `<Button colorScheme="blue">` is sugar for wrapping
 * the component's internals in `<Theme name="blue">`, which swaps the
 * `$primary*` semantic tokens to shades of the scheme's scale.
 *
 * For each scale (e.g., `blue`) we emit three themes:
 *   - `blue` — standalone (used when no mode context is present)
 *   - `light_blue` — nested under `<Theme name="light">`
 *   - `dark_blue` — nested under `<Theme name="dark">`
 *
 * Tamagui's nested theme resolution picks the right one automatically.
 */
export function buildColorSchemeThemes(
  colors: Theme["colors"],
): Record<string, Record<string, string>> {
  const out: Record<string, Record<string, string>> = {};

  for (const [scaleName, value] of Object.entries(colors)) {
    if (typeof value !== "object" || value === null) continue;
    const scale = value as Record<string, string>;

    const lightTheme = buildSchemeTheme(scale, colors, "light");
    const darkTheme = buildSchemeTheme(scale, colors, "dark");

    out[scaleName] = lightTheme;
    out[`light_${scaleName}`] = lightTheme;
    out[`dark_${scaleName}`] = darkTheme;
  }

  return out;
}

function buildSchemeTheme(
  scale: Record<string, string>,
  colors: Theme["colors"],
  mode: "light" | "dark",
): Record<string, string> {
  const mapping = COLOR_SCHEME_SHADES[mode];
  const theme: Record<string, string> = {};
  for (const [tokenName, shadeOrRef] of Object.entries(mapping)) {
    // If the value looks like a color reference (contains a dot or is a top-
    // level color name), resolve against the full `colors` map; otherwise
    // treat it as a shade key of this scale.
    if (shadeOrRef.includes(".") || !(shadeOrRef in scale)) {
      theme[tokenName] = resolveColorReference(shadeOrRef, colors);
    } else {
      theme[tokenName] = scale[shadeOrRef] ?? shadeOrRef;
    }
  }
  return theme;
}

/** Collect all mode names from semantic tokens (always includes 'light' + 'dark'). */
function collectModes(tokens: Record<string, SemanticTokenValue>): Set<string> {
  const modes = new Set<string>(["light", "dark"]);
  for (const value of Object.values(tokens)) {
    for (const key of Object.keys(value)) {
      if (key === "default") continue;
      if (key.startsWith("_")) modes.add(key.slice(1));
    }
  }
  return modes;
}

function pickValueForMode(value: SemanticTokenValue, mode: string): string {
  const keyed = value[`_${mode}`];
  if (typeof keyed === "string") return keyed;
  return value.default;
}

/** Build Tamagui `media` entries from theme.breakpoints (mobile-first, minWidth). */
export function buildMediaQueries(
  breakpoints: Theme["breakpoints"],
): Record<string, { minWidth?: number; maxWidth?: number }> {
  const entries = Object.entries(breakpoints);
  const sorted = entries
    .map(([name, value]) => ({ name, px: emToPx(value) }))
    .toSorted((a, b) => a.px - b.px);

  const out: Record<string, { minWidth?: number; maxWidth?: number }> = {};
  for (const { name, px } of sorted) {
    if (name === "base") continue; // `base` is the default, no media query.
    out[name] = { minWidth: px };
  }
  return out;
}

/**
 * Full resolver: takes a fully-merged `Theme` and produces the Tamagui
 * `createTamagui` input shape.
 *
 * Fonts, animations, and shorthands are added in P2.2 — this P2.1 output is
 * tokens + themes + media + settings.
 */
export interface ResolvedTamaguiInput {
  tokens: {
    color: Record<string, string>;
    space: Record<string, string>;
    size: Record<string, string>;
    radius: Record<string, string>;
    zIndex: Record<string, string | number>;
  };
  themes: Record<string, Record<string, string>>;
  media: Record<string, { minWidth?: number; maxWidth?: number }>;
  settings: {
    defaultFont: string;
  };
}

export function resolveTheme(theme: Theme): ResolvedTamaguiInput {
  const space = { ...theme.space } as Record<string, string>;
  const size = stripNonStringNumberValues(theme.sizes);
  const radius = { ...theme.radii } as Record<string, string>;
  // Tamagui requires a `true` key on `space`, `size`, and `radius` tokens —
  // it's the baseline value used when scaling up/down (e.g. unstyled Button's
  // default size). Without it, createTamagui() throws at construct time.
  // Chakra's conventional defaults are "$4" for spacing (1rem), "$md" for
  // size (28rem), and "md" for radius (0.375rem).
  if (space.true === undefined) space.true = space["4"] ?? "1rem";
  if (size.true === undefined) size.true = size.md ?? size["4"] ?? "1rem";
  if (radius.true === undefined) radius.true = radius.md ?? "0.375rem";

  return {
    tokens: {
      color: buildColorTokens(theme.colors),
      space,
      size,
      radius,
      zIndex: { ...theme.zIndices },
    },
    themes: {
      ...buildThemes(theme.semanticTokens, theme.colors),
      ...buildColorSchemeThemes(theme.colors),
    },
    media: buildMediaQueries(theme.breakpoints),
    settings: {
      defaultFont: "body",
    },
  };
}

/** ThemeSizes allows nested objects (`container: { sm, md, ... }`) — strip them. */
function stripNonStringNumberValues(source: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(source)) {
    if (typeof value === "string") out[key] = value;
    else if (typeof value === "number") out[key] = String(value);
  }
  return out;
}
