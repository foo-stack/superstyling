import { useTheme } from "./useTheme";
import type { Theme } from "../theme";

/**
 * useToken — resolve one or more theme tokens to their raw values.
 *
 *   useToken("colors", "blue.500");        // "#3182CE"
 *   useToken("space", ["2", "4"]);          // ["0.5rem", "1rem"]
 *   useToken("radii", "md");                // "0.375rem"
 *
 * Chakra parity: accepts a scale name (`"colors" | "space" | …`) and a
 * token or array of tokens. Dot-separated tokens walk nested objects
 * (e.g. `"blue.500"` → `colors.blue[500]`).
 */

export type ThemeScale = keyof Omit<Theme, "config" | "components" | "semanticTokens">;

export function useToken<K extends ThemeScale>(scale: K, token: string): string | undefined;
export function useToken<K extends ThemeScale>(scale: K, tokens: string[]): (string | undefined)[];
export function useToken<K extends ThemeScale>(
  scale: K,
  tokens: string | string[],
): string | undefined | (string | undefined)[] {
  const theme = useTheme();
  const bucket = theme[scale] as unknown as Record<string, unknown>;
  if (Array.isArray(tokens)) return tokens.map((t) => resolvePath(bucket, t));
  return resolvePath(bucket, tokens);
}

function resolvePath(source: Record<string, unknown>, path: string): string | undefined {
  if (!source) return undefined;
  const direct = source[path];
  if (typeof direct === "string" || typeof direct === "number") return String(direct);
  const segments = path.split(".");
  let current: unknown = source;
  for (const seg of segments) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[seg];
  }
  if (typeof current === "string" || typeof current === "number") return String(current);
  return undefined;
}
