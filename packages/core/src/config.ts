import { createTamagui } from "tamagui";
import { defaultConfig } from "@tamagui/config/v4";

/**
 * Default Tamagui config for Superstyling. This is a minimal v0.1 skeleton —
 * the full Chakra-shaped theme + semantic-tokens + colorScheme auto-registration
 * land in Phase 2 per PLAN.md §3.7.
 *
 * For now we re-export Tamagui's default v4 config so `SuperStylingProvider`
 * has something to render with.
 */
export const defaultSuperStylingConfig = createTamagui(defaultConfig);

export type SuperStylingConfig = typeof defaultSuperStylingConfig;
