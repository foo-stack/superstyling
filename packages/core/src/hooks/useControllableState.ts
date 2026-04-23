import { useCallback, useRef, useState } from "react";

/**
 * useControllableState — unified controlled + uncontrolled state. When
 * `value` is provided the hook is controlled; otherwise it manages its
 * own internal state seeded from `defaultValue`. Change-notification
 * via `onChange` fires in both modes.
 *
 *   const [value, setValue] = useControllableState({
 *     value: props.value,
 *     defaultValue: 0,
 *     onChange: props.onChange,
 *   });
 */

export interface UseControllableStateProps<T> {
  value?: T;
  defaultValue?: T | (() => T);
  onChange?: (next: T) => void;
}

export function useControllableState<T>(
  props: UseControllableStateProps<T>,
): [T, (next: T | ((prev: T) => T)) => void] {
  const { value: controlled, defaultValue, onChange } = props;
  const isControlled = controlled !== undefined;

  const [local, setLocal] = useState<T>(() => {
    if (typeof defaultValue === "function") return (defaultValue as () => T)();
    return defaultValue as T;
  });
  const value = isControlled ? (controlled as T) : local;

  // Keep latest in a ref so setState callbacks work on controlled values.
  const valueRef = useRef(value);
  valueRef.current = value;

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved =
        typeof next === "function" ? (next as (prev: T) => T)(valueRef.current) : next;
      if (!isControlled) setLocal(resolved);
      onChange?.(resolved);
    },
    [isControlled, onChange],
  );

  return [value, setValue];
}
