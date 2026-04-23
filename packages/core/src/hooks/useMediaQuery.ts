import { useEffect, useState } from "react";

/**
 * useMediaQuery — subscribe to one or many CSS media queries.
 * Returns `boolean[]` (even for a single query) — matches Chakra's
 * tuple-friendly return.
 *
 *   const [isLarge] = useMediaQuery("(min-width: 900px)");
 *
 * On React Native this always returns `[false, ...]` — media queries
 * are a DOM concept. Use `useBreakpointValue` for cross-platform
 * responsive selection.
 */

export function useMediaQuery(queries: string | string[]): boolean[] {
  const list = Array.isArray(queries) ? queries : [queries];

  const getSnapshot = (): boolean[] => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return list.map(() => false);
    }
    return list.map((q) => window.matchMedia(q).matches);
  };

  const [matches, setMatches] = useState<boolean[]>(getSnapshot);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mqls = list.map((q) => window.matchMedia(q));
    const update = () => setMatches(mqls.map((m) => m.matches));
    update();
    mqls.forEach((m) => m.addEventListener("change", update));
    return () => mqls.forEach((m) => m.removeEventListener("change", update));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.join("|")]);

  return matches;
}
