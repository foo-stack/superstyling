import { forwardRef, type ElementRef } from "react";
import { YStack, type YStackProps } from "tamagui";
import { useTranslatedProps, type PseudoPropsMixin, type SxPropMixin } from "./common";

/**
 * Container — centered max-width wrapper for page content. Chakra's default
 * `maxW="60ch"` for readable text columns; override via props.
 *
 * Responsive default: `maxW` caps at `xl` breakpoint-equivalent. Page shells
 * typically use `<Container maxW="container.xl">` but plain string widths
 * (`60ch`, `900px`) also work.
 */

export type ContainerProps = YStackProps &
  PseudoPropsMixin<Partial<YStackProps>> &
  SxPropMixin<Partial<YStackProps> & PseudoPropsMixin<Partial<YStackProps>>> & {
    /** Center the container horizontally (default true). */
    centered?: boolean;
  };

export type ContainerElement = ElementRef<typeof YStack>;

export const Container = forwardRef<ContainerElement, ContainerProps>(
  function Container(props, ref) {
    const { centered = true, maxWidth, ...rest } = props;
    const translated = useTranslatedProps(rest as Readonly<Record<string, unknown>>);
    return (
      <YStack
        ref={ref as never}
        width="100%"
        maxWidth={maxWidth ?? ("60ch" as never)}
        {...(centered ? { marginHorizontal: "auto" } : {})}
        paddingHorizontal="$4"
        {...(translated as unknown as YStackProps)}
      />
    );
  },
);
Container.displayName = "Container";
