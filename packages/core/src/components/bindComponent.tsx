import { forwardRef, type ComponentType } from "react";
import type { ComponentOverride } from "../theme/types";

/**
 * Wrap a base component with a `ComponentOverride` from the theme so that
 * `baseStyle`, `sizes[size]`, `variants[variant]`, and `defaultProps` are
 * merged into the user's props at render time.
 *
 * Per Q23 (PLAN.md §3.7): this is the v0.1 runtime implementation. A later
 * compiler plugin can lift this into build-time Tamagui `styled()` calls to
 * get compile-time extraction (PLAN.md §9 risk).
 *
 * Merge precedence (last wins):
 *   1. `defaultProps`
 *   2. `baseStyle`
 *   3. `sizes[props.size]`
 *   4. `variants[props.variant]`
 *   5. User props (including `size` and `variant` themselves)
 *
 * When `override` is `undefined` (the common case), returns the base component
 * unchanged by reference so React treats it identically for reconciliation.
 */
// Generic HoC: accepts any ComponentType and returns the same type.
// Internal types relax to `Record<string, unknown>` since the override
// manipulates props generically.
// oxlint-disable-next-line typescript/no-explicit-any
export function bindComponent<T extends ComponentType<any>>(
  BaseComponent: T,
  override: ComponentOverride | undefined,
): T {
  if (!override) return BaseComponent;

  const { baseStyle, sizes, variants, defaultProps } = override;

  const Bound = forwardRef<unknown, Record<string, unknown>>(function Bound(props, ref) {
    const { size, variant, ...rest } = props as Record<string, unknown> & {
      size?: string;
      variant?: string;
    };
    const sizeStyles = typeof size === "string" && sizes?.[size] ? sizes[size] : undefined;
    const variantStyles =
      typeof variant === "string" && variants?.[variant] ? variants[variant] : undefined;

    const merged: Record<string, unknown> = {
      ...defaultProps,
      ...baseStyle,
      ...sizeStyles,
      ...variantStyles,
      ...(size !== undefined ? { size } : {}),
      ...(variant !== undefined ? { variant } : {}),
      ...rest,
    };
    // Base component accepts whatever props the user supplies (by contract of
    // the HoC). Cast at the boundary.
    const Any = BaseComponent as unknown as ComponentType<
      Record<string, unknown> & { ref?: unknown }
    >;
    return <Any ref={ref} {...merged} />;
  });
  Bound.displayName = `Bound(${BaseComponent.displayName ?? "Component"})`;
  return Bound as unknown as T;
}
