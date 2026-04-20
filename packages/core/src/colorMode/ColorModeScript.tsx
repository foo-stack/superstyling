import { DEFAULT_STORAGE_KEY } from "./types";

export interface ColorModeScriptProps {
  /** Initial mode when no stored preference exists. Default: `"light"`. */
  initialColorMode?: "light" | "dark" | "system";
  /** Storage key used by ColorModeProvider. Default: `ss-color-mode`. */
  storageKey?: string;
  /** CSP nonce to apply to the inline script. */
  nonce?: string;
}

/**
 * Inline script injected into `<head>` (Next.js: `_document.tsx`; Vite: `index.html`)
 * that reads the persisted color mode from `localStorage` **synchronously
 * before React hydrates** and applies it to `<html>`. Prevents the flash of
 * unstyled content (FOUC) that plagued Chakra v2 apps.
 *
 * Native apps don't render this — the component no-ops on non-web platforms
 * because there's no pre-hydration DOM.
 *
 * Usage (Next.js Pages Router):
 * ```tsx
 * // pages/_document.tsx
 * import { ColorModeScript } from "@superstyling/core";
 * export default function Document() {
 *   return (
 *     <Html>
 *       <Head />
 *       <body>
 *         <ColorModeScript initialColorMode="system" />
 *         <Main />
 *         <NextScript />
 *       </body>
 *     </Html>
 *   );
 * }
 * ```
 */
export function ColorModeScript({
  initialColorMode = "light",
  storageKey = DEFAULT_STORAGE_KEY,
  nonce,
}: ColorModeScriptProps) {
  const script = buildColorModeScript(initialColorMode, storageKey);
  return (
    <script
      // oxlint-disable-next-line react-perf/jsx-no-new-object-as-prop -- this component renders once server-side; no re-render perf concern
      dangerouslySetInnerHTML={{ __html: script }}
      nonce={nonce}
    />
  );
}

/** Exported for tests and for advanced consumers that want raw-string injection. */
export function buildColorModeScript(
  initialColorMode: "light" | "dark" | "system",
  storageKey: string,
): string {
  return [
    "(function(){try{",
    `var k=${JSON.stringify(storageKey)};`,
    `var init=${JSON.stringify(initialColorMode)};`,
    "var s=localStorage.getItem(k);",
    "var mode=s;",
    "if(!mode){",
    "  if(init==='system'&&typeof matchMedia==='function'){",
    "    mode=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';",
    "  } else { mode=init==='dark'?'dark':'light'; }",
    "}",
    "var d=document.documentElement;",
    "d.setAttribute('data-theme',mode);",
    "d.classList.add('t_'+mode);",
    "}catch(e){}})();",
  ].join("");
}
