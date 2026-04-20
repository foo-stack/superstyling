import { forwardRef, type ElementRef } from "react";
import { XStack, YStack, type YStackProps } from "tamagui";
import { useTranslatedProps, type PseudoPropsMixin, type SxPropMixin } from "./common";

export type StackDirection = "row" | "column" | "row-reverse" | "column-reverse";

/**
 * Stack — polymorphic flex container. `direction="row"` renders as XStack;
 * anything else renders as YStack (with flexDirection applied). Matches Chakra's
 * `<Stack direction="...">` API.
 *
 * We omit Tamagui's native `direction` prop (CSS `ltr`/`rtl`) because Chakra
 * owns that name semantically. Users needing RTL/LTR should apply `dir` at the
 * document level or use Tamagui primitives directly.
 */
type YStackPropsWithoutDirection = Omit<YStackProps, "direction">;

export type StackProps = YStackPropsWithoutDirection &
  PseudoPropsMixin<Partial<YStackPropsWithoutDirection>> &
  SxPropMixin<
    Partial<YStackPropsWithoutDirection> & PseudoPropsMixin<Partial<YStackPropsWithoutDirection>>
  > & {
    direction?: StackDirection;
  };

export type StackElement = ElementRef<typeof YStack>;

export const Stack = forwardRef<StackElement, StackProps>(function Stack(props, ref) {
  const { direction = "column", ...rest } = props;
  const translated = useTranslatedProps(rest as Readonly<Record<string, unknown>>);
  const Component = direction.startsWith("row") ? XStack : YStack;
  // See Box.tsx for ref-typing rationale.
  return (
    <Component
      ref={ref as never}
      flexDirection={direction}
      {...(translated as unknown as YStackProps)}
    />
  );
});
Stack.displayName = "Stack";

/** HStack — fixed direction row. */
export const HStack = forwardRef<StackElement, Omit<StackProps, "direction">>(
  function HStack(props, ref) {
    return <Stack ref={ref as never} {...props} direction="row" />;
  },
);
HStack.displayName = "HStack";

/** VStack — fixed direction column (identical to the default Stack). */
export const VStack = forwardRef<StackElement, Omit<StackProps, "direction">>(
  function VStack(props, ref) {
    return <Stack ref={ref as never} {...props} direction="column" />;
  },
);
VStack.displayName = "VStack";
