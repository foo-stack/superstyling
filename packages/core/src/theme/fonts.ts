/**
 * Build Tamagui font configs from our Chakra-shaped theme.
 *
 * Previously `createSystem` inherited fonts from `@tamagui/config/v4`; this
 * module derives them from the user's theme so that `theme.fonts.body` /
 * `theme.fontSizes` / `theme.fontWeights` / `theme.lineHeights` /
 * `theme.letterSpacings` drive actual `$font`/`$size`/... tokens.
 *
 * Tamagui expects numeric values for `size` / `lineHeight` / `letterSpacing`.
 * Chakra uses `rem` (fontSizes), raw numbers or `"normal"` (lineHeights), and
 * `em` (letterSpacings). We convert at this seam, assuming a 16px base — the
 * CSS default — which matches Chakra's native rendering.
 */
import { createFont } from "tamagui";
import type { Theme, ThemeLetterSpacings, ThemeLineHeights, ThemeFontSizes } from "./types";

export type TamaguiFontConfig = ReturnType<typeof createFont>;

const PX_PER_REM = 16;
const PX_PER_EM_APPROX = 16; // approximation: em is context-dependent; 16 matches default base font

/** Convert `"1.25rem"` / `"16px"` / bare numeric strings to a number. */
export function remPxToNumber(value: string | number): number {
  if (typeof value === "number") return value;
  const trimmed = value.trim();
  const remMatch = /^(-?[\d.]+)rem$/.exec(trimmed);
  if (remMatch?.[1]) return Math.round(parseFloat(remMatch[1]) * PX_PER_REM);
  const pxMatch = /^(-?[\d.]+)px$/.exec(trimmed);
  if (pxMatch?.[1]) return parseFloat(pxMatch[1]);
  const emMatch = /^(-?[\d.]+)em$/.exec(trimmed);
  if (emMatch?.[1]) return Math.round(parseFloat(emMatch[1]) * PX_PER_EM_APPROX);
  const asNumber = Number(trimmed);
  return Number.isFinite(asNumber) ? asNumber : 0;
}

function mapSizes(sizes: ThemeFontSizes): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(sizes)) out[k] = remPxToNumber(v);
  return out;
}

function mapLineHeights(lh: ThemeLineHeights): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(lh)) {
    if (typeof v === "number") out[k] = v;
    else if (v === "normal") out[k] = 1.5;
    else out[k] = remPxToNumber(v);
  }
  return out;
}

function mapLetterSpacings(ls: ThemeLetterSpacings): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(ls)) out[k] = remPxToNumber(v);
  return out;
}

function buildFont(
  family: string,
  theme: Pick<Theme, "fontSizes" | "fontWeights" | "lineHeights" | "letterSpacings">,
): TamaguiFontConfig {
  return createFont({
    family,
    size: mapSizes(theme.fontSizes),
    weight: Object.fromEntries(Object.entries(theme.fontWeights).map(([k, v]) => [k, String(v)])),
    lineHeight: mapLineHeights(theme.lineHeights),
    letterSpacing: mapLetterSpacings(theme.letterSpacings),
  });
}

export function buildFonts(theme: Theme): {
  body: TamaguiFontConfig;
  heading: TamaguiFontConfig;
  mono: TamaguiFontConfig;
} {
  return {
    body: buildFont(theme.fonts.body, theme),
    heading: buildFont(theme.fonts.heading, theme),
    mono: buildFont(theme.fonts.mono, theme),
  };
}
