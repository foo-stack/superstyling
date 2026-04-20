import type { ReactNode } from "react";

export interface IconProps {
  /**
   * Accessible label. When present, the icon is exposed as an image to
   * screen readers. When absent, the icon is hidden from assistive tech.
   */
  "aria-label"?: string;
  /** Force-hide from AT. Defaults to `true` when no `aria-label` is provided. */
  "aria-hidden"?: boolean;
  /** Square size. Number = pixels; string = CSS/RN dimension. Default: `"1em"` (web) or `24` (native). */
  size?: number | string;
  /** Stroke / fill color. Default: `"currentColor"`. */
  color?: string;
  /** SVG viewBox. Default: `"0 0 24 24"` — the v0.1 icon grid. */
  viewBox?: string;
  /** Raw SVG children (web) or react-native-svg primitives (native). */
  children?: ReactNode;
}

export interface CreateIconConfig {
  displayName: string;
  /** SVG path-data strings. Each entry becomes a `<path>` / `<Path>`. */
  paths: readonly string[];
  /** Custom viewBox (defaults to `"0 0 24 24"`). */
  viewBox?: string;
}
