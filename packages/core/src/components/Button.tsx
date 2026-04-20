import {
  forwardRef,
  isValidElement,
  useMemo,
  type ComponentProps,
  type ElementRef,
  type ReactElement,
  type ReactNode,
} from "react";
import { Button as TamaguiButton, Spinner, Text as TamaguiText, Theme, XStack } from "tamagui";
import { useTranslatedProps, type PseudoPropsMixin, type SxPropMixin } from "./common";

type TamaguiButtonProps = ComponentProps<typeof TamaguiButton>;

export type ButtonVariant = "solid" | "outline" | "ghost" | "link";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

/**
 * Button — the workhorse interactive primitive. Wraps Tamagui's `Button` with
 * Chakra-style API surface (variant × size × colorScheme, `leftIcon`/
 * `rightIcon` slots, `isLoading`, `isDisabled`, `isActive`).
 *
 * `colorScheme` wraps internals in `<Theme name={colorScheme}>` so the
 * resolved `$primary*` tokens drive visual style (Q22 per PLAN.md).
 */
type TamaguiButtonBase = Omit<TamaguiButtonProps, "size" | "variant">;

export type ButtonProps = TamaguiButtonBase &
  PseudoPropsMixin<Partial<TamaguiButtonBase>> &
  SxPropMixin<Partial<TamaguiButtonBase> & PseudoPropsMixin<Partial<TamaguiButtonBase>>> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    /** Semantic color scheme (`"blue"`, `"red"`, …). Default: `"gray"`. */
    colorScheme?: string;
    /** Icon element rendered before the label. */
    leftIcon?: ReactElement;
    /** Icon element rendered after the label. */
    rightIcon?: ReactElement;
    /** Render a spinner instead of (or alongside) the label. */
    isLoading?: boolean;
    /** Replacement text shown while loading. If omitted, spinner replaces content. */
    loadingText?: string;
    /** Which side the spinner appears when `loadingText` is set. Default: `"start"`. */
    spinnerPlacement?: "start" | "end";
    /** Disables pointer / a11y interaction. */
    isDisabled?: boolean;
    /** Applies active/pressed visual state. */
    isActive?: boolean;
  };

export type ButtonElement = ElementRef<typeof TamaguiButton>;

const SIZE_TOKENS: Record<ButtonSize, { height: number; px: number; fontSize: number }> = {
  xs: { height: 24, px: 8, fontSize: 12 },
  sm: { height: 32, px: 12, fontSize: 14 },
  md: { height: 40, px: 16, fontSize: 16 },
  lg: { height: 48, px: 24, fontSize: 18 },
};

function variantStyles(variant: ButtonVariant) {
  switch (variant) {
    case "outline":
      return {
        backgroundColor: "transparent",
        borderColor: "$primary",
        borderWidth: 1,
        color: "$primary",
        hoverBg: "$primaryMuted",
        pressBg: "$primaryMuted",
      } as const;
    case "ghost":
      return {
        backgroundColor: "transparent",
        borderWidth: 0,
        color: "$primary",
        hoverBg: "$primaryMuted",
        pressBg: "$primaryMuted",
      } as const;
    case "link":
      return {
        backgroundColor: "transparent",
        borderWidth: 0,
        color: "$primary",
        hoverBg: "transparent",
        pressBg: "transparent",
      } as const;
    case "solid":
    default:
      return {
        backgroundColor: "$primary",
        borderWidth: 0,
        color: "$primaryContrast",
        hoverBg: "$primaryHover",
        pressBg: "$primaryActive",
      } as const;
  }
}

export const Button = forwardRef<ButtonElement, ButtonProps>(function Button(props, ref) {
  const {
    variant = "solid",
    size = "md",
    colorScheme = "gray",
    leftIcon,
    rightIcon,
    isLoading = false,
    loadingText,
    spinnerPlacement = "start",
    isDisabled = false,
    isActive = false,
    children,
    ...rest
  } = props;

  const translated = useTranslatedProps(rest as Readonly<Record<string, unknown>>);
  const sizeT = SIZE_TOKENS[size];
  const v = variantStyles(variant);
  const hoverStyle = useMemo(() => ({ backgroundColor: v.hoverBg }), [v.hoverBg]);
  const pressStyle = useMemo(() => ({ backgroundColor: v.pressBg }), [v.pressBg]);

  const spinner = <Spinner size="small" color={v.color} />;
  const content = buildContent({
    children,
    leftIcon,
    rightIcon,
    isLoading,
    loadingText,
    spinnerPlacement,
    spinner,
  });

  // If `isActive`, pin the background to the pressed style unless variant === link.
  const activeBg = isActive && variant !== "link" ? v.pressBg : v.backgroundColor;

  // See Box.tsx for the `any` cast rationale at the Tamagui boundary.
  // oxlint-disable-next-line typescript/no-explicit-any
  return (
    <Theme name={colorScheme}>
      <TamaguiButton
        ref={ref as never}
        unstyled
        disabled={isDisabled || isLoading}
        height={sizeT.height}
        paddingHorizontal={variant === "link" ? 0 : sizeT.px}
        backgroundColor={activeBg}
        borderColor={"borderColor" in v ? v.borderColor : undefined}
        borderWidth={v.borderWidth}
        borderRadius={6}
        color={v.color}
        fontSize={sizeT.fontSize}
        fontWeight="600"
        opacity={isDisabled ? 0.4 : 1}
        hoverStyle={hoverStyle}
        pressStyle={pressStyle}
        // oxlint-disable-next-line typescript/no-explicit-any
        {...(translated as any)}
      >
        {content}
      </TamaguiButton>
    </Theme>
  );
});
Button.displayName = "Button";

// ────────────────────────────────────────────────────────────────────────

interface BuildContentArgs {
  children: ReactNode;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  isLoading: boolean;
  loadingText?: string;
  spinnerPlacement: "start" | "end";
  spinner: ReactNode;
}

function buildContent({
  children,
  leftIcon,
  rightIcon,
  isLoading,
  loadingText,
  spinnerPlacement,
  spinner,
}: BuildContentArgs): ReactNode {
  // Wrap bare string children in a Text so native rendering works (RN requires
  // text to live inside <Text>; web is fine either way).
  const label: ReactNode =
    typeof children === "string" || typeof children === "number" ? (
      <TamaguiText fontSize="inherit" fontWeight="inherit" color="inherit">
        {children}
      </TamaguiText>
    ) : (
      children
    );

  if (isLoading && !loadingText) {
    return spinner;
  }

  if (isLoading && loadingText) {
    const loadingLabel = (
      <TamaguiText fontSize="inherit" fontWeight="inherit" color="inherit">
        {loadingText}
      </TamaguiText>
    );
    return (
      <XStack gap={8} alignItems="center">
        {spinnerPlacement === "start" ? spinner : null}
        {loadingLabel}
        {spinnerPlacement === "end" ? spinner : null}
      </XStack>
    );
  }

  if (!leftIcon && !rightIcon) return label;

  return (
    <XStack gap={8} alignItems="center">
      {leftIcon && isValidElement(leftIcon) ? leftIcon : null}
      {label}
      {rightIcon && isValidElement(rightIcon) ? rightIcon : null}
    </XStack>
  );
}
