/* oxlint-disable react-perf/jsx-no-new-function-as-prop -- client-only sync */
import { useEffect } from "react";
import { useColorMode } from "@superstyling/core";

/**
 * Syncs Vocs's color-mode toggle (which flips `html.dark`) to our Tamagui
 * `ColorModeProvider`. Without this bridge, clicking Vocs's theme toggle
 * updates Vocs's CSS-var chrome but leaves our live component previews
 * stuck in the original mode (the two systems are independent).
 *
 * Runs client-side only; no SSR effect.
 */
export function ColorModeBridge() {
  const { setColorMode } = useColorMode();

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const html = document.documentElement;
    const observer = new MutationObserver(() => {
      const isDark = html.classList.contains("dark");
      setColorMode(isDark ? "dark" : "light");
    });

    // Initial sync.
    const isDark = html.classList.contains("dark");
    setColorMode(isDark ? "dark" : "light");

    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [setColorMode]);

  return null;
}
