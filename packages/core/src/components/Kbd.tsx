import { forwardRef, type ElementRef } from "react";
import { Text as TamaguiText, type TextProps as TamaguiTextProps } from "tamagui";
import { useTranslatedProps, type PseudoPropsMixin, type SxPropMixin } from "./common";

/**
 * Kbd — keyboard-shortcut display. Small monospace pill with a border and
 * a subtle bottom-border for the classic "keycap" look. Use for single
 * keys or combos: `<Kbd>⌘</Kbd><Kbd>K</Kbd>`.
 */
export type KbdProps = TamaguiTextProps &
  PseudoPropsMixin<Partial<TamaguiTextProps>> &
  SxPropMixin<Partial<TamaguiTextProps> & PseudoPropsMixin<Partial<TamaguiTextProps>>>;

export type KbdElement = ElementRef<typeof TamaguiText>;

export const Kbd = forwardRef<KbdElement, KbdProps>(function Kbd(props, ref) {
  const translated = useTranslatedProps(props as Readonly<Record<string, unknown>>);
  return (
    <TamaguiText
      ref={ref as never}
      fontFamily="$mono"
      fontSize={12}
      fontWeight="700"
      backgroundColor="$color2"
      color="$color11"
      paddingHorizontal={6}
      paddingVertical={2}
      borderRadius={4}
      borderWidth={1}
      borderColor="$borderColor"
      borderBottomWidth={2}
      {...(translated as unknown as TamaguiTextProps)}
    />
  );
});
Kbd.displayName = "Kbd";
