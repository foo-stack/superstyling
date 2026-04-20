import { forwardRef, useMemo, type ComponentProps, type ElementRef, type ReactNode } from "react";
import { Select as TamaguiSelect } from "@tamagui/select";
import { Adapt } from "@tamagui/adapt";
import { Sheet } from "@tamagui/sheet";
import { Text as TamaguiText, Theme, XStack, YStack } from "tamagui";
import { CheckIcon, ChevronDownIcon } from "@superstyling/icons";
import { useTranslatedProps, type PseudoPropsMixin, type SxPropMixin } from "./common";
import { useFormControlProps, type InputAriaProps } from "./FormControl";

export type SelectSize = "sm" | "md" | "lg";

// ────────────────────────────────────────────────────────────────────────

type TamaguiSelectProps = ComponentProps<typeof TamaguiSelect>;
type TamaguiSelectBase = Omit<
  TamaguiSelectProps,
  "size" | "children" | "value" | "onValueChange" | "onChange"
>;

export type SelectProps = TamaguiSelectBase &
  PseudoPropsMixin<Partial<TamaguiSelectBase>> &
  SxPropMixin<Partial<TamaguiSelectBase> & PseudoPropsMixin<Partial<TamaguiSelectBase>>> &
  InputAriaProps & {
    size?: SelectSize;
    colorScheme?: string;
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    isInvalid?: boolean;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isRequired?: boolean;
    children?: ReactNode;
  };

export type SelectElement = ElementRef<typeof TamaguiSelect.Trigger>;

const SIZE_TOKENS: Record<SelectSize, { height: number; px: number; fontSize: number }> = {
  sm: { height: 32, px: 12, fontSize: 14 },
  md: { height: 40, px: 12, fontSize: 16 },
  lg: { height: 48, px: 16, fontSize: 18 },
};

function SelectRoot(props: SelectProps, ref: React.Ref<SelectElement>) {
  const merged = useFormControlProps<SelectProps>(props);
  const {
    size = "md",
    colorScheme = "gray",
    value,
    defaultValue,
    onChange,
    placeholder,
    isInvalid,
    isDisabled,
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
    // Pulled off via `merged` but Tamagui Select has no `required` prop;
    // aria-required covers the a11y side.
    // oxlint-disable-next-line no-unused-vars
    required: _required,
    id,
    ...rest
  } = merged;

  const translated = useTranslatedProps(rest as Readonly<Record<string, unknown>>);
  const sizeT = SIZE_TOKENS[size];
  const invalid = isInvalid ?? (ariaInvalid === true || ariaInvalid === "true");
  const finallyDisabled = disabled ?? isDisabled ?? readOnly ?? isReadOnly;

  // Memoize adapt children to avoid re-creating Sheet on each render (also
  // silences the react-perf jsx-as-prop rules for our intended structure).
  const adaptChildren = useMemo(
    () => (
      <Sheet modal dismissOnSnapToBottom {...SHEET_EXTRAS}>
        <Sheet.Frame>
          <Sheet.ScrollView>
            <Adapt.Contents />
          </Sheet.ScrollView>
        </Sheet.Frame>
        <Sheet.Overlay backgroundColor="$shadowColor" opacity={0.5} />
      </Sheet>
    ),
    [],
  );

  return (
    <Theme name={colorScheme}>
      <TamaguiSelect
        id={id}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onChange}
        disablePreventBodyScroll
      >
        <TamaguiSelect.Trigger
          ref={ref as never}
          unstyled
          disabled={finallyDisabled}
          aria-invalid={ariaInvalid}
          aria-required={ariaRequired ?? (isRequired ? "true" : undefined)}
          aria-readonly={ariaReadOnly}
          aria-describedby={ariaDescribedBy}
          aria-labelledby={ariaLabelledBy}
          height={sizeT.height}
          paddingHorizontal={sizeT.px}
          borderColor={invalid ? "$red9" : "$borderColor"}
          borderWidth={1}
          borderRadius={6}
          backgroundColor="transparent"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          gap={8}
          opacity={finallyDisabled ? 0.4 : 1}
          // oxlint-disable-next-line typescript/no-explicit-any
          {...(translated as any)}
        >
          <TamaguiSelect.Value
            placeholder={placeholder}
            color="$foreground"
            fontSize={sizeT.fontSize}
          />
          <ChevronDownIcon size={16} color="$color10" />
        </TamaguiSelect.Trigger>

        <Adapt {...ADAPT_WHEN}>{adaptChildren}</Adapt>

        <TamaguiSelect.Content {...CONTENT_EXTRAS}>
          <TamaguiSelect.Viewport
            {...VIEWPORT_EXTRAS}
            minWidth={200}
            borderWidth={1}
            borderColor="$borderColor"
            borderRadius={6}
            backgroundColor="$background"
          >
            <TamaguiSelect.Group>{children}</TamaguiSelect.Group>
          </TamaguiSelect.Viewport>
        </TamaguiSelect.Content>
      </TamaguiSelect>
    </Theme>
  );
}

