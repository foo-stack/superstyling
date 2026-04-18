/**
 * `@superstyling/next` — Next.js integration skeleton.
 *
 * Planned surface (Phase 6 per PLAN.md §3.13):
 *   - SuperStylingDocument: drop-in replacement for pages/_document.tsx that
 *     inlines Tamagui's generated CSS and injects <ColorModeScript /> before
 *     React hydrates, eliminating FOUC.
 *   - withSuperStyling(nextConfig): wraps a user's next.config.{js,mjs} with
 *     Tamagui's Next plugin + Superstyling-specific SSR safety defaults.
 *   - ColorModeScript: the blocking script that reads the persisted mode from
 *     localStorage/cookie and sets it on <html> before hydration.
 *
 * v0.1 ships this skeleton only. Real implementations land in Phase 6.
 */

export const SUPERSTYLING_NEXT_VERSION = "0.0.0";
