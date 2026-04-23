import { forwardRef, type ElementRef } from "react";
import { XStack, type XStackProps } from "tamagui";
import { useTranslatedProps, type PseudoPropsMixin, type SxPropMixin } from "./common";

/**
 * Flex — row-direction flex container with Chakra's shorthand props.
 *
 * `direction` / `justify` / `align` / `wrap` mirror Chakra's prop names and
 * map to the underlying flexDirection / justifyContent / alignItems /
 * flexWrap. Renders as XStack so the default direction is row (matches
 * Chakra's `<Flex>` default).
 */

export type FlexDirection = "row" | "column" | "row-reverse" | "column-reverse";
export type FlexJustify =
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";
export type FlexAlign = "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
export type FlexWrap = "wrap" | "nowrap" | "wrap-reverse";

type XStackPropsWithoutDirection = Omit<XStackProps, "direction">;

export type FlexProps = XStackPropsWithoutDirection &
  PseudoPropsMixin<Partial<XStackPropsWithoutDirection>> &
  SxPropMixin<
    Partial<XStackPropsWithoutDirection> & PseudoPropsMixin<Partial<XStackPropsWithoutDirection>>
  > & {
    direction?: FlexDirection;
    justify?: FlexJustify;
    align?: FlexAlign;
    wrap?: FlexWrap;
  };

export type FlexElement = ElementRef<typeof XStack>;

export const Flex = forwardRef<FlexElement, FlexProps>(function Flex(props, ref) {
  const { direction, justify, align, wrap, ...rest } = props;
  const translated = useTranslatedProps(rest as Readonly<Record<string, unknown>>);
  return (
    <XStack
      ref={ref as never}
      {...(direction !== undefined ? { flexDirection: direction } : {})}
      {...(justify !== undefined ? { justifyContent: justify } : {})}
      {...(align !== undefined ? { alignItems: align } : {})}
      {...(wrap !== undefined ? { flexWrap: wrap } : {})}
      {...(translated as unknown as XStackProps)}
    />
  );
});
Flex.displayName = "Flex";
