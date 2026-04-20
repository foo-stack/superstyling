import { forwardRef, type ComponentProps, type ElementRef, type ReactNode } from "react";
import { Switch as TamaguiSwitch } from "@tamagui/switch";
import { Text as TamaguiText, Theme, XStack } from "tamagui";
import { useTranslatedProps, type PseudoPropsMixin, type SxPropMixin } from "./common";
import { useFormControlProps, type InputAriaProps } from "./FormControl";

export type SwitchSize = "sm" | "md" | "lg";

type TamaguiSwitchProps = ComponentProps<typeof TamaguiSwitch>;
type TamaguiSwitchBase = Omit<TamaguiSwitchProps, "size" | "children" | "onChange">;

export type SwitchProps = TamaguiSwitchBase &
  PseudoPropsMixin<Partial<TamaguiSwitchBase>> &
  SxPropMixin<Partial<TamaguiSwitchBase> & PseudoPropsMixin<Partial<TamaguiSwitchBase>>> &
  InputAriaProps & {
    size?: SwitchSize;
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

export type SwitchElement = ElementRef<typeof TamaguiSwitch>;

const SIZE_TOKENS: Record<
  SwitchSize,
  { width: number; height: number; thumb: number; label: number }
> = {
  sm: { width: 28, height: 16, thumb: 12, label: 14 },
  md: { width: 36, height: 20, thumb: 16, label: 16 },
  lg: { width: 44, height: 24, thumb: 20, label: 18 },
};

export const Switch = forwardRef<SwitchElement, SwitchProps>(function Switch(props, ref) {
  const merged = useFormControlProps<SwitchProps>(props);
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

  return (
    <Theme name={colorScheme}>
      <XStack gap={8} alignItems="center" opacity={(disabled ?? isDisabled) ? 0.4 : 1}>
        <TamaguiSwitch
          ref={ref as never}
          id={id}
          unstyled
          checked={isChecked}
          defaultChecked={defaultIsChecked}
          onCheckedChange={onChange}
          disabled={finallyDisabled}
          required={required ?? isRequired}
          aria-invalid={ariaInvalid}
          aria-required={ariaRequired}
          aria-readonly={ariaReadOnly}
          aria-describedby={ariaDescribedBy}
          aria-labelledby={ariaLabelledBy}
          width={sizeT.width}
          height={sizeT.height}
          borderRadius={sizeT.height / 2}
          backgroundColor={isChecked ? "$primary" : "$color4"}
          borderColor={invalid ? "$red9" : "transparent"}
          borderWidth={invalid ? 1 : 0}
          padding={(sizeT.height - sizeT.thumb) / 2}
          // oxlint-disable-next-line typescript/no-explicit-any
          {...(translated as any)}
        >
          <TamaguiSwitch.Thumb
            width={sizeT.thumb}
            height={sizeT.thumb}
            borderRadius={sizeT.thumb / 2}
            backgroundColor="$background"
          />
        </TamaguiSwitch>
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
Switch.displayName = "Switch";
