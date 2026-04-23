import { useEffect, type RefObject } from "react";

/**
 * useOutsideClick — fire a handler when a pointer event lands outside a
 * referenced element. Web-only (document-level listener). On native the
 * pattern is usually `Pressable` with `onPressOut` on the parent container
 * — this hook becomes a no-op there for v0.2.
 *
 *   useOutsideClick({ ref, handler: () => close() });
 */

export interface UseOutsideClickProps<T extends Element = Element> {
  ref: RefObject<T | null>;
  handler: (event: PointerEvent | MouseEvent | TouchEvent) => void;
  /** Disable the listener without unmounting. */
  enabled?: boolean;
}

export function useOutsideClick<T extends Element = Element>(props: UseOutsideClickProps<T>) {
  const { ref, handler, enabled = true } = props;

  useEffect(() => {
    if (!enabled) return;
    if (typeof document === "undefined") return;

    const onEvent = (event: MouseEvent | TouchEvent) => {
      const node = ref.current;
      if (!node) return;
      const target = event.target as Node | null;
      if (target && node.contains(target)) return;
      handler(event);
    };

    document.addEventListener("mousedown", onEvent, true);
    document.addEventListener("touchstart", onEvent, true);
    return () => {
      document.removeEventListener("mousedown", onEvent, true);
      document.removeEventListener("touchstart", onEvent, true);
    };
  }, [ref, handler, enabled]);
}
