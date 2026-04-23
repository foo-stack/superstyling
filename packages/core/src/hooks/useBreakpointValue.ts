import { useMedia } from "tamagui";

/**
 * useBreakpointValue — pick a value from an object keyed by breakpoint.
 * Cross-platform via Tamagui's `useMedia` (web + native both honored).
 *
 *   const cols = useBreakpointValue({ base: 1, md: 2, lg: 4 });
 *
 * Breakpoint names default to Tamagui's: `xs`, `sm`, `md`, `lg`, `xl`,
 * `xxl`. Use `base` as the default fallback. The hook picks the largest
 * matched breakpoint whose value is defined in the input object.
 */

const ORDER = ["xs", "sm", "md", "lg", "xl", "xxl"] as const;

export type BreakpointValueMap<T> = Partial<Record<(typeof ORDER)[number], T>> & { base?: T };

export function useBreakpointValue<T>(values: BreakpointValueMap<T>): T | undefined {
  const media = useMedia() as unknown as Record<string, boolean>;

  let pick: T | undefined = values.base;
  for (const bp of ORDER) {
    if (media[bp] && values[bp] !== undefined) pick = values[bp];
  }
  return pick;
}
