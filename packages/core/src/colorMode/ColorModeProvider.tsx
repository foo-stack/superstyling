import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Theme } from "tamagui";
import { defaultStorage } from "./storage";
import { systemSchemeWatcher } from "./systemScheme";
import {
  DEFAULT_STORAGE_KEY,
  type ColorMode,
  type ColorModeContextValue,
  type ColorModeStorage,
  type SystemSchemeWatcher,
} from "./types";

const ColorModeContext = createContext<ColorModeContextValue | null>(null);

export interface ColorModeProviderProps {
  children: ReactNode;
  /**
   * Initial color mode used before storage loads / if nothing is stored.
   *   - `"light"` or `"dark"`: explicit mode
   *   - `"system"`: follow the OS preference (falls back to light if unavailable)
   */
  initialColorMode?: "light" | "dark" | "system";
  /**
   * When true, the app subscribes to OS color-scheme changes after mount and
   * updates mode automatically (unless the user explicitly toggled).
   */
  useSystemColorMode?: boolean;
  /** Override the persistence key. Default: `ss-color-mode`. */
  storageKey?: string;
  /** Override the storage backend (test injection / custom persistence). */
  storage?: ColorModeStorage;
  /** Override the system-scheme watcher (test injection). */
  systemWatcher?: SystemSchemeWatcher;
}

/**
 * Owns the color-mode state. Wraps its subtree in Tamagui's `<Theme>` so a
 * `colorMode` change reactively propagates tokens through the app.
 *
 * Rendered inside `<SuperStylingProvider>` — users don't render this directly.
 */
export function ColorModeProvider({
  children,
  initialColorMode = "light",
  useSystemColorMode = false,
  storageKey = DEFAULT_STORAGE_KEY,
  storage = defaultStorage,
  systemWatcher = systemSchemeWatcher,
}: ColorModeProviderProps) {
  const [colorMode, setModeState] = useState<ColorMode>(() => {
    const sync = storage.getSync?.();
    if (sync === "light" || sync === "dark") return sync;
    if (initialColorMode === "system") return systemWatcher.getCurrent();
    return initialColorMode;
  });

  const [userTouched, setUserTouched] = useState(false);

  useEffect(() => {
    // Hydrate from persisted storage on mount (for async backends).
    let cancelled = false;
    storage.get().then((stored) => {
      if (cancelled) return;
      if (stored === "light" || stored === "dark") {
        setModeState(stored);
        setUserTouched(true);
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!useSystemColorMode) return;
    return systemWatcher.subscribe((mode) => {
      // Only follow system if the user hasn't explicitly toggled.
      if (!userTouched) setModeState(mode);
    });
  }, [useSystemColorMode, systemWatcher, userTouched]);

  const setColorMode = useCallback(
    (mode: ColorMode) => {
      setModeState(mode);
      setUserTouched(true);
      void storage.set(mode);
    },
    [storage],
  );

  const toggleColorMode = useCallback(() => {
    setColorMode(colorMode === "dark" ? "light" : "dark");
  }, [colorMode, setColorMode]);

  const value = useMemo<ColorModeContextValue>(
    () => ({ colorMode, setColorMode, toggleColorMode }),
    [colorMode, setColorMode, toggleColorMode],
  );

  // Silence unused-var warning for storageKey (passed-through convenience).
  void storageKey;

  return (
    <ColorModeContext.Provider value={value}>
      <Theme name={colorMode}>{children}</Theme>
    </ColorModeContext.Provider>
  );
}

export function useColorMode(): ColorModeContextValue {
  const ctx = useContext(ColorModeContext);
  if (!ctx) {
    throw new Error("[superstyling] useColorMode must be called inside <SuperStylingProvider>");
  }
  return ctx;
}

export function useColorModeValue<T>(lightValue: T, darkValue: T): T {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? darkValue : lightValue;
}
