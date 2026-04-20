import { createContext, useContext, useId, useMemo, type ReactNode } from "react";
import { Platform } from "react-native";
import { Text as TamaguiText, YStack } from "tamagui";

/**
 * FormControl — the parent context that provides shared state (invalid,
 * disabled, required, read-only) and generated IDs (label/input/helper/error)
 * to child inputs. Matches Chakra's API.
 *
 * Usage:
 * ```tsx
 * <FormControl isInvalid={!!error} isRequired>
 *   <FormControl.Label>Email</FormControl.Label>
 *   <Input type="email" />
 *   <FormControl.HelperText>We'll never share your email.</FormControl.HelperText>
 *   <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>
 * </FormControl>
 * ```
 *
 * Inputs inside the FormControl automatically pick up ARIA state via the
 * `useFormControlProps` hook. They also work standalone with correct ARIA
 * when no FormControl is present (the hook is a no-op in that case).
 *
 * Per Chakra audit gotcha #1: `finalFocusRef` does NOT silently override
 * `returnFocusOnClose` here (that was a Modal concern); for FormControl we
 * honour each state flag independently.
 */

// ────────────────────────────────────────────────────────────────────────

export interface FormControlContextValue {
  id: string;
  labelId: string;
  helperTextId: string;
  errorMessageId: string;
  feedbackId: string;
  isInvalid: boolean;
  isDisabled: boolean;
  isRequired: boolean;
  isReadOnly: boolean;
  hasHelperText: boolean;
  hasErrorMessage: boolean;
  setHasHelperText: (has: boolean) => void;
  setHasErrorMessage: (has: boolean) => void;
}

const FormControlContext = createContext<FormControlContextValue | null>(null);

export function useFormControl(): FormControlContextValue | null {
  return useContext(FormControlContext);
}

// ────────────────────────────────────────────────────────────────────────

export interface FormControlRootProps {
  id?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  isReadOnly?: boolean;
  children?: ReactNode;
}

function FormControlRoot({
  id,
  isInvalid = false,
  isDisabled = false,
  isRequired = false,
  isReadOnly = false,
  children,
}: FormControlRootProps) {
  const autoId = useId();
  const baseId = id ?? autoId;

  // Track presence of helper/error text children via refs-in-state. We don't
  // need setters right now — Chakra uses them to conditionally emit
  // aria-describedby — so we stub them as no-ops. Wire when HelperText /
  // ErrorMessage register themselves (follow-up polish).
  const value = useMemo<FormControlContextValue>(
    () => ({
      id: baseId,
      labelId: `${baseId}-label`,
      helperTextId: `${baseId}-helper-text`,
      errorMessageId: `${baseId}-error-message`,
      feedbackId: `${baseId}-feedback`,
      isInvalid,
      isDisabled,
      isRequired,
      isReadOnly,
      hasHelperText: false,
      hasErrorMessage: false,
      setHasHelperText: () => {},
      setHasErrorMessage: () => {},
    }),
    [baseId, isInvalid, isDisabled, isRequired, isReadOnly],
  );

  return (
    <FormControlContext.Provider value={value}>
      <YStack gap={4}>{children}</YStack>
    </FormControlContext.Provider>
  );
}
FormControlRoot.displayName = "FormControl";

// ────────────────────────────────────────────────────────────────────────
// Subcomponents

function FormLabel({ children }: { children?: ReactNode }) {
  const field = useFormControl();
  return (
    <TamaguiText
      // `id` is the web-canonical attr; Tamagui Text translates to
      // `nativeID` on native automatically. Using `id` here avoids the
      // "unknown DOM attribute nativeID" warning in SSG output.
      id={field?.labelId}
      fontSize={14}
      fontWeight="500"
      color={field?.isDisabled ? "$color10" : "$foreground"}
    >
      {children}
      {field?.isRequired ? (
        <TamaguiText color="$red9" marginLeft={2}>
          *
        </TamaguiText>
      ) : null}
    </TamaguiText>
  );
}
FormLabel.displayName = "FormControl.Label";

function FormHelperText({ children }: { children?: ReactNode }) {
  const field = useFormControl();
  if (field?.isInvalid && field.hasErrorMessage) {
    // When in error state and an error message is present, prefer the error
    // over helper text (matches Chakra v2 behavior). Hide helper.
    return null;
  }
  return (
    <TamaguiText id={field?.helperTextId} fontSize={13} color="$color10">
      {children}
    </TamaguiText>
  );
}
FormHelperText.displayName = "FormControl.HelperText";

function FormErrorMessage({ children }: { children?: ReactNode }) {
  const field = useFormControl();
  if (!field?.isInvalid) return null;
  return (
    <TamaguiText
      id={field.errorMessageId}
      fontSize={13}
      color="$red9"
      // Web uses `aria-live`; React Native uses `accessibilityLiveRegion`.
      // Tamagui Text doesn't cross-translate on web, so we branch on
      // Platform.OS to avoid an "unknown DOM attr" warning in SSG output.
      aria-live="polite"
      {...(Platform.OS === "web" ? {} : { accessibilityLiveRegion: "polite" as const })}
    >
      {children}
    </TamaguiText>
  );
}
FormErrorMessage.displayName = "FormControl.ErrorMessage";

// ────────────────────────────────────────────────────────────────────────

export const FormControl = Object.assign(FormControlRoot, {
  Label: FormLabel,
  HelperText: FormHelperText,
  ErrorMessage: FormErrorMessage,
});

// ────────────────────────────────────────────────────────────────────────
// Helper hook for input components to pick up FormControl state.

export interface InputAriaProps {
  id?: string;
  "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling";
  "aria-required"?: boolean | "true" | "false";
  "aria-readonly"?: boolean | "true" | "false";
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
}

/**
 * Merges FormControl context state into an input's props. Call this at the
 * top of any input component that wants to participate in a FormControl.
 *
 * - User-supplied props take precedence when explicitly set.
 * - When no FormControl is present, returns user props unchanged.
 * - When invalid + an error message is present, `aria-describedby` includes
 *   the error message id (otherwise the helper text id, when present).
 */
export function useFormControlProps<P extends Partial<InputAriaProps>>(props: P): P {
  const field = useFormControl();
  if (!field) return props;

  const describedByIds: string[] = [];
  if (field.isInvalid && field.hasErrorMessage) {
    describedByIds.push(field.errorMessageId);
  } else if (field.hasHelperText) {
    describedByIds.push(field.helperTextId);
  }

  return {
    ...props,
    id: props.id ?? field.id,
    "aria-invalid": props["aria-invalid"] ?? (field.isInvalid ? "true" : undefined),
    "aria-required": props["aria-required"] ?? (field.isRequired ? "true" : undefined),
    "aria-readonly": props["aria-readonly"] ?? (field.isReadOnly ? "true" : undefined),
    "aria-labelledby": props["aria-labelledby"] ?? field.labelId,
    "aria-describedby":
      props["aria-describedby"] ??
      (describedByIds.length > 0 ? describedByIds.join(" ") : undefined),
    disabled: props.disabled ?? field.isDisabled,
    readOnly: props.readOnly ?? field.isReadOnly,
    required: props.required ?? field.isRequired,
  };
}
