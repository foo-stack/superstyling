"use client";

import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  type ClipboardEvent,
} from "react";
import { Input as TamaguiInput } from "@tamagui/input";
import { XStack } from "tamagui";

/**
 * PinInput — N independent single-character inputs with auto-advance and
 * paste-spread. Matches Chakra's pattern:
 *
 *   <PinInput value={pin} onChange={setPin} length={4} type="number">
 *     <PinInput.Field />
 *     <PinInput.Field />
 *     <PinInput.Field />
 *     <PinInput.Field />
 *   </PinInput>
 */

export interface PinInputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  /** Number of fields. Defaults to the number of `.Field` children. */
  length?: number;
  /** Allowed character type. `"number"` = digits, `"alphanumeric"` = letters + digits. */
  type?: "number" | "alphanumeric";
  mask?: boolean;
  /** Auto-focus the first field on mount. */
  autoFocus?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  size?: "sm" | "md" | "lg";
  children?: ReactNode;
}

interface PinInputContextValue {
  chars: string[];
  setChar: (index: number, char: string) => void;
  focusIndex: (index: number) => void;
  fieldIndex: (self: number) => number; // just returns `self`; used so .Field items can report an index on click
  size: NonNullable<PinInputProps["size"]>;
  mask: boolean;
  isDisabled: boolean;
  isInvalid: boolean;
  type: NonNullable<PinInputProps["type"]>;
}

const PinInputContext = createContext<PinInputContextValue | null>(null);

function usePinInput() {
  const ctx = useContext(PinInputContext);
  if (!ctx) {
    throw new Error("[superstyling] PinInput.Field must be rendered inside <PinInput>");
  }
  return ctx;
}

function PinInputRoot(props: PinInputProps) {
  const {
    value: controlled,
    defaultValue = "",
    onChange,
    onComplete,
    length,
    type = "number",
    mask = false,
    autoFocus,
    isDisabled = false,
    isInvalid = false,
    size = "md",
    children,
  } = props;

  // Count .Field children to determine effective length when not provided.
  const count = useMemo(() => {
    if (length !== undefined) return length;
    return Children.toArray(children).filter(isValidElement).length || 4;
  }, [length, children]);

  const [local, setLocal] = useState<string>(defaultValue);
  const isControlled = controlled !== undefined;
  const raw = isControlled ? (controlled as string) : local;

  const chars = useMemo(() => {
    const out = Array.from({ length: count }, () => "");
    for (let i = 0; i < Math.min(count, raw.length); i++) out[i] = raw[i] ?? "";
    return out;
  }, [raw, count]);

  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const allowChar = useCallback(
    (c: string) => (type === "number" ? /[0-9]/.test(c) : /[0-9a-zA-Z]/.test(c)),
    [type],
  );

  const commit = useCallback(
    (nextChars: string[]) => {
      const joined = nextChars.join("");
      if (!isControlled) setLocal(joined);
      onChange?.(joined);
      if (joined.length === count && nextChars.every((c) => c !== "")) {
        onComplete?.(joined);
      }
    },
    [isControlled, onChange, onComplete, count],
  );

  const setChar = useCallback(
    (index: number, char: string) => {
      if (char && !allowChar(char)) return;
      const next = [...chars];
      next[index] = char;
      commit(next);
    },
    [chars, commit, allowChar],
  );

  const focusIndex = useCallback((index: number) => {
    const el = refs.current[index];
    if (el && typeof (el as unknown as { focus: () => void }).focus === "function") {
      (el as unknown as { focus: () => void }).focus();
    }
  }, []);

  const ctx = useMemo<PinInputContextValue>(
    () => ({
      chars,
      setChar,
      focusIndex,
      fieldIndex: (n) => n,
      size,
      mask,
      isDisabled,
      isInvalid,
      type,
    }),
    [chars, setChar, focusIndex, size, mask, isDisabled, isInvalid, type],
  );

  // Clone children to inject sequential index + ref-registering.
  let i = 0;
  const kids = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    const disp = (child.type as { displayName?: string })?.displayName;
    if (disp === "PinInput.Field") {
      const myIdx = i++;
      return cloneElement(
        child as ReactElement<Record<string, unknown>>,
        {
          ...(child.props as object),
          __index: myIdx,
          __refSetter: (el: HTMLInputElement | null) => {
            refs.current[myIdx] = el;
          },
          __autoFocusFirst: autoFocus && myIdx === 0,
        } as never,
      );
    }
    return child;
  });

  return (
    <PinInputContext.Provider value={ctx}>
      <XStack gap="$2">{kids}</XStack>
    </PinInputContext.Provider>
  );
}
PinInputRoot.displayName = "PinInput";

