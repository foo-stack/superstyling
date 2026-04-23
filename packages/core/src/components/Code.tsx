import { forwardRef, type ElementRef } from "react";
import { Text as TamaguiText, type TextProps as TamaguiTextProps } from "tamagui";
import { useTranslatedProps, type PseudoPropsMixin, type SxPropMixin } from "./common";

/**
 * Code — inline monospace text with a subtle pill background. Use for
 * snippets inside prose. For fenced code blocks, reach for the docs-level
 * `DocsCodeBlock` with syntax highlighting instead.
 */
export type CodeProps = TamaguiTextProps &
  PseudoPropsMixin<Partial<TamaguiTextProps>> &
  SxPropMixin<Partial<TamaguiTextProps> & PseudoPropsMixin<Partial<TamaguiTextProps>>>;

export type CodeElement = ElementRef<typeof TamaguiText>;

export const Code = forwardRef<CodeElement, CodeProps>(function Code(props, ref) {
  const translated = useTranslatedProps(props as Readonly<Record<string, unknown>>);
  return (
    <TamaguiText
      ref={ref as never}
      fontFamily="$mono"
      fontSize={14}
      backgroundColor="$color3"
      paddingHorizontal={6}
      paddingVertical={2}
      borderRadius={4}
      {...(translated as unknown as TamaguiTextProps)}
    />
  );
});
Code.displayName = "Code";
