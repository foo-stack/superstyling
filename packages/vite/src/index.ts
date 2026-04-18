/**
 * `@superstyling/vite` — Vite integration skeleton.
 *
 * Planned surface (Phase 6 per PLAN.md §3.13):
 *   - superstylingVitePlugin(): wraps @tamagui/vite-plugin with Superstyling
 *     defaults (style extraction, theme inlining).
 *   - colorModeScriptSnippet: a string the user drops into index.html before
 *     Vite inlines it, so first paint has the right color mode without FOUC.
 *   - SSG helpers for Vike / One setups.
 *
 * v0.1 ships this skeleton only. Real implementations land in Phase 6.
 */

export const SUPERSTYLING_VITE_VERSION = "0.0.0";
