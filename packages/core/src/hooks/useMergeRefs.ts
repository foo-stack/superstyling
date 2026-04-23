import { useMemo, type Ref, type MutableRefObject } from "react";

/**
 * useMergeRefs — combine multiple refs into one. Accepts function refs,
 * object refs (`.current`), and null/undefined.
 *
 *   const ref = useMergeRefs(forwardedRef, localRef);
 */

type AnyRef<T> = Ref<T> | MutableRefObject<T | null> | undefined | null;

export function useMergeRefs<T>(...refs: AnyRef<T>[]): (node: T | null) => void {
  return useMemo(() => {
    return (node: T | null) => {
      for (const ref of refs) {
        if (!ref) continue;
        if (typeof ref === "function") {
          ref(node);
        } else {
          (ref as MutableRefObject<T | null>).current = node;
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);
}
