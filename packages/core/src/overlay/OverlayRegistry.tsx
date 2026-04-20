import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Overlay registry — the "stack-aware dismiss policy" layer on top of
 * Tamagui's `@tamagui/z-index-stack`. Per PLAN.md §3.12 (refined after the
 * `@tamagui/portal` source read), we reuse Tamagui for *visual* stacking and
 * only add dismiss ordering, outside-click policy, programmatic dismiss, and
 * focus-trap coordination here.
 *
 * v0.1 skeleton ships the registration + topmost-query surface. Escape
 * handler wiring and focus-trap coordination lands when Modal (Phase 4)
 * actually uses it.
 */

export interface RegisteredOverlay {
  id: string;
  /** Called when the registry requests this layer to dismiss. */
  onDismiss?: () => void;
}

export interface OverlayRegistryAPI {
  /** Register an overlay. Returns an unregister function. */
  register(entry: RegisteredOverlay): () => void;
  /** Is this id the topmost overlay currently open? */
  isTopmost(id: string): boolean;
  /** The id of the topmost overlay, or null if none are open. */
  getTopmost(): string | null;
  /** Dismiss the topmost overlay (calls its onDismiss handler). */
  dismissTopmost(): void;
  /** Current stack depth. */
  size(): number;
}

const OverlayRegistryContext = createContext<OverlayRegistryAPI | null>(null);

export interface OverlayRegistryProviderProps {
  children: ReactNode;
}

export function OverlayRegistryProvider({ children }: OverlayRegistryProviderProps) {
  const stackRef = useRef<RegisteredOverlay[]>([]);
  const [, forceRender] = useState(0);

  const bump = useCallback(() => {
    forceRender((n) => n + 1);
  }, []);

  const register = useCallback<OverlayRegistryAPI["register"]>(
    (entry) => {
      stackRef.current = [...stackRef.current, entry];
      bump();
      return () => {
        stackRef.current = stackRef.current.filter((e) => e.id !== entry.id);
        bump();
      };
    },
    [bump],
  );

  const isTopmost = useCallback<OverlayRegistryAPI["isTopmost"]>((id) => {
    const top = stackRef.current.at(-1);
    return top !== undefined && top.id === id;
  }, []);

  const getTopmost = useCallback<OverlayRegistryAPI["getTopmost"]>(
    () => stackRef.current.at(-1)?.id ?? null,
    [],
  );

  const dismissTopmost = useCallback<OverlayRegistryAPI["dismissTopmost"]>(() => {
    const top = stackRef.current.at(-1);
    top?.onDismiss?.();
  }, []);

  const size = useCallback<OverlayRegistryAPI["size"]>(() => stackRef.current.length, []);

  const api = useMemo<OverlayRegistryAPI>(
    () => ({ register, isTopmost, getTopmost, dismissTopmost, size }),
    [register, isTopmost, getTopmost, dismissTopmost, size],
  );

  return <OverlayRegistryContext.Provider value={api}>{children}</OverlayRegistryContext.Provider>;
}

export function useOverlayRegistry(): OverlayRegistryAPI {
  const ctx = useContext(OverlayRegistryContext);
  if (!ctx) {
    throw new Error(
      "[superstyling] useOverlayRegistry must be called inside <SuperStylingProvider>",
    );
  }
  return ctx;
}
