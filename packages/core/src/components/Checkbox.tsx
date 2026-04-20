import {
  forwardRef,
  useCallback,
  type ComponentProps,
  type ElementRef,
  type ReactNode,
} from "react";
import { Checkbox as TamaguiCheckbox } from "@tamagui/checkbox";
import { Text as TamaguiText, Theme, XStack } from "tamagui";
import { CheckIcon } from "@superstyling/icons";
import { useTranslatedProps, type PseudoPropsMixin, type SxPropMixin } from "./common";
import { useFormControlProps, type InputAriaProps } from "./FormControl";

export type CheckboxSize = "sm" | "md" | "lg";

type TamaguiCheckboxProps = ComponentProps<typeof TamaguiCheckbox>;
type TamaguiCheckboxBase = Omit<TamaguiCheckboxProps, "size" | "children" | "onChange">;

export type CheckboxProps = TamaguiCheckboxBase &
  PseudoPropsMixin<Partial<TamaguiCheckboxBase>> &
  SxPropMixin<Partial<TamaguiCheckboxBase> & PseudoPropsMixin<Partial<TamaguiCheckboxBase>>> &
  InputAriaProps & {
    size?: CheckboxSize;
    colorScheme?: string;
    isChecked?: boolean;
    defaultIsChecked?: boolean;
    isInvalid?: boolean;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isRequired?: boolean;
    onChange?: (checked: boolean) => void;
    children?: ReactNode;
  };

export type CheckboxElement = ElementRef<typeof TamaguiCheckbox>;

const SIZE_TOKENS: Record<CheckboxSize, { box: number; icon: number; label: number }> = {
  sm: { box: 16, icon: 10, label: 14 },
  md: { box: 20, icon: 14, label: 16 },
  lg: { box: 24, icon: 18, label: 18 },
};

export const Checkbox = forwardRef<CheckboxElement, CheckboxProps>(function Checkbox(props, ref) {
  const merged = useFormControlProps<CheckboxProps>(props);
  const {
    size = "md",
    colorScheme = "gray",
    isChecked,
    defaultIsChecked,
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
    onChange,
    children,
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
  const finallyDisabled = disabled ?? isDisabled ?? readOnly ?? isReadOnly;
  const handleCheckedChange = useCallback(
    (c: boolean | "indeterminate") => onChange?.(c === true),
    [onChange],
  );

  return (
    <Theme name={colorScheme}>
      <XStack gap={8} alignItems="center" opacity={(disabled ?? isDisabled) ? 0.4 : 1}>
        <TamaguiCheckbox
          ref={ref as never}
          id={id}
          unstyled
          checked={isChecked}
          defaultChecked={defaultIsChecked}
          onCheckedChange={onChange ? handleCheckedChange : undefined}
          disabled={finallyDisabled}
          required={required ?? isRequired}
          aria-invalid={ariaInvalid}
          aria-required={ariaRequired}
          aria-readonly={ariaReadOnly}
          aria-describedby={ariaDescribedBy}
          aria-labelledby={ariaLabelledBy}
          width={sizeT.box}
          height={sizeT.box}
          backgroundColor={isChecked ? "$primary" : "transparent"}
          borderColor={invalid ? "$red9" : "$borderColor"}
          borderWidth={1}
          borderRadius={4}
          alignItems="center"
          justifyContent="center"
          // oxlint-disable-next-line typescript/no-explicit-any
          {...(translated as any)}
        >
          <TamaguiCheckbox.Indicator>
            <CheckIcon size={sizeT.icon} color="$primaryContrast" />
          </TamaguiCheckbox.Indicator>
        </TamaguiCheckbox>
        {children != null ? (
          typeof children === "string" || typeof children === "number" ? (
            <TamaguiText fontSize={sizeT.label} color="$foreground">
              {children}
            </TamaguiText>
          ) : (
            children
          )
        ) : null}
      </XStack>
    </Theme>
  );
});
Checkbox.displayName = "Checkbox";
