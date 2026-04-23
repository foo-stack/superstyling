import { useCallback, useMemo, useState } from "react";

/**
 * useBoolean — boolean state with tuple-return ergonomics. Chakra-shaped.
 *
 *   const [flag, { on, off, toggle }] = useBoolean();
 */

export interface UseBooleanControls {
  on: () => void;
  off: () => void;
  toggle: () => void;
}

export function useBoolean(initialState: boolean = false): [boolean, UseBooleanControls] {
  const [value, setValue] = useState(initialState);
  const on = useCallback(() => setValue(true), []);
  const off = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue((v) => !v), []);
  const controls = useMemo(() => ({ on, off, toggle }), [on, off, toggle]);
  return [value, controls];
}
