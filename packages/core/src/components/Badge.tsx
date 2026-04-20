import { forwardRef, type ElementRef } from "react";
import { Theme, XStack, Text as TamaguiText, type XStackProps } from "tamagui";
import { useTranslatedProps, type PseudoPropsMixin, type SxPropMixin } from "./common";

export type BadgeVariant = "solid" | "subtle" | "outline";
export type BadgeSize = "sm" | "md" | "lg";

/**
 * Badge — compact label for status or taxonomy. Built on top of our primitives
 * (XStack + Text) rather than a Tamagui component since Tamagui ships no
 * Badge. `colorScheme` wraps in `<Theme name={colorScheme}>` so the resolved
 * `$primary*` tokens drive the visual style (Q22 pattern from PLAN.md).
 *
 * Uppercase text + tight padding matches Chakra's default look.
 */
type XStackPropsBase = Omit<XStackProps, "size">;

export type BadgeProps = XStackPropsBase &
  PseudoPropsMixin<Partial<XStackPropsBase>> &
  SxPropMixin<Partial<XStackPropsBase> & PseudoPropsMixin<Partial<XStackPropsBase>>> & {
    variant?: BadgeVariant;
    size?: BadgeSize;
    /** Semantic color scheme (e.g., `"blue"`, `"red"`, `"green"`). Default: `"gray"`. */
    colorScheme?: string;
  };

export type BadgeElement = ElementRef<typeof XStack>;

const SIZE_TOKENS: Record<BadgeSize, { px: number; py: number; fontSize: number }> = {
  sm: { px: 4, py: 0, fontSize: 10 },
  md: { px: 6, py: 2, fontSize: 12 },
  lg: { px: 8, py: 2, fontSize: 14 },
};

function variantStyles(variant: BadgeVariant) {
  switch (variant) {
    case "subtle":
      return { backgroundColor: "$primaryMuted", color: "$primary" } as const;
    case "outline":
      return {
        backgroundColor: "transparent",
        borderColor: "$primary",
        borderWidth: 1,
        color: "$primary",
      } as const;
    case "solid":
    default:
      return {
        backgroundColor: "$primary",
        color: "$primaryContrast",
      } as const;
  }
}

export const Badge = forwardRef<BadgeElement, BadgeProps>(function Badge(props, ref) {
  const { variant = "subtle", size = "md", colorScheme = "gray", children, ...rest } = props;
  const translated = useTranslatedProps(rest as Readonly<Record<string, unknown>>);
  const sizeT = SIZE_TOKENS[size];
  const v = variantStyles(variant);

  // `<Theme name={colorScheme}>` swaps `$primary*` tokens to the scheme scale.
  return (
    <Theme name={colorScheme}>
      <XStack
        ref={ref as never}
        alignItems="center"
        justifyContent="center"
        paddingHorizontal={sizeT.px}
        paddingVertical={sizeT.py}
        borderRadius={4}
        backgroundColor={v.backgroundColor}
        borderColor={"borderColor" in v ? v.borderColor : undefined}
        borderWidth={"borderWidth" in v ? v.borderWidth : 0}
        {...(translated as unknown as XStackProps)}
      >
        <TamaguiText
          fontSize={sizeT.fontSize}
          fontWeight="600"
          textTransform="uppercase"
          letterSpacing={0.4}
          color={v.color}
        >
          {children}
        </TamaguiText>
      </XStack>
    </Theme>
  );
});
Badge.displayName = "Badge";
