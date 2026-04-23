import { useMemo, type ReactNode } from "react";
import { TamaguiProvider } from "tamagui";
import { PortalHost } from "@tamagui/portal";
import { defaultSystem, type System } from "./createSystem";
import { ColorModeProvider } from "./colorMode/ColorModeProvider";
import { OverlayRegistryProvider } from "./overlay/OverlayRegistry";
import { BreakpointProvider } from "./system/BreakpointContext";
import { ToastProvider } from "./toast/ToastProvider";

export interface SuperStylingProviderProps {
  children: ReactNode;
  /**
   * A system produced by `createSystem()`. Omit to use the zero-config default
   * (Chakra-default theme).
   */
  system?: System;
  /**
   * Initial color mode. Falls back to `system.theme.config.initialColorMode`
   * if omitted (which itself defaults to `"light"`).
   */
  initialColorMode?: "light" | "dark" | "system";
  /** Follow OS color-scheme changes after mount. Default: theme config value. */
  useSystemColorMode?: boolean;
}

/**
 * Root provider for Superstyling.
 *
 * Composition order (outer → inner):
 *   TamaguiProvider (theme + tokens — also contains its own PortalProvider)
 *     → ColorModeProvider (state + Tamagui `<Theme>` wrapper for reactive mode swap)
 *       → OverlayRegistryProvider (dismiss-order policy on top of Tamagui's z-index stack)
 *         → children
 *
 * Tamagui v2's TamaguiProvider already includes a PortalProvider; we do not
 * wrap an explicit one here or we get a double-provider SSR crash
 * ("cannot read properties of null (reading 'useContext')").
 */
export function SuperStylingProvider({
  children,
  system = defaultSystem,
  initialColorMode,
  useSystemColorMode,
}: SuperStylingProviderProps) {
  const resolvedInitial = initialColorMode ?? system.theme.config.initialColorMode;
  const resolvedUseSystem = useSystemColorMode ?? system.theme.config.useSystemColorMode;
  // TamaguiProvider's defaultTheme is the fallback *before* hydration — the
  // ColorModeProvider's `<Theme>` wrapper drives the runtime theme once React
  // is mounted.
  const tamaguiDefaultTheme: "light" | "dark" = resolvedInitial === "dark" ? "dark" : "light";
  const breakpointNames = useMemo(
    () => Object.keys(system.theme.breakpoints).filter((name) => name !== "base"),
    [system.theme.breakpoints],
  );

  return (
    <TamaguiProvider config={system.config} defaultTheme={tamaguiDefaultTheme}>
      <BreakpointProvider names={breakpointNames}>
        <ColorModeProvider
          initialColorMode={resolvedInitial}
          useSystemColorMode={resolvedUseSystem}
        >
          <OverlayRegistryProvider>
            <ToastProvider>{children}</ToastProvider>
            <PortalHost name="__superstyling_toasts__" />
          </OverlayRegistryProvider>
        </ColorModeProvider>
      </BreakpointProvider>
    </TamaguiProvider>
  );
}