const ANIMATE_ONLY = ["transform", "opacity"];
const VIEWPORT_ENTER = { opacity: 0, y: -10 };
const VIEWPORT_EXIT = { opacity: 0, y: 10 };

// Tamagui v2 type-level gates: `animation`, `zIndex`, and media-query `when`
// require a fully-augmented TamaguiCustomConfig. The runtime accepts them
// (verified by Tamagui's JS code), but the types reject them until the user
// augments their config. Squashed via unknown-cast at the boundary.
// oxlint-disable-next-line typescript/no-explicit-any
type UnsafeExtras = Record<string, any>;
const ADAPT_WHEN: UnsafeExtras = { when: "maxMd" };
const CONTENT_EXTRAS: UnsafeExtras = { zIndex: 200000 };
const SHEET_EXTRAS: UnsafeExtras = { animation: "medium" };
const VIEWPORT_EXTRAS: UnsafeExtras = {
  animation: "quick",
  animateOnly: ANIMATE_ONLY,
  enterStyle: VIEWPORT_ENTER,
  exitStyle: VIEWPORT_EXIT,
};

const SelectRootForwarded = forwardRef<SelectElement, SelectProps>(SelectRoot);
SelectRootForwarded.displayName = "Select";

// ────────────────────────────────────────────────────────────────────────
// Option

export interface SelectOptionProps {
  value: string;
  children?: ReactNode;
  /** Positional index — required by Tamagui Select internals. Auto-assigned if omitted (but safer to pass). */
  index?: number;
  isDisabled?: boolean;
}

function SelectOption({ value, children, index = 0, isDisabled }: SelectOptionProps) {
  const label =
    typeof children === "string" || typeof children === "number" ? (
      <TamaguiText color="$foreground" fontSize={14}>
        {children}
      </TamaguiText>
    ) : (
      children
    );
  return (
    <TamaguiSelect.Item
      index={index}
      value={value}
      disabled={isDisabled}
      paddingVertical={8}
      paddingHorizontal={12}
      hoverStyle={HOVER_STYLE}
      focusStyle={HOVER_STYLE}
    >
      <XStack gap={8} alignItems="center" flex={1}>
        <YStack flex={1}>
          <TamaguiSelect.ItemText>{label}</TamaguiSelect.ItemText>
        </YStack>
        <TamaguiSelect.ItemIndicator>
          <CheckIcon size={14} color="$primary" />
        </TamaguiSelect.ItemIndicator>
      </XStack>
    </TamaguiSelect.Item>
  );
}
SelectOption.displayName = "Select.Option";

const HOVER_STYLE = { backgroundColor: "$color3" } as const;

// ────────────────────────────────────────────────────────────────────────

export const Select = Object.assign(SelectRootForwarded, {
  Option: SelectOption,
});
