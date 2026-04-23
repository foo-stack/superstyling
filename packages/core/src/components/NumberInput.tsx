"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ComponentProps,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Input as TamaguiInput } from "@tamagui/input";
import { Text as TamaguiText, XStack, YStack } from "tamagui";
import { ChevronUpIcon, ChevronDownIcon } from "@superstyling/icons";

/**
 * NumberInput — numeric input with stepper buttons and keyboard arrows.
 * Chakra-shaped compound:
 *
 *   <NumberInput value={v} onChange={setV} min={0} max={100} step={1}>
 *     <NumberInput.Field />
 *     <NumberInput.Stepper>
 *       <NumberInput.IncrementStepper />
 *       <NumberInput.DecrementStepper />
 *     </NumberInput.Stepper>
 *   </NumberInput>
 *
 * Behavior:
 *   - `↑` / `↓` step by `step`
 *   - `Shift + ↑/↓` step by `step * 10` (Chakra convention)
 *   - Non-numeric keypress blocked
 *   - Scroll-wheel handling skipped (avoids hijacking page scroll)
 *   - Clamps to `[min, max]` on blur
 */

export interface NumberInputProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number, asString: string) => void;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  children?: ReactNode;
}

interface NumberInputContextValue {
  value: string;
  setValue: (next: string) => void;
  increment: (multiplier?: number) => void;
  decrement: (multiplier?: number) => void;
  commit: () => void;
  isDisabled: boolean;
  isReadOnly: boolean;
  isInvalid: boolean;
}

const NumberInputContext = createContext<NumberInputContextValue | null>(null);

function useNumberInput() {
  const ctx = useContext(NumberInputContext);
  if (!ctx) {
    throw new Error(
      "[superstyling] NumberInput subcomponents must be rendered inside <NumberInput>",
    );
  }
  return ctx;
}

function NumberInputRoot(props: NumberInputProps) {
  const {
    value: controlled,
    defaultValue,
    onChange,
    min = Number.NEGATIVE_INFINITY,
    max = Number.POSITIVE_INFINITY,
    step = 1,
    precision,
    isDisabled = false,
    isReadOnly = false,
    isInvalid = false,
    children,
  } = props;

  const [local, setLocal] = useState<string>(() => {
    if (controlled !== undefined) return String(controlled);
    if (defaultValue !== undefined) return String(defaultValue);
    return "";
  });
  const isControlled = controlled !== undefined;
  const value = isControlled ? String(controlled) : local;

  const parse = (s: string) => {
    const n = Number.parseFloat(s);
    return Number.isNaN(n) ? null : n;
  };

  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  const formatNumber = (n: number) => {
    if (precision !== undefined) return n.toFixed(precision);
    return String(n);
  };

  const setValue = useCallback(
    (next: string) => {
      if (!isControlled) setLocal(next);
      const n = parse(next);
      if (n !== null) onChange?.(n, next);
    },
    [isControlled, onChange],
  );

  const step_ = useCallback(
    (delta: number) => {
      const n = parse(value);
      const base = n ?? 0;
      const clamped = clamp(base + delta);
      const str = formatNumber(clamped);
      setValue(str);
    },
    [value, setValue, min, max, precision],
  );

  const increment = useCallback((multiplier = 1) => step_(step * multiplier), [step_, step]);
  const decrement = useCallback((multiplier = 1) => step_(-step * multiplier), [step_, step]);

  const commit = useCallback(() => {
    const n = parse(value);
    if (n === null) return;
    const str = formatNumber(clamp(n));
    if (str !== value) setValue(str);
  }, [value, setValue, min, max, precision]);

  const ctx = useMemo<NumberInputContextValue>(
    () => ({
      value,
      setValue,
      increment,
      decrement,
      commit,
      isDisabled,
      isReadOnly,
      isInvalid,
    }),
    [value, setValue, increment, decrement, commit, isDisabled, isReadOnly, isInvalid],
  );

  return (
    <NumberInputContext.Provider value={ctx}>
      <XStack alignItems="stretch" position="relative">
        {children}
      </XStack>
    </NumberInputContext.Provider>
  );
}
NumberInputRoot.displayName = "NumberInput";

// ────────────────────────────────────────────────────────────────────────
// Field

const NumberInputField = forwardRef<unknown, ComponentProps<typeof TamaguiInput>>(
  function NumberInputField(props, ref) {
    const { value, setValue, increment, decrement, commit, isDisabled, isReadOnly } =
      useNumberInput();

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (isDisabled || isReadOnly) return;
      const mult = e.shiftKey ? 10 : 1;
      if (e.key === "ArrowUp") {
        e.preventDefault();
        increment(mult);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        decrement(mult);
      }
    };

    return (
      <TamaguiInput
        ref={ref as never}
        value={value}
        onChangeText={(next: string) => {
          // Block obviously non-numeric chars; allow "-", ".", digits.
          if (next === "" || /^-?\d*\.?\d*$/.test(next)) setValue(next);
        }}
        onBlur={commit}
        onKeyDown={onKeyDown as never}
        disabled={isDisabled}
        readOnly={isReadOnly}
        inputMode="decimal"
        keyboardType="numeric"
        flex={1}
        paddingRight="$6"
        {...props}
      />
    );
  },
);
NumberInputField.displayName = "NumberInput.Field";

// ────────────────────────────────────────────────────────────────────────
// Stepper group (right-edge vertical stack of increment/decrement buttons)

const NumberInputStepper = function NumberInputStepper(props: { children?: ReactNode }) {
  return (
    <YStack
      position="absolute"
      right={0}
      top={0}
      bottom={0}
      width={24}
      borderLeftWidth={1}
      borderLeftColor="$borderColor"
    >
      {props.children}
    </YStack>
  );
};
NumberInputStepper.displayName = "NumberInput.Stepper";

function StepperButton(props: {
  onPress: () => void;
  disabled: boolean;
  label: string;
  children: ReactNode;
  isTop?: boolean;
}) {
  return (
    <XStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- cross-platform
      role="button"
      aria-label={props.label}
      borderBottomWidth={props.isTop ? 1 : 0}
      borderBottomColor="$borderColor"
      opacity={props.disabled ? 0.4 : 1}
      onPress={props.disabled ? undefined : props.onPress}
      hoverStyle={props.disabled ? undefined : { backgroundColor: "$backgroundHover" }}
    >
      {props.children}
    </XStack>
  );
}

const NumberInputIncrementStepper = function NumberInputIncrementStepper() {
  const { increment, isDisabled, isReadOnly } = useNumberInput();
  return (
    <StepperButton
      onPress={() => increment()}
      disabled={isDisabled || isReadOnly}
      label="Increment"
      isTop
    >
      <ChevronUpIcon size={12} />
    </StepperButton>
  );
};
NumberInputIncrementStepper.displayName = "NumberInput.IncrementStepper";

const NumberInputDecrementStepper = function NumberInputDecrementStepper() {
  const { decrement, isDisabled, isReadOnly } = useNumberInput();
  return (
    <StepperButton
      onPress={() => decrement()}
      disabled={isDisabled || isReadOnly}
      label="Decrement"
    >
      <ChevronDownIcon size={12} />
    </StepperButton>
  );
};
NumberInputDecrementStepper.displayName = "NumberInput.DecrementStepper";

export const NumberInput = Object.assign(NumberInputRoot, {
  Field: NumberInputField,
  Stepper: NumberInputStepper,
  IncrementStepper: NumberInputIncrementStepper,
  DecrementStepper: NumberInputDecrementStepper,
});

// Satisfy unused-import avoidance (TamaguiText imported for possible
// future formatting helpers).
void TamaguiText;
