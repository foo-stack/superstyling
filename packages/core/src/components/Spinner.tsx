import { forwardRef, type ElementRef } from "react";
import { Spinner as TamaguiSpinner, type SpinnerProps as TamaguiSpinnerProps } from "tamagui";
import { useTranslatedProps, type PseudoPropsMixin, type SxPropMixin } from "./common";

/**
 * Spinner — animated loading indicator. Wraps Tamagui's `Spinner` (backed by
 * React Native's `ActivityIndicator` on native, a CSS animation on web) with
 * our Chakra-style prop surface.
 */
export type SpinnerProps = TamaguiSpinnerProps &
  PseudoPropsMixin<Partial<TamaguiSpinnerProps>> &
  SxPropMixin<Partial<TamaguiSpinnerProps> & PseudoPropsMixin<Partial<TamaguiSpinnerProps>>>;

export type SpinnerElement = ElementRef<typeof TamaguiSpinner>;

export const Spinner = forwardRef<SpinnerElement, SpinnerProps>(function Spinner(props, ref) {
  const translated = useTranslatedProps(props as Readonly<Record<string, unknown>>);
  // See Box.tsx for ref-typing rationale.
  return <TamaguiSpinner ref={ref as never} {...(translated as unknown as TamaguiSpinnerProps)} />;
});
Spinner.displayName = "Spinner";
