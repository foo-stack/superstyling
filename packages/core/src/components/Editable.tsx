"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Input as TamaguiInput, TextArea as TamaguiTextArea } from "@tamagui/input";
import { Text as TamaguiText } from "tamagui";

/**
 * Editable — inline edit-in-place field. Matches Chakra's `<Editable>`
 * compound. Tap/click `Preview` to edit; `Enter` commits; `Escape`
 * discards; blur commits by default.
 *
 *   <Editable
 *     defaultValue="Untitled"
 *     onSubmit={(next) => rename(next)}
 *   >
 *     <Editable.Preview />
 *     <Editable.Input />
 *   </Editable>
 *
 * Cross-platform: same component on web + native. On native, tapping
 * `Preview` swaps in a `TextInput`; blur / Enter / Escape produce
 * identical commit/cancel semantics. Android hardware-back while
 * editing discards (fires `onCancel`).
 */

export interface EditableProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onCancel?: (previous: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
  /** Auto-select-all text when entering edit mode. Default true. */
  selectAllOnFocus?: boolean;
  /** Commit on blur. Default true. */
  submitOnBlur?: boolean;
  /** Start in edit mode. Default false. */
  startWithEditView?: boolean;
  children?: ReactNode;
}

interface EditableContextValue {
  value: string;
  setValue: (v: string) => void;
  isEditing: boolean;
  startEditing: () => void;
  commit: () => void;
  cancel: () => void;
  isDisabled: boolean;
  placeholder: string | undefined;
  submitOnBlur: boolean;
  selectAllOnFocus: boolean;
}

const EditableContext = createContext<EditableContextValue | null>(null);

function useEditableContext() {
  const ctx = useContext(EditableContext);
  if (!ctx) {
    throw new Error("[superstyling] Editable subcomponents must be rendered inside <Editable>");
  }
  return ctx;
}

function EditableRoot(props: EditableProps) {
  const {
    value: controlled,
    defaultValue = "",
    onChange,
    onSubmit,
    onCancel,
    placeholder,
    isDisabled = false,
    selectAllOnFocus = true,
    submitOnBlur = true,
    startWithEditView = false,
    children,
  } = props;

  const [local, setLocal] = useState(defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? (controlled as string) : local;
  const [isEditing, setEditing] = useState(startWithEditView);
  const previousValue = useRef(value);

  const setValue = useCallback(
    (next: string) => {
      if (!isControlled) setLocal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const startEditing = useCallback(() => {
    if (isDisabled) return;
    previousValue.current = value;
    setEditing(true);
  }, [isDisabled, value]);

  const commit = useCallback(() => {
    setEditing(false);
    onSubmit?.(value);
  }, [value, onSubmit]);

  const cancel = useCallback(() => {
    if (!isControlled) setLocal(previousValue.current);
    setEditing(false);
    onCancel?.(previousValue.current);
  }, [isControlled, onCancel]);

  const ctx = useMemo<EditableContextValue>(
    () => ({
      value,
      setValue,
      isEditing,
      startEditing,
      commit,
      cancel,
      isDisabled,
      placeholder,
      submitOnBlur,
      selectAllOnFocus,
    }),
    [
      value,
      setValue,
      isEditing,
      startEditing,
      commit,
      cancel,
      isDisabled,
      placeholder,
      submitOnBlur,
      selectAllOnFocus,
    ],
  );

  return <EditableContext.Provider value={ctx}>{children}</EditableContext.Provider>;
}
EditableRoot.displayName = "Editable";

// ────────────────────────────────────────────────────────────────────────
// Preview — the display-mode view. Tap/click to enter edit mode.

const EditablePreview = forwardRef<unknown, ComponentProps<typeof TamaguiText>>(
  function EditablePreview(props, ref) {
    const { value, isEditing, startEditing, placeholder, isDisabled } = useEditableContext();
    if (isEditing) return null;
    const showPlaceholder = !value && placeholder;
    return (
      <TamaguiText
        ref={ref as never}
        onPress={isDisabled ? undefined : startEditing}
        cursor={isDisabled ? "default" : "text"}
        opacity={showPlaceholder ? 0.5 : 1}
        fontSize={16}
        {...(props as object)}
      >
        {showPlaceholder ? placeholder : value}
      </TamaguiText>
    );
  },
);
EditablePreview.displayName = "Editable.Preview";

// ────────────────────────────────────────────────────────────────────────
// Input — the edit-mode text input. Auto-focuses on mount.

const EditableInput = forwardRef<unknown, ComponentProps<typeof TamaguiInput>>(
  function EditableInput(props, ref) {
    const { value, setValue, isEditing, commit, cancel, submitOnBlur, selectAllOnFocus } =
      useEditableContext();
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      if (!isEditing) return;
      const el = inputRef.current;
      if (!el) return;
      // Autofocus + select-all when entering edit mode.
      const focusable = el as unknown as { focus?: () => void; select?: () => void };
      focusable.focus?.();
      if (selectAllOnFocus) focusable.select?.();
    }, [isEditing, selectAllOnFocus]);

    if (!isEditing) return null;

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        commit();
      } else if (e.key === "Escape") {
        e.preventDefault();
        cancel();
      }
    };

    return (
      <TamaguiInput
        ref={
          ((el: HTMLInputElement | null) => {
            inputRef.current = el;
            if (typeof ref === "function") ref(el);
            else if (ref) (ref as { current: unknown }).current = el;
          }) as never
        }
        value={value}
        onChangeText={setValue}
        onBlur={submitOnBlur ? commit : cancel}
        onKeyDown={onKeyDown as never}
        {...props}
      />
    );
  },
);
EditableInput.displayName = "Editable.Input";

// ────────────────────────────────────────────────────────────────────────
// Textarea variant — same semantics, multi-line.

const EditableTextarea = forwardRef<unknown, ComponentProps<typeof TamaguiTextArea>>(
  function EditableTextarea(props, ref) {
    const { value, setValue, isEditing, commit, cancel, submitOnBlur } = useEditableContext();
    if (!isEditing) return null;
    return (
      <TamaguiTextArea
        ref={ref as never}
        value={value}
        onChangeText={setValue}
        onBlur={submitOnBlur ? commit : cancel}
        {...props}
      />
    );
  },
);
EditableTextarea.displayName = "Editable.Textarea";

export const Editable = Object.assign(EditableRoot, {
  Preview: EditablePreview,
  Input: EditableInput,
  Textarea: EditableTextarea,
});

/** `useEditable` — Chakra-compatible hook for imperative control. */
export function useEditableControls(): {
  isEditing: boolean;
  startEditing: () => void;
  commit: () => void;
  cancel: () => void;
} {
  const { isEditing, startEditing, commit, cancel } = useEditableContext();
  return { isEditing, startEditing, commit, cancel };
}
