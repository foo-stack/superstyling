import type { IconProps } from "./types";

/**
 * Web `<Icon>` — renders an inline SVG. Accepts standard SVG children
 * (`<path>`, `<circle>`, `<g>`, etc.) so users can compose arbitrary icons
 * without knowing about react-native-svg.
 *
 * Metro resolves `Icon.native.tsx` on iOS/Android.
 */
export function Icon({
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden = ariaLabel === undefined,
  size = "1em",
  color = "currentColor",
  viewBox = "0 0 24 24",
  children,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      role={ariaLabel === undefined ? undefined : "img"}
      focusable="false"
    >
      {children}
    </svg>
  );
}
Icon.displayName = "Icon";
