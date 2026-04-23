"use client";

import { useCallback, useMemo } from "react";
import { Platform } from "react-native";
import { useToast, type ToastOptions } from "./ToastProvider";

/**
 * `useNativeToast()` — opt-in variant of `useToast()` that delegates to the
 * platform-native toast surface on iOS / Android (via `burnt`), and falls
 * back to the cross-platform Tamagui primitive on web.
 *
 * Same imperative API as `useToast()`; pick whichever you want:
 *
 *   const toast = useToast();        // consistent Tamagui toast on all platforms
 *   const native = useNativeToast(); // platform-native feel on iOS/Android
 *
 * `burnt` is NOT a hard dep of `@superstyling/core`. Apps that want
 * native toasts should have it installed (it's already pulled in by
 * `@superstyling/expo/setup-all`). Missing-at-runtime → we fall back
 * silently to the Tamagui toast.
 */

type NativeToastFn = (opts: {
  title: string;
  message?: string;
  preset?: "done" | "error" | "none" | "spinner";
  duration?: number;
}) => void;

let cachedBurnt: { toast: NativeToastFn } | null | undefined;

// Specifier lives in a variable so TypeScript can't eagerly resolve it
// at compile time. Apps that don't install `burnt` (e.g., web-only Vite
// setups) won't error during typecheck.
const BURNT_SPECIFIER = "burnt";

async function loadBurnt(): Promise<{ toast: NativeToastFn } | null> {
  if (cachedBurnt !== undefined) return cachedBurnt;
  try {
    // Dynamic import so bundlers that can't resolve `burnt` still build.
    const mod = (await import(/* @vite-ignore */ BURNT_SPECIFIER)) as unknown as {
      toast: NativeToastFn;
    };
    cachedBurnt = mod;
    return mod;
  } catch {
    cachedBurnt = null;
    return null;
  }
}

export function useNativeToast() {
  const fallback = useToast();

  const fire = useCallback(
    (options: ToastOptions): string => {
      if (Platform.OS === "web") {
        return fallback(options);
      }
      void loadBurnt().then((burnt) => {
        if (!burnt) {
          fallback(options);
          return;
        }
        const preset =
          options.status === "success"
            ? "done"
            : options.status === "error"
              ? "error"
              : options.status === "loading"
                ? "spinner"
                : "none";
        burnt.toast({
          title: typeof options.title === "string" ? options.title : String(options.title ?? ""),
          message: typeof options.description === "string" ? options.description : undefined,
          preset,
          duration:
            options.duration === null
              ? undefined
              : options.duration !== undefined
                ? options.duration / 1000
                : undefined,
        });
      });
      // Return a synthetic id — burnt doesn't expose one. Callers can't
      // close a burnt toast programmatically on native, so this is a
      // non-issue in practice. On web we return the real id.
      return "native";
    },
    [fallback],
  );

  return useMemo(
    () =>
      Object.assign(fire, {
        close: (id: string) => {
          if (Platform.OS === "web") fallback.close(id);
          // burnt has no imperative-close API; drop.
        },
        closeAll: () => {
          if (Platform.OS === "web") fallback.closeAll();
        },
      }),
    [fire, fallback],
  );
}
