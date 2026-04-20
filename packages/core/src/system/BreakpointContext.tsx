import { createContext, useContext, type ReactNode } from "react";
import { defaultTheme } from "../theme/default";

/**
 * Exposes the active theme's breakpoint names to components, so
 * `translateComponentProps` / `useTranslatedProps` can distinguish a
 * responsive object (`{ base: 2, md: 4 }`) from a style object
 * (`{ bg: 'blue.500' }`).
 *
 * Fallback when no provider is mounted: Chakra defaults (matches `defaultTheme`).
 */
const DEFAULT_BREAKPOINT_NAMES: readonly string[] = Object.keys(defaultTheme.breakpoints).filter(
  (k) => k !== "base",
);

const BreakpointContext = createContext<readonly string[]>(DEFAULT_BREAKPOINT_NAMES);

export function BreakpointProvider({
  names,
  children,
}: {
  names: readonly string[];
  children: ReactNode;
}) {
  return <BreakpointContext.Provider value={names}>{children}</BreakpointContext.Provider>;
}

export function useBreakpointNames(): readonly string[] {
  return useContext(BreakpointContext);
}
