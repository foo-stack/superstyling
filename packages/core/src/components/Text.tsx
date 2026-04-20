import { forwardRef, type ElementRef } from "react";
import { Text as TamaguiText, type TextProps as TamaguiTextProps } from "tamagui";
import { useTranslatedProps, type PseudoPropsMixin, type SxPropMixin } from "./common";

export type TextProps = TamaguiTextProps &
  PseudoPropsMixin<Partial<TamaguiTextProps>> &
  SxPropMixin<Partial<TamaguiTextProps> & PseudoPropsMixin<Partial<TamaguiTextProps>>>;

export type TextElement = ElementRef<typeof TamaguiText>;

export const Text = forwardRef<TextElement, TextProps>(function Text(props, ref) {
  const translated = useTranslatedProps(props as Readonly<Record<string, unknown>>);
  // See Box.tsx for ref-typing rationale.
  return <TamaguiText ref={ref as never} {...(translated as unknown as TamaguiTextProps)} />;
});
Text.displayName = "Text";
