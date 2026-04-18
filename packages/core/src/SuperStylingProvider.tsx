import type { ReactNode } from "react";
import { TamaguiProvider } from "tamagui";
import { PortalProvider } from "@tamagui/portal";
import { defaultSuperStylingConfig, type SuperStylingConfig } from "./config";

export interface SuperStylingProviderProps {
  children: ReactNode;
  config?: SuperStylingConfig;
  defaultTheme?: "light" | "dark" | (string & {});
}

/**
 * Root provider for Superstyling. Wraps TamaguiProvider (theme + tokens) and
 * PortalProvider (cross-platform portal mount) so consumers only need one.
 *
 * v0.1 skeleton — Phase 2 adds color mode plumbing, overlay registry,
 * and the createSystem-generated config path.
 */
export function SuperStylingProvider({
  children,
  config = defaultSuperStylingConfig,
  defaultTheme = "light",
}: SuperStylingProviderProps) {
  return (
    <TamaguiProvider config={config} defaultTheme={defaultTheme}>
      <PortalProvider>{children}</PortalProvider>
    </TamaguiProvider>
  );
}
