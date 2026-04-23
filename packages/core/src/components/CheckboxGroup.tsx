import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";

/**
 * CheckboxGroup — shared selected-values context for a set of Checkboxes.
 * Children read their `isChecked` from the group's value array via the
 * `useCheckboxGroup` hook and report toggles back to it. Matches Chakra's
 * `<CheckboxGroup value={...} onChange={...}>` pattern.
 *
 * Individual `<Checkbox value="opt-a">` items opt-in by consuming the
 * context. Checkboxes without a `value` prop operate standalone as before.
 */

export interface CheckboxGroupContextValue {
  value: (string | number)[];
  onToggle: (itemValue: string | number) => void;
  /** Size / colorScheme / isDisabled propagated to every child. */
  size?: "sm" | "md" | "lg";
  colorScheme?: string;
  isDisabled?: boolean;
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

export type CheckboxGroupProps = {
  value?: (string | number)[];
  defaultValue?: (string | number)[];
  onChange?: (values: (string | number)[]) => void;
  size?: CheckboxGroupContextValue["size"];
  colorScheme?: string;
  isDisabled?: boolean;
  children?: ReactNode;
};

export function CheckboxGroup(props: CheckboxGroupProps) {
  const { value, defaultValue, onChange, size, colorScheme, isDisabled, children } = props;

  // Simplified: fully controlled OR uncontrolled with defaultValue. When
  // uncontrolled, we hold state via a tiny inline closure since React 19's
  // `useState` is fine here but kept simple.
  const isControlled = value !== undefined;
  const [localValue, setLocalValue] = useInitialState(defaultValue ?? []);
  const current = isControlled ? (value ?? []) : localValue;

  const onToggle = useCallback(
    (itemValue: string | number) => {
      const next = current.includes(itemValue)
        ? current.filter((v) => v !== itemValue)
        : [...current, itemValue];
      if (!isControlled) setLocalValue(next);
      onChange?.(next);
    },
    [current, isControlled, onChange, setLocalValue],
  );

  const ctx = useMemo<CheckboxGroupContextValue>(
    () => ({ value: current, onToggle, size, colorScheme, isDisabled }),
    [current, onToggle, size, colorScheme, isDisabled],
  );

  return <CheckboxGroupContext.Provider value={ctx}>{children}</CheckboxGroupContext.Provider>;
}
CheckboxGroup.displayName = "CheckboxGroup";

/** Reads the CheckboxGroup context. Returns `null` when not inside a group. */
export function useCheckboxGroup(): CheckboxGroupContextValue | null {
  return useContext(CheckboxGroupContext);
}

// Minimal state hook wrapper that avoids a named-import `useState` at the top
// of the file (keeps the public-api surface tidy). Functionally identical to
// `React.useState(initial)`.
import { useState } from "react";
function useInitialState<T>(initial: T): [T, (next: T) => void] {
  const [v, setV] = useState<T>(initial);
  return [v, setV];
}
