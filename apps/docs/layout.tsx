/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-function-as-prop -- docs layout */
import { useEffect, useState, type ReactNode } from "react";
import { SuperStylingProvider } from "@superstyling/core";
import { ColorModeBridge } from "./components/ColorModeBridge";

/**
 * Vocs consumer layout. Vocs looks for `{rootDir}/layout.tsx` and wraps every
 * page's content in its default export. We wrap children in
 * `<SuperStylingProvider>` so live component previews inside MDX pages have
 * access to Tamagui's theme + our color-mode and overlay contexts.
 *
 * `<ColorModeBridge>` syncs Vocs's `html.dark` toggle to our `ColorModeProvider`
 * so both chrome (Vocs) and previews (Tamagui) flip together.
 */
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SuperStylingProvider>
      <ColorModeBridge />
      {children}
    </SuperStylingProvider>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Named exports picked up by Vocs's virtual-consumer-components plugin.

/**
 * Rendered at the right end of the desktop top nav (before the theme toggle).
 * Shows a live GitHub star count — fetched client-side on mount. Falls back
 * to a plain "GitHub" link if the fetch fails or is rate-limited.
 */
export function TopNavEnd() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("https://api.github.com/repos/natestack/superstyling")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        if (typeof data.stargazers_count === "number") {
          setStars(data.stargazers_count);
        }
      })
      .catch(() => {
        // Rate-limited or offline — fall back to "GitHub" label.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <a
      href="https://github.com/natestack/superstyling"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        fontSize: 13,
        fontWeight: 500,
        color: "var(--vocs-color_text)",
        border: "1px solid var(--vocs-color_border)",
        borderRadius: 6,
        textDecoration: "none",
      }}
    >
      <span>★</span>
      <span>{stars === null ? "GitHub" : formatStars(stars)}</span>
    </a>
  );
}

function formatStars(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
