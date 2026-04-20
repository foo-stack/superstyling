/**
 * `@superstyling/next/pages` — Pages Router helpers.
 *
 * Usage (in `pages/_document.tsx`):
 * ```tsx
 * import { SuperStylingDocument } from "@superstyling/next/pages";
 * export default SuperStylingDocument;
 * ```
 *
 * Or compose with your own Document subclass:
 * ```tsx
 * import Document, { Html, Head, Main, NextScript } from "next/document";
 * import { ColorModeScript } from "@superstyling/next/pages";
 *
 * export default class MyDocument extends Document {
 *   render() {
 *     return (
 *       <Html>
 *         <Head><ColorModeScript /></Head>
 *         <body><Main /><NextScript /></body>
 *       </Html>
 *     );
 *   }
 * }
 * ```
 */

import Document, { Html, Head, Main, NextScript } from "next/document";
import { buildColorModeScript, type ColorModeScriptOptions } from "./index";

/**
 * Pages Router-compatible ColorModeScript. Renders as a synchronous
 * `<script>` inside `<Head>`; blocks paint until the color-mode class is
 * applied on `<html>` — kills FOUC on first paint.
 */
export function ColorModeScript(options: ColorModeScriptOptions = {}) {
  const body = buildColorModeScript(options);
  // oxlint-disable-next-line typescript/no-explicit-any
  const html = { __html: body } as any;
  return <script dangerouslySetInnerHTML={html} />;
}

/**
 * Drop-in `_document.tsx` default export. Includes `<ColorModeScript />`
 * inside `<Head>` so first paint has the right color mode. Uses default
 * `storageKey` and `"light"` initial mode — subclass or compose manually if
 * you need custom options.
 */
export default class SuperStylingDocument extends Document {
  override render() {
    return (
      <Html>
        <Head>
          <ColorModeScript />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export { SuperStylingDocument };
export { buildColorModeScript, DEFAULT_STORAGE_KEY } from "./index";
export type { ColorModeScriptOptions, InitialColorMode } from "./index";
