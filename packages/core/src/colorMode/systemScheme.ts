/**
 * Web system color-scheme watcher (default — resolved on web).
 * Metro picks `systemScheme.native.ts` on native.
 */
import type { ColorMode, SystemSchemeWatcher } from "./types";

function hasMatchMedia(): boolean {
  try {
    return typeof globalThis !== "undefined" && typeof globalThis.matchMedia === "function";
  } catch {
    return false;
  }
}

export const systemSchemeWatcher: SystemSchemeWatcher = {
  getCurrent: () => {
    if (!hasMatchMedia()) return "light";
    return globalThis.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  },
  subscribe: (listener) => {
    if (!hasMatchMedia()) return () => {};
    const mql = globalThis.matchMedia("(prefers-color-scheme: dark)");
    const handler = (event: MediaQueryListEvent): void => {
      listener(event.matches ? "dark" : "light");
    };
    mql.addEventListener("change", handler);
    return () => {
      mql.removeEventListener("change", handler);
    };
  },
};

export type { ColorMode };
