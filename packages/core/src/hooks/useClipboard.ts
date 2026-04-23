import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useClipboard — copy a string to the system clipboard and track
 * transient "copied" feedback state.
 *
 *   const { value, setValue, onCopy, hasCopied } = useClipboard("hello");
 *   <Button onPress={onCopy}>{hasCopied ? "Copied!" : "Copy"}</Button>
 *
 * Web: uses `navigator.clipboard`. On native (React Native), this is a
 * no-op by default — install `@react-native-clipboard/clipboard` and the
 * hook will dynamically load it. The state/feedback loop behaves
 * identically in both environments.
 */

export interface UseClipboardOptions {
  /** ms before `hasCopied` resets to false. Default 1500. */
  timeout?: number;
  /** Sync the tracked value with the argument when it changes. Default true. */
  syncOnExternalChange?: boolean;
}

export interface UseClipboardReturn {
  value: string;
  setValue: (next: string) => void;
  onCopy: () => void;
  hasCopied: boolean;
}

export function useClipboard(
  initial: string = "",
  options: UseClipboardOptions = {},
): UseClipboardReturn {
  const { timeout = 1500, syncOnExternalChange = true } = options;
  const [value, setValue] = useState(initial);
  const [hasCopied, setHasCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (syncOnExternalChange) setValue(initial);
  }, [initial, syncOnExternalChange]);

  const onCopy = useCallback(() => {
    void copyToClipboard(value).then((ok) => {
      if (!ok) return;
      setHasCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setHasCopied(false), timeout);
    });
  }, [value, timeout]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { value, setValue, onCopy, hasCopied };
}

async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }
  // Native: try `@react-native-clipboard/clipboard` if available; else no-op.
  try {
    const moduleSpecifier = "@react-native-clipboard/clipboard";
    const mod = (await import(/* @vite-ignore */ moduleSpecifier)) as {
      default?: { setString?: (s: string) => void };
    };
    mod.default?.setString?.(text);
    return true;
  } catch {
    return false;
  }
}
