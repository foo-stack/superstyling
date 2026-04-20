/**
 * `@superstyling/next/app` — App Router helpers.
 *
 * Usage (in `app/layout.tsx`):
 * ```tsx
 * import { ColorModeScript } from "@superstyling/next/app";
 *
 * export default function RootLayout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <html lang="en" suppressHydrationWarning>
 *       <head>
 *         <ColorModeScript initialMode="light" />
 *       </head>
 *       <body>{children}</body>
 *     </html>
 *   );
 * }
 * ```
 *
 * The `suppressHydrationWarning` on `<html>` prevents React warning when the
 * blocking script mutates the color-mode class before hydration.
 */

import { buildColorModeScript, type ColorModeScriptOptions } from "./index";

/**
 * App Router-compatible ColorModeScript. Renders a plain `<script>` tag; Next
 * treats server components as HTML, so this runs synchronously during SSR
 * and blocks render until the class is applied — killing FOUC.
 */
export function ColorModeScript(options: ColorModeScriptOptions = {}) {
  const body = buildColorModeScript(options);
  // dangerouslySetInnerHTML is the standard pattern for blocking init scripts
  // in Next (documented in the ColorMode docs). Inline contents only, not
  // user-controlled.
  // oxlint-disable-next-line typescript/no-explicit-any
  const html = { __html: body } as any;
  return <script dangerouslySetInnerHTML={html} />;
}

export { buildColorModeScript, DEFAULT_STORAGE_KEY } from "./index";
export type { ColorModeScriptOptions, InitialColorMode } from "./index";
