import type { ComponentOverride } from "./types";

/**
 * defineStyleConfig — Chakra parity. In Chakra v2 this is an identity
 * helper that serves only to narrow TypeScript types for a single-part
 * component's style config. Same here.
 *
 *   const ButtonStyles = defineStyleConfig({
 *     baseStyle: { fontWeight: 600 },
 *     sizes: { md: { px: 4, py: 2 } },
 *     variants: { solid: { bg: "blue.500", color: "white" } },
 *     defaultProps: { size: "md", variant: "solid" },
 *   });
 *
 *   createSystem({ components: { Button: ButtonStyles } });
 */
export function defineStyleConfig(config: ComponentOverride): ComponentOverride {
  return config;
}

/**
 * defineMultiStyleConfig — Chakra parity shim for multi-part components.
 * Chakra's helper is `createMultiStyleConfigHelpers(parts).defineMultiStyleConfig`.
 * For migration, we accept the config shape it produces and flatten it to
 * a single `ComponentOverride` — the `parts` metadata is not currently
 * honored by Superstyling primitives (deferred to a later phase).
 *
 *   const MenuStyles = defineMultiStyleConfig({
 *     parts: ["button", "list", "item"],
 *     baseStyle: { button: { px: 3 }, list: { py: 2 }, item: { px: 3 } },
 *     ...
 *   });
 */
export interface MultiStyleConfigInput {
  parts?: readonly string[];
  baseStyle?: Record<string, Record<string, unknown>> | ((...args: unknown[]) => unknown);
  sizes?: Record<string, Record<string, Record<string, unknown>>>;
  variants?: Record<string, Record<string, Record<string, unknown>>>;
  defaultProps?: Record<string, unknown>;
}

export function defineMultiStyleConfig(config: MultiStyleConfigInput): ComponentOverride {
  // Superstyling's ComponentOverride.baseStyle is a flat style object —
  // multi-part baseStyles collapse into a shallow merge with a lossy note
  // on console so users can see what wasn't preserved.
  const warnings: string[] = [];
  const baseStyle = flattenPartMap(config.baseStyle, "baseStyle", warnings);
  const sizes = flattenPartMapMap(config.sizes, "sizes", warnings);
  const variants = flattenPartMapMap(config.variants, "variants", warnings);

  if (warnings.length > 0 && typeof console !== "undefined") {
    // eslint-disable-next-line no-console
    console.warn(
      `[superstyling] defineMultiStyleConfig: ${warnings.length} lossy conversion(s). Multi-part slots are flattened — per-part targeting is deferred.`,
    );
  }

  const override: ComponentOverride = {};
  if (baseStyle) override.baseStyle = baseStyle;
  if (sizes) override.sizes = sizes;
  if (variants) override.variants = variants;
  if (config.defaultProps) override.defaultProps = config.defaultProps;
  return override;
}

function flattenPartMap(
  value: MultiStyleConfigInput["baseStyle"],
  slot: string,
  warnings: string[],
): Record<string, unknown> | undefined {
  if (value == null) return undefined;
  if (typeof value === "function") {
    warnings.push(`${slot} is a function — skipped (StyleFunctionProps not supported).`);
    return undefined;
  }
  const parts = value as Record<string, Record<string, unknown>>;
  const flat: Record<string, unknown> = {};
  for (const [part, styles] of Object.entries(parts)) {
    warnings.push(`${slot}.${part} flattened — per-part slot no longer distinguishable.`);
    Object.assign(flat, styles);
  }
  return Object.keys(flat).length > 0 ? flat : undefined;
}

function flattenPartMapMap(
  value: Record<string, Record<string, Record<string, unknown>>> | undefined,
  slot: "sizes" | "variants",
  warnings: string[],
): Record<string, Record<string, unknown>> | undefined {
  if (!value) return undefined;
  const out: Record<string, Record<string, unknown>> = {};
  for (const [key, parts] of Object.entries(value)) {
    const flat = flattenPartMap(parts, `${slot}.${key}`, warnings);
    if (flat) out[key] = flat;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}
