import type { ReactNode } from "react";
import { SuperStylingProvider } from "@superstyling/core";

/**
 * Vocs consumer layout. Vocs looks for `{rootDir}/layout.tsx` and wraps every
 * page's content in its default export. We wrap children in
 * `<SuperStylingProvider>` so live component previews inside MDX pages have
 * access to Tamagui's theme + our color-mode and overlay contexts.
 */
export default function Layout({ children }: { children: ReactNode }) {
  return <SuperStylingProvider>{children}</SuperStylingProvider>;
}
