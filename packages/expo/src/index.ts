/**
 * `@superstyling/expo` — Expo integration skeleton.
 *
 * Planned surface (Phase 6 per PLAN.md §3.13 + PROGRESS.md Phase 0 decision
 * log: "must ensure teleport host is registered at native app root so the
 * Gorhom silent-context-loss fallback never fires"):
 *
 *   - registerSuperStylingTeleportHost(): registers a "root" teleport host
 *     via @tamagui/native so Tamagui's native Portal uses teleport mode
 *     (context-preserving) instead of falling back to the Gorhom JS path
 *     that loses React context.
 *   - withSuperStyling(expoConfig): Expo config plugin that wires the
 *     Reanimated Babel plugin and Metro transformer for Tamagui.
 *   - metroConfigHelper: drop-in Metro config mutator for Tamagui resolution.
 *
 * v0.1 ships this skeleton only. Real implementations land in Phase 6.
 */

export const SUPERSTYLING_EXPO_VERSION = "0.0.0";
