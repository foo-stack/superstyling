import { useSystem } from "../system/SystemContext";
import type { Theme } from "../theme";

/**
 * useTheme — returns the active resolved theme object (`{ colors, space,
 * fonts, … }`). Chakra parity.
 *
 *   const theme = useTheme();
 *   theme.colors.blue[500];
 */
export function useTheme(): Theme {
  return useSystem().theme;
}
