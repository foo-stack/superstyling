import { createContext, useContext, type ReactNode } from "react";
import { defaultSystem, type System } from "../createSystem";

/**
 * SystemContext — exposes the active `System` (theme + resolved tamagui
 * config) to descendant hooks like `useTheme()` and `useToken()`. Wired
 * by `SuperStylingProvider`.
 */

const SystemContext = createContext<System | null>(null);

export interface SystemProviderProps {
  system: System;
  children: ReactNode;
}

export function SystemProvider({ system, children }: SystemProviderProps) {
  return <SystemContext.Provider value={system}>{children}</SystemContext.Provider>;
}

export function useSystem(): System {
  return useContext(SystemContext) ?? defaultSystem;
}
