import { Svg } from "react-native-svg";
import type { IconProps } from "./types";

/**
 * Native `<Icon>` — wraps `react-native-svg`'s `<Svg>`. Children should be
 * `react-native-svg` primitives (`<Path>`, `<Circle>`, `<G>`, …) so the same
 * icon source tree works without DOM.
 *
 * Metro resolves this on iOS/Android; the web sibling (`Icon.tsx`) is used
 * elsewhere.
 */
export function Icon({
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden = ariaLabel === undefined,
  size = 24,
  color = "currentColor",
  viewBox = "0 0 24 24",
  children,
}: IconProps) {
  const numericSize =
    typeof size === "number" ? size : (Number.parseFloat(String(size)) as number) || 24;
  return (
    <Svg
      width={numericSize}
      height={numericSize}
      viewBox={viewBox}
      accessibilityLabel={ariaLabel}
      accessibilityRole={ariaLabel === undefined ? undefined : "image"}
      accessibilityElementsHidden={ariaHidden}
      importantForAccessibility={ariaHidden ? "no-hide-descendants" : "yes"}
      // Pass color through for `<Path stroke="currentColor">` consumers.
      color={color}
    >
      {children}
    </Svg>
  );
}
Icon.displayName = "Icon";
