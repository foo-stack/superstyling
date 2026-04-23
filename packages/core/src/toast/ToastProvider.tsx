"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { PortalItem } from "@tamagui/portal";
import { Text as TamaguiText, XStack, YStack } from "tamagui";
import { IconButton } from "../components/IconButton";
import { CloseIcon } from "@superstyling/icons";

/**
 * Toast — ephemeral status messages. Queue lives in a Provider mounted by
 * `SuperStylingProvider`; `useToast()` returns an imperative API.
 *
 *   const toast = useToast();
 *   toast({ title: "Saved", status: "success" });
 *   toast({ title: "Something failed", status: "error", isClosable: true });
 *
 * Matches Chakra's API shape:
 *   - status: "info" | "success" | "warning" | "error" | "loading"
 *   - duration: ms before auto-dismiss (null = sticky)
 *   - position: corner/center
 *   - isClosable: show × button
 *
 * Cross-platform consistent. For platform-native feel on iOS/Android,
 * call `useNativeToast()` (separate hook, opt-in) which wraps `burnt`.
 */

export type ToastStatus = "info" | "success" | "warning" | "error" | "loading";
export type ToastPosition =
  | "top"
  | "top-left"
  | "top-right"
  | "bottom"
  | "bottom-left"
  | "bottom-right";

export interface ToastOptions {
  id?: string;
  title?: ReactNode;
  description?: ReactNode;
  status?: ToastStatus;
  /** ms before auto-dismiss. Default 5000. `null` = sticky. */
  duration?: number | null;
  position?: ToastPosition;
  isClosable?: boolean;
  /** Called when the toast dismisses (for cleanup). */
  onClose?: () => void;
}

interface ToastEntry extends Required<Omit<ToastOptions, "onClose" | "title" | "description">> {
  title?: ReactNode;
  description?: ReactNode;
  onClose?: () => void;
}

interface ToastAPI {
  (options: ToastOptions): string;
  close: (id: string) => void;
  closeAll: () => void;
}

const ToastContext = createContext<ToastAPI | null>(null);

function makeId() {
  return `t-${Math.random().toString(36).slice(2, 10)}`;
}

export function ToastProvider({ children }: { children?: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const close = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => {
      const found = prev.find((t) => t.id === id);
      found?.onClose?.();
      return prev.filter((t) => t.id !== id);
    });
  }, []);

  const closeAll = useCallback(() => {
    for (const [, timer] of timersRef.current) clearTimeout(timer);
    timersRef.current.clear();
    setToasts((prev) => {
      for (const t of prev) t.onClose?.();
      return [];
    });
  }, []);

  const push = useCallback(
    (options: ToastOptions): string => {
      const id = options.id ?? makeId();
      const entry: ToastEntry = {
        id,
        title: options.title,
        description: options.description,
        status: options.status ?? "info",
        duration: options.duration ?? 5000,
        position: options.position ?? "bottom",
        isClosable: options.isClosable ?? true,
        onClose: options.onClose,
      };
      setToasts((prev) => {
        // Replace if an id collision; otherwise append.
        const without = prev.filter((t) => t.id !== id);
        return [...without, entry];
      });
      if (entry.duration !== null) {
        const timer = setTimeout(() => close(id), entry.duration);
        timersRef.current.set(id, timer);
      }
      return id;
    },
    [close],
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      for (const [, t] of timers) clearTimeout(t);
      timers.clear();
    };
  }, []);

  const api = useMemo<ToastAPI>(() => {
    const fn = (options: ToastOptions) => push(options);
    fn.close = close;
    fn.closeAll = closeAll;
    return fn as ToastAPI;
  }, [push, close, closeAll]);

  const byPosition = useMemo(() => {
    const groups = new Map<ToastPosition, ToastEntry[]>();
    for (const t of toasts) {
      const bucket = groups.get(t.position) ?? [];
      bucket.push(t);
      groups.set(t.position, bucket);
    }
    return Array.from(groups.entries());
  }, [toasts]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <PortalItem hostName="__superstyling_toasts__">
        <ToastViewport groups={byPosition} onClose={close} />
      </PortalItem>
    </ToastContext.Provider>
  );
}

function positionStyle(position: ToastPosition): Record<string, unknown> {
  const edges: Record<string, unknown> = {};
  if (position.startsWith("top")) edges.top = 16;
  if (position.startsWith("bottom")) edges.bottom = 16;
  if (position.endsWith("left")) edges.left = 16;
  else if (position.endsWith("right")) edges.right = 16;
  else if (position === "top" || position === "bottom") {
    edges.left = 0;
    edges.right = 0;
    edges.alignItems = "center";
  }
  return edges;
}

const STATUS_COLOR: Record<ToastStatus, string> = {
  info: "$blue9",
  success: "$green9",
  warning: "$orange9",
  error: "$red9",
  loading: "$color9",
};

function ToastViewport({
  groups,
  onClose,
}: {
  groups: Array<[ToastPosition, ToastEntry[]]>;
  onClose: (id: string) => void;
}) {
  return (
    <>
      {groups.map(([position, entries]) => (
        <YStack
          key={position}
          position="absolute"
          gap="$2"
          padding="$2"
          zIndex={100_000}
          {...(positionStyle(position) as object)}
        >
          {entries.map((t) => (
            <XStack
              key={t.id}
              minWidth={260}
              maxWidth={480}
              padding="$3"
              borderRadius={8}
              backgroundColor="$background"
              borderWidth={1}
              borderColor="$borderColor"
              borderLeftWidth={4}
              borderLeftColor={STATUS_COLOR[t.status]}
              gap="$3"
              alignItems="flex-start"
            >
              <YStack flex={1} gap="$1">
                {t.title ? (
                  <TamaguiText fontWeight="600" color="$color">
                    {t.title}
                  </TamaguiText>
                ) : null}
                {t.description ? (
                  <TamaguiText fontSize={13} color="$color11">
                    {t.description}
                  </TamaguiText>
                ) : null}
              </YStack>
              {t.isClosable ? (
                <IconButton
                  aria-label="Close notification"
                  icon={<CloseIcon />}
                  variant="ghost"
                  size="xs"
                  onPress={() => onClose(t.id)}
                />
              ) : null}
            </XStack>
          ))}
        </YStack>
      ))}
    </>
  );
}

/**
 * Imperative toast API. Call `toast({...})` to fire a notification;
 * `toast.close(id)` / `toast.closeAll()` to dismiss programmatically.
 */
export function useToast(): ToastAPI {
  const api = useContext(ToastContext);
  if (!api) {
    throw new Error("[superstyling] useToast must be called inside <SuperStylingProvider>");
  }
  return api;
}
