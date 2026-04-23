import { forwardRef, type ElementRef } from "react";
import { XStack, type XStackProps } from "tamagui";
import { useTranslatedProps, type PseudoPropsMixin, type SxPropMixin } from "./common";

/**
 * Wrap — flex row with `flexWrap: wrap` and consistent child spacing.
 * Use WrapItem to wrap each child and it picks up the spacing automatically.
 * Matches Chakra's `<Wrap spacing="...">`.
 */

type XStackPropsWithoutDirection = Omit<XStackProps, "direction">;

export type WrapProps = XStackPropsWithoutDirection &
  PseudoPropsMixin<Partial<XStackPropsWithoutDirection>> &
  SxPropMixin<
    Partial<XStackPropsWithoutDirection> & PseudoPropsMixin<Partial<XStackPropsWithoutDirection>>
  > & {
    /** Alias for gap. Chakra API parity. */
    spacing?: XStackProps["gap"];
    spacingX?: XStackProps["columnGap"];
    spacingY?: XStackProps["rowGap"];
    /** horizontal align (justifyContent). */
    justify?:
      | "flex-start"
      | "flex-end"
      | "center"
      | "space-between"
      | "space-around"
      | "space-evenly";
    /** cross-axis align (alignItems). */
    align?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
  };

export type WrapElement = ElementRef<typeof XStack>;

export const Wrap = forwardRef<WrapElement, WrapProps>(function Wrap(props, ref) {
  const { spacing, spacingX, spacingY, gap, rowGap, columnGap, justify, align, ...rest } = props;
  const translated = useTranslatedProps(rest as Readonly<Record<string, unknown>>);
  return (
    <XStack
      ref={ref as never}
      flexWrap="wrap"
      gap={gap ?? spacing}
      rowGap={rowGap ?? spacingY}
      columnGap={columnGap ?? spacingX}
      {...(justify !== undefined ? { justifyContent: justify } : {})}
      {...(align !== undefined ? { alignItems: align } : {})}
      {...(translated as unknown as XStackProps)}
    />
  );
});
Wrap.displayName = "Wrap";

/**
 * WrapItem — optional wrapper for Wrap children. Equivalent to a plain Box
 * but signals layout intent and gives a stable key/slot for styling.
 */
export type WrapItemProps = XStackProps &
  PseudoPropsMixin<Partial<XStackProps>> &
  SxPropMixin<Partial<XStackProps> & PseudoPropsMixin<Partial<XStackProps>>>;

export const WrapItem = forwardRef<WrapElement, WrapItemProps>(function WrapItem(props, ref) {
  const translated = useTranslatedProps(props as Readonly<Record<string, unknown>>);
  return <XStack ref={ref as never} {...(translated as unknown as XStackProps)} />;
});
WrapItem.displayName = "WrapItem";
