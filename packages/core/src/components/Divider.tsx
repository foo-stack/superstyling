import { forwardRef, type ComponentProps, type ElementRef } from "react";
import { Separator } from "tamagui";
import { useTranslatedProps, type PseudoPropsMixin, type SxPropMixin } from "./common";

type SeparatorProps = ComponentProps<typeof Separator>;

/**
 * Divider — thin rule between sections. Wraps Tamagui's `Separator` with our
 * Chakra-style prop surface (pseudo-props, sx, responsive).
 *
 * Chakra's `orientation` prop maps directly to Tamagui's `vertical` flag:
 * `orientation="vertical"` renders a vertical line between items.
 */
type SeparatorPropsBase = Omit<SeparatorProps, "vertical">;

export type DividerProps = SeparatorPropsBase &
  PseudoPropsMixin<Partial<SeparatorPropsBase>> &
  SxPropMixin<Partial<SeparatorPropsBase> & PseudoPropsMixin<Partial<SeparatorPropsBase>>> & {
    orientation?: "horizontal" | "vertical";
  };

export type DividerElement = ElementRef<typeof Separator>;

export const Divider = forwardRef<DividerElement, DividerProps>(function Divider(props, ref) {
  const { orientation = "horizontal", ...rest } = props;
  const translated = useTranslatedProps(rest as Readonly<Record<string, unknown>>);
  // See Box.tsx for ref-typing rationale.
  return (
    <Separator
      ref={ref as never}
      vertical={orientation === "vertical"}
      {...(translated as unknown as SeparatorProps)}
    />
  );
});
Divider.displayName = "Divider";
