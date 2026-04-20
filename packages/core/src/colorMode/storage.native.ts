/**
 * Native color-mode storage using AsyncStorage. Metro resolves this file on
 * iOS and Android; the web sibling (`storage.ts`) is used elsewhere.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULT_STORAGE_KEY, type ColorMode, type ColorModeStorage } from "./types";

export function createNativeStorage(storageKey: string = DEFAULT_STORAGE_KEY): ColorModeStorage {
  return {
    get: async () => {
      try {
        return (await AsyncStorage.getItem(storageKey)) as ColorMode | null;
      } catch {
        return null;
      }
    },
    set: async (mode) => {
      try {
        await AsyncStorage.setItem(storageKey, mode);
      } catch {
        // Swallow; losing persistence is non-fatal.
      }
    },
    // No getSync on native — AsyncStorage is async-only. Consumers that need
    // sync reads must keep the in-memory state from the provider.
  };
}

export const defaultStorage: ColorModeStorage = createNativeStorage();