// ────────────────────────────────────────────────────────────────────────
// Field

type FieldProps = ComponentProps<typeof TamaguiInput> & {
  __index?: number;
  __refSetter?: (el: HTMLInputElement | null) => void;
  __autoFocusFirst?: boolean;
};

const SIZE_BOX: Record<NonNullable<PinInputProps["size"]>, number> = {
  sm: 32,
  md: 40,
  lg: 48,
};

const PinInputField = forwardRef<unknown, FieldProps>(function PinInputField(props, ref) {
  const ctx = usePinInput();
  const { __index = 0, __refSetter, __autoFocusFirst, ...rest } = props;
  const char = ctx.chars[__index] ?? "";
  const box = SIZE_BOX[ctx.size];

  const handleChangeText = (next: string) => {
    // Mobile and some desktop cases deliver multi-char drops here.
    if (next.length > 1) {
      const chars = next.split("");
      let cursor = __index;
      const patched = [...ctx.chars];
      for (const c of chars) {
        if (cursor >= patched.length) break;
        if (!/[0-9a-zA-Z]/.test(c)) continue;
        patched[cursor] = c;
        cursor++;
      }
      const joined = patched.join("");
      ctx.setChar(__index, patched[__index] ?? "");
      // Propagate the rest via a subsequent commit — simplest: set last char.
      for (let k = __index + 1; k < cursor; k++) ctx.setChar(k, patched[k] ?? "");
      ctx.focusIndex(Math.min(cursor, patched.length - 1));
      void joined;
      return;
    }
    ctx.setChar(__index, next);
    if (next && __index < ctx.chars.length - 1) ctx.focusIndex(__index + 1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && char === "" && __index > 0) {
      e.preventDefault();
      ctx.focusIndex(__index - 1);
    } else if (e.key === "ArrowLeft" && __index > 0) {
      e.preventDefault();
      ctx.focusIndex(__index - 1);
    } else if (e.key === "ArrowRight" && __index < ctx.chars.length - 1) {
      e.preventDefault();
      ctx.focusIndex(__index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData?.getData("text") ?? "";
    if (pasted.length > 1) {
      e.preventDefault();
      handleChangeText(pasted);
    }
  };

  return (
    <TamaguiInput
      ref={
        ((el: HTMLInputElement | null) => {
          __refSetter?.(el);
          if (typeof ref === "function") ref(el);
          else if (ref) (ref as { current: unknown }).current = el;
        }) as never
      }
      value={char}
      onChangeText={handleChangeText}
      onKeyDown={handleKeyDown as never}
      onPaste={handlePaste as never}
      width={box}
      height={box}
      paddingHorizontal={0}
      textAlign="center"
      fontSize={18}
      fontWeight="600"
      maxLength={1}
      inputMode={ctx.type === "number" ? "numeric" : "text"}
      keyboardType={ctx.type === "number" ? "number-pad" : "default"}
      secureTextEntry={ctx.mask}
      // oxlint-disable-next-line jsx-a11y/no-autofocus -- opt-in via autoFocus prop on root PinInput
      autoFocus={__autoFocusFirst}
      disabled={ctx.isDisabled}
      {...(rest as ComponentProps<typeof TamaguiInput>)}
    />
  );
});
PinInputField.displayName = "PinInput.Field";

export const PinInput = Object.assign(PinInputRoot, { Field: PinInputField });
