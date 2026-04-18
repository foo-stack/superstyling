import type { ReactNode } from "react";

export interface IconProps {
  /** Accessible label; required unless `aria-hidden` is set. */
  "aria-label"?: string;
  "aria-hidden"?: boolean;
  /** Square size in pixels or a theme size token (resolved in Phase 2). */
  size?: number | string;
  /** Color token or raw color string (resolved in Phase 2). */
  color?: string;
  /** SVG path elements (v0.1) or raw children (future). */
  children?: ReactNode;
}

/**
 * `<Icon>` skeleton. Phase 3 lands the real cross-platform implementation:
 *   - Web: renders <svg> with the provided path children directly
 *   - Native: wraps react-native-svg's <Svg> with the same children
 *
 * v0.1 skeleton renders nothing but has the right prop shape so component
 * consumers can depend on it during Phase 2/3.
 */
export function Icon(_props: IconProps): ReactNode {
  return null;
}
