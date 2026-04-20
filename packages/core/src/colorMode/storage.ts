/**
 * Web color-mode storage (default — resolved on web).
 * Metro resolves `storage.native.ts` on iOS/Android.
 *
 * Uses `localStorage`. Cookie support for SSR is a v0.2 follow-up; first paint
 * still avoids FOUC via `<ColorModeScript />` which reads localStorage
 * synchronously before React hydrates.
 */
import { DEFAULT_STORAGE_KEY, type ColorMode, type ColorModeStorage } from "./types";

function hasLocalStorage(): boolean {
  try {
    return typeof globalThis !== "undefined" && typeof globalThis.localStorage !== "undefined";
  } catch {
    return false;
  }
}

export function createWebStorage(storageKey: string = DEFAULT_STORAGE_KEY): ColorModeStorage {
  return {
    get: () => {
      if (!hasLocalStorage()) return Promise.resolve(null);
      return Promise.resolve(globalThis.localStorage.getItem(storageKey) as ColorMode | null);
    },
    set: (mode) => {
      if (!hasLocalStorage()) return Promise.resolve();
      globalThis.localStorage.setItem(storageKey, mode);
      return Promise.resolve();
    },
    getSync: () => {
      if (!hasLocalStorage()) return null;
      return globalThis.localStorage.getItem(storageKey) as ColorMode | null;
    },
  };
}

export const defaultStorage: ColorModeStorage = createWebStorage();
