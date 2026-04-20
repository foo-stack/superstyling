import { forwardRef, useMemo, type ComponentProps, type ElementRef } from "react";
import { Input as TamaguiInput, TextArea as TamaguiTextArea } from "@tamagui/input";
import { useTranslatedProps, type PseudoPropsMixin, type SxPropMixin } from "./common";
import { useFormControlProps } from "./FormControl";

export type InputVariant = "outline" | "filled" | "flushed" | "unstyled";
export type InputSize = "xs" | "sm" | "md" | "lg";

type TamaguiInputProps = ComponentProps<typeof TamaguiInput>;
type TamaguiInputBase = Omit<TamaguiInputProps, "size" | "variant">;

interface InputExtraProps {
  variant?: InputVariant;
  size?: InputSize;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  /** HTML input type (web). Native maps `type="password"` → `secureTextEntry`. */
  type?: string;
}

export type InputProps = TamaguiInputBase &
  PseudoPropsMixin<Partial<TamaguiInputBase>> &
  SxPropMixin<Partial<TamaguiInputBase> & PseudoPropsMixin<Partial<TamaguiInputBase>>> &
  InputExtraProps;

export type InputElement = ElementRef<typeof TamaguiInput>;

const SIZE_TOKENS: Record<InputSize, { height: number; px: number; fontSize: number }> = {
  xs: { height: 24, px: 8, fontSize: 12 },
  sm: { height: 32, px: 12, fontSize: 14 },
  md: { height: 40, px: 12, fontSize: 16 },
  lg: { height: 48, px: 16, fontSize: 18 },
};

function variantStyles(variant: InputVariant, isInvalid: boolean) {
  const invalidBorder = "$red9";
  switch (variant) {
    case "filled":
      return {
        backgroundColor: "$color3",
        borderColor: isInvalid ? invalidBorder : "transparent",
        borderWidth: 2,
        focusBorderColor: isInvalid ? invalidBorder : "$primary",
        focusBg: "transparent",
      } as const;
    case "flushed":
      return {
        backgroundColor: "transparent",
        borderColor: isInvalid ? invalidBorder : "$borderColor",
        borderBottomWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderRadius: 0,
        focusBorderColor: isInvalid ? invalidBorder : "$primary",
        focusBg: "transparent",
      } as const;
    case "unstyled":
      return {
        backgroundColor: "transparent",
        borderWidth: 0,
        focusBorderColor: "transparent",
        focusBg: "transparent",
      } as const;
    case "outline":
    default:
      return {
        backgroundColor: "transparent",
        borderColor: isInvalid ? invalidBorder : "$borderColor",
        borderWidth: 1,
        focusBorderColor: isInvalid ? invalidBorder : "$primary",
        focusBg: "transparent",
      } as const;
  }
}

export const Input = forwardRef<InputElement, InputProps>(function Input(props, ref) {
  const merged = useFormControlProps<InputProps>(props);
  const {
    variant = "outline",
    size = "md",
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
    type,
    // Pulled off by useFormControlProps but left on `merged` — extract so they
    // don't flow to Tamagui as unknown props.
    "aria-invalid": ariaInvalid,
    "aria-required": ariaRequired,
    "aria-readonly": ariaReadOnly,
    "aria-describedby": ariaDescribedBy,
    "aria-labelledby": ariaLabelledBy,
    disabled,
    readOnly,
    required,
    id,
    ...rest
  } = merged;

  const translated = useTranslatedProps(rest as Readonly<Record<string, unknown>>);
  const sizeT = SIZE_TOKENS[size];
  const invalid = isInvalid ?? (ariaInvalid === true || ariaInvalid === "true");
  const v = variantStyles(variant, invalid);
  const finallyDisabled = disabled ?? isDisabled;
  const finallyReadOnly = readOnly ?? isReadOnly;
  const finallyRequired = required ?? isRequired;
  const secureTextEntry = type === "password" ? true : undefined;

  const focusStyle = useMemo(
    () => ({ borderColor: v.focusBorderColor, backgroundColor: v.focusBg }),
    [v.focusBorderColor, v.focusBg],
  );

  return (
    <TamaguiInput
      ref={ref as never}
      unstyled
      id={id}
      disabled={finallyDisabled}
      readOnly={finallyReadOnly}
      required={finallyRequired}
      aria-invalid={ariaInvalid}
      aria-required={ariaRequired}
      aria-readonly={ariaReadOnly}
      aria-describedby={ariaDescribedBy}
      aria-labelledby={ariaLabelledBy}
      type={type}
      secureTextEntry={secureTextEntry}
      height={sizeT.height}
      paddingHorizontal={sizeT.px}
      fontSize={sizeT.fontSize}
      color="$foreground"
      placeholderTextColor="$color10"
      backgroundColor={v.backgroundColor}
      borderColor={"borderColor" in v ? v.borderColor : undefined}
      borderWidth={"borderWidth" in v ? v.borderWidth : undefined}
      borderTopWidth={"borderTopWidth" in v ? v.borderTopWidth : undefined}
      borderBottomWidth={"borderBottomWidth" in v ? v.borderBottomWidth : undefined}
      borderLeftWidth={"borderLeftWidth" in v ? v.borderLeftWidth : undefined}
      borderRightWidth={"borderRightWidth" in v ? v.borderRightWidth : undefined}
      borderRadius={"borderRadius" in v ? v.borderRadius : 6}
      opacity={finallyDisabled ? 0.4 : 1}
      focusStyle={focusStyle}
      // oxlint-disable-next-line typescript/no-explicit-any
      {...(translated as any)}
    />
  );
});
Input.displayName = "Input";

