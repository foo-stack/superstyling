import { pseudoPropMap } from "./pseudoProps";

/**
 * Runtime prop translator: Chakra-shaped props → Tamagui-shaped props.
 *
 * Handles three translations (per PLAN.md §3.4):
 *   1. Pseudo-props — `_hover={{ bg: "blue.600" }}` → `hoverStyle={{ backgroundColor: "blue.600" }}`
 *   2. Responsive object form — `p={{ base: 2, md: 4 }}` → `padding={2} $md={{ padding: 4 }}`
 *   3. Restricted `sx` prop — spread a style object as flat props
 *
 * Chakra shortcut translation (`p` → `padding` etc.) is NOT handled here —
 * Tamagui's built-in shorthand resolution does that from the `shorthands`
 * config we register in `createSystem()`. We pass `p` through untouched.
 */

export interface TranslateOptions {
  /**
   * Names of user-defined breakpoints (excluding `base`). Used to decide
   * whether a `{ base: ..., md: ... }` object is a responsive object or just
   * a plain style object.
   */
  breakpointNames: readonly string[];
}

/** Translate a single props object according to the rules above. */
export function translateProps(
  props: Readonly<Record<string, unknown>>,
  opts: TranslateOptions,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(props)) {
    // (3) sx: flat style object that spreads into the top-level props.
    if (key === "sx" && isPlainObject(value)) {
      const spread = translateProps(value, opts);
      for (const [k, v] of Object.entries(spread)) {
        mergeInto(out, k, v);
      }
      continue;
    }

    // (1) pseudo-props: `_hover`, `_focus`, etc.
    if (Object.prototype.hasOwnProperty.call(pseudoPropMap, key)) {
      const tamaguiKey = pseudoPropMap[key];
      if (!tamaguiKey) {
        out[key] = value;
        continue;
      }
      if (isPlainObject(value)) {
        out[tamaguiKey] = translateProps(value, opts);
      } else {
        out[tamaguiKey] = value;
      }
      continue;
    }

    // (2) responsive object: `{ base: X, md: Y }`.
    if (isResponsiveObject(value, opts.breakpointNames)) {
      expandResponsive(key, value, out);
      continue;
    }

    // Default: pass through unchanged. Tamagui handles shortcut resolution
    // (e.g., `p` → `padding`) via the `shorthands` config.
    out[key] = value;
  }

  return out;
}

function expandResponsive(
  propName: string,
  value: Record<string, unknown>,
  out: Record<string, unknown>,
): void {
  for (const [breakpoint, breakpointValue] of Object.entries(value)) {
    if (breakpoint === "base") {
      mergeInto(out, propName, breakpointValue);
      continue;
    }
    const mediaKey = `$${breakpoint}`;
    const existing = out[mediaKey];
    const nested = isPlainObject(existing) ? { ...existing } : {};
    nested[propName] = breakpointValue;
    out[mediaKey] = nested;
  }
}

function mergeInto(out: Record<string, unknown>, key: string, value: unknown): void {
  out[key] = value;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  if (typeof v !== "object" || v === null) return false;
  if (Array.isArray(v)) return false;
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
}

/**
 * Returns true when `v` is a plain object whose keys are all responsive
 * breakpoint names (including `base`). This is how we distinguish
 * `{ base: 2, md: 4 }` (responsive) from `{ bg: "blue.500" }` (style object).
 */
function isResponsiveObject(
  v: unknown,
  breakpointNames: readonly string[],
): v is Record<string, unknown> {
  if (!isPlainObject(v)) return false;
  const keys = Object.keys(v);
  if (keys.length === 0) return false;
  return keys.every((k) => k === "base" || breakpointNames.includes(k));
}
