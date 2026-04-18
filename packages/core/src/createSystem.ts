import { defaultSuperStylingConfig, type SuperStylingConfig } from "./config";

/**
 * Placeholder for the createSystem() API described in PLAN.md §3.7 (Q23).
 *
 * v0.1 final shape: accepts a user theme input, expands it at build time into
 * Tamagui config + per-component styled() variants, returns a system object
 * with typed components and hooks.
 *
 * This skeleton accepts nothing useful yet and just returns the default config
 * so downstream code can import `createSystem` without errors while the real
 * implementation is built in Phase 2.
 */
export interface CreateSystemInput {
  // Phase 2: colors, space, sizes, fontSizes, fontWeights, lineHeights,
  // letterSpacings, radii, shadows, zIndices, breakpoints, components,
  // config, semanticTokens (see PLAN.md §3.7)
}

export interface System {
  config: SuperStylingConfig;
}

export function createSystem(_input: CreateSystemInput = {}): System {
  return {
    config: defaultSuperStylingConfig,
  };
}