// ────────────────────────────────────────────────────────────────────────

type TamaguiTextAreaProps = ComponentProps<typeof TamaguiTextArea>;
type TamaguiTextAreaBase = Omit<TamaguiTextAreaProps, "size" | "variant">;

export type TextareaProps = TamaguiTextAreaBase &
  PseudoPropsMixin<Partial<TamaguiTextAreaBase>> &
  SxPropMixin<Partial<TamaguiTextAreaBase> & PseudoPropsMixin<Partial<TamaguiTextAreaBase>>> &
  Omit<InputExtraProps, "type"> & {
    rows?: number;
  };

export type TextareaElement = ElementRef<typeof TamaguiTextArea>;

export const Textarea = forwardRef<TextareaElement, TextareaProps>(function Textarea(props, ref) {
  const merged = useFormControlProps<TextareaProps>(props);
  const {
    variant = "outline",
    size = "md",
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
    rows = 3,
    "aria-invalid": ariaInvalid,
    "aria-required": ariaRequired,
    "aria-readonly": ariaReadOnly,
    "aria-describedby": ariaDescribedBy,
    "aria-labelledby": ariaLabelledBy,
    disabled,
    readOnly,
    required,
    id,
    ...rest
  } = merged;

  const translated = useTranslatedProps(rest as Readonly<Record<string, unknown>>);
  const sizeT = SIZE_TOKENS[size];
  const invalid = isInvalid ?? (ariaInvalid === true || ariaInvalid === "true");
  const v = variantStyles(variant, invalid);
  const finallyDisabled = disabled ?? isDisabled;
  const finallyReadOnly = readOnly ?? isReadOnly;
  const finallyRequired = required ?? isRequired;

  const focusStyle = useMemo(
    () => ({ borderColor: v.focusBorderColor, backgroundColor: v.focusBg }),
    [v.focusBorderColor, v.focusBg],
  );

  return (
    <TamaguiTextArea
      ref={ref as never}
      unstyled
      id={id}
      multiline
      numberOfLines={rows}
      rows={rows}
      disabled={finallyDisabled}
      readOnly={finallyReadOnly}
      required={finallyRequired}
      aria-invalid={ariaInvalid}
      aria-required={ariaRequired}
      aria-readonly={ariaReadOnly}
      aria-describedby={ariaDescribedBy}
      aria-labelledby={ariaLabelledBy}
      minHeight={sizeT.height * 2}
      paddingHorizontal={sizeT.px}
      paddingVertical={sizeT.px}
      fontSize={sizeT.fontSize}
      color="$foreground"
      placeholderTextColor="$color10"
      backgroundColor={v.backgroundColor}
      borderColor={"borderColor" in v ? v.borderColor : undefined}
      borderWidth={"borderWidth" in v ? v.borderWidth : undefined}
      borderTopWidth={"borderTopWidth" in v ? v.borderTopWidth : undefined}
      borderBottomWidth={"borderBottomWidth" in v ? v.borderBottomWidth : undefined}
      borderLeftWidth={"borderLeftWidth" in v ? v.borderLeftWidth : undefined}
      borderRightWidth={"borderRightWidth" in v ? v.borderRightWidth : undefined}
      borderRadius={"borderRadius" in v ? v.borderRadius : 6}
      opacity={finallyDisabled ? 0.4 : 1}
      focusStyle={focusStyle}
      // oxlint-disable-next-line typescript/no-explicit-any
      {...(translated as any)}
    />
  );
});
Textarea.displayName = "Textarea";
