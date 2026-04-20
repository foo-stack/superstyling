import { forwardRef, type ElementRef } from "react";
import { YStack, type YStackProps } from "tamagui";
import { useTranslatedProps, type PseudoPropsMixin, type SxPropMixin } from "./common";

/**
 * Box — the most basic layout primitive. Accepts every Tamagui style prop plus
 * Chakra-shaped pseudo-props (`_hover`, `_focus`, …) and the restricted `sx`
 * prop. Renders as a `YStack` by default (column flex container).
 */
export type BoxProps = YStackProps &
  PseudoPropsMixin<Partial<YStackProps>> &
  SxPropMixin<Partial<YStackProps> & PseudoPropsMixin<Partial<YStackProps>>>;

export type BoxElement = ElementRef<typeof YStack>;

export const Box = forwardRef<BoxElement, BoxProps>(function Box(props, ref) {
  const translated = useTranslatedProps(props as Readonly<Record<string, unknown>>);
  // Tamagui v2-rc.41's component types don't model `ref` as a prop — upstream
  // gap. The `as never` ref cast is the minimal workaround; runtime behavior
  // is correct (React and Tamagui both forward the ref). Revisit when a
  // later Tamagui RC ships proper ref-in-props typing.
  return <YStack ref={ref as never} {...(translated as unknown as YStackProps)} />;
});
Box.displayName = "Box";
