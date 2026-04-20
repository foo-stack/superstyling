import {
  createContext,
  forwardRef,
  useContext,
  type ComponentProps,
  type ElementRef,
  type ReactNode,
} from "react";
import { RadioGroup as TamaguiRadioGroup } from "@tamagui/radio-group";
import { Text as TamaguiText, Theme, XStack } from "tamagui";
import { useTranslatedProps, type PseudoPropsMixin, type SxPropMixin } from "./common";
import { useFormControlProps, type InputAriaProps } from "./FormControl";

export type RadioSize = "sm" | "md" | "lg";

const RadioSizeContext = createContext<RadioSize>("md");
const RadioInvalidContext = createContext<boolean>(false);

// ────────────────────────────────────────────────────────────────────────
// RadioGroup

type TamaguiRadioGroupProps = ComponentProps<typeof TamaguiRadioGroup>;
type TamaguiRadioGroupBase = Omit<
  TamaguiRadioGroupProps,
  "size" | "children" | "onValueChange" | "onChange"
>;

export type RadioGroupProps = TamaguiRadioGroupBase &
  PseudoPropsMixin<Partial<TamaguiRadioGroupBase>> &
  SxPropMixin<Partial<TamaguiRadioGroupBase> & PseudoPropsMixin<Partial<TamaguiRadioGroupBase>>> &
  InputAriaProps & {
    size?: RadioSize;
    colorScheme?: string;
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    isDisabled?: boolean;
    isInvalid?: boolean;
    isReadOnly?: boolean;
    isRequired?: boolean;
    children?: ReactNode;
  };

export type RadioGroupElement = ElementRef<typeof TamaguiRadioGroup>;

export const RadioGroup = forwardRef<RadioGroupElement, RadioGroupProps>(
  function RadioGroup(props, ref) {
    const merged = useFormControlProps<RadioGroupProps>(props);
    const {
      size = "md",
      colorScheme = "gray",
      value,
      defaultValue,
      onChange,
      isDisabled,
      isInvalid,
      isReadOnly,
      isRequired,
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
    const finallyDisabled = disabled ?? isDisabled ?? readOnly ?? isReadOnly;

    return (
      <Theme name={colorScheme}>
        <RadioSizeContext.Provider value={size}>
          <RadioInvalidContext.Provider
            value={isInvalid ?? (ariaInvalid === true || ariaInvalid === "true")}
          >
            <TamaguiRadioGroup
              ref={ref as never}
              id={id}
              value={value}
              defaultValue={defaultValue}
              onValueChange={onChange}
              disabled={finallyDisabled}
              required={required ?? isRequired}
              aria-invalid={ariaInvalid}
              aria-required={ariaRequired}
              aria-readonly={ariaReadOnly}
              aria-describedby={ariaDescribedBy}
              aria-labelledby={ariaLabelledBy}
              gap={8}
              // oxlint-disable-next-line typescript/no-explicit-any
              {...(translated as any)}
            >
              {children}
            </TamaguiRadioGroup>
          </RadioInvalidContext.Provider>
        </RadioSizeContext.Provider>
      </Theme>
    );
  },
);
RadioGroup.displayName = "RadioGroup";

// ────────────────────────────────────────────────────────────────────────
// Radio item

type TamaguiRadioItemProps = ComponentProps<typeof TamaguiRadioGroup.Item>;
type TamaguiRadioItemBase = Omit<TamaguiRadioItemProps, "size" | "children" | "value">;

export type RadioProps = TamaguiRadioItemBase & {
  value: string;
  children?: ReactNode;
  isDisabled?: boolean;
  size?: RadioSize;
};

export type RadioElement = ElementRef<typeof TamaguiRadioGroup.Item>;

const RADIO_SIZE_TOKENS: Record<RadioSize, { outer: number; inner: number; label: number }> = {
  sm: { outer: 16, inner: 8, label: 14 },
  md: { outer: 20, inner: 10, label: 16 },
  lg: { outer: 24, inner: 12, label: 18 },
};

export const Radio = forwardRef<RadioElement, RadioProps>(function Radio(props, ref) {
  const { value, children, isDisabled, size: sizeProp, ...rest } = props;
  const ctxSize = useContext(RadioSizeContext);
  const size = sizeProp ?? ctxSize;
  const invalid = useContext(RadioInvalidContext);
  const sizeT = RADIO_SIZE_TOKENS[size];

  return (
    <XStack gap={8} alignItems="center" opacity={isDisabled ? 0.4 : 1}>
      <TamaguiRadioGroup.Item
        ref={ref as never}
        value={value}
        unstyled
        disabled={isDisabled}
        width={sizeT.outer}
        height={sizeT.outer}
        borderRadius={sizeT.outer / 2}
        borderColor={invalid ? "$red9" : "$borderColor"}
        borderWidth={1}
        alignItems="center"
        justifyContent="center"
        {...rest}
      >
        <TamaguiRadioGroup.Indicator
          width={sizeT.inner}
          height={sizeT.inner}
          borderRadius={sizeT.inner / 2}
          backgroundColor="$primary"
        />
      </TamaguiRadioGroup.Item>
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
  );
});
Radio.displayName = "Radio";
