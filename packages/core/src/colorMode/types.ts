export type ColorMode = "light" | "dark" | (string & {});

export interface ColorModeContextValue {
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
}

/** Storage backend contract used by the ColorModeProvider. */
export interface ColorModeStorage {
  get(): Promise<ColorMode | null>;
  set(mode: ColorMode): Promise<void>;
  /** Optional synchronous read (web only). Used on mount to avoid flashes. */
  getSync?: () => ColorMode | null;
}

/** System-preference subscription contract. */
export interface SystemSchemeWatcher {
  getCurrent(): ColorMode;
  subscribe(listener: (mode: ColorMode) => void): () => void;
}

/** Default storage key used on web localStorage + native AsyncStorage. */
export const DEFAULT_STORAGE_KEY = "ss-color-mode";
