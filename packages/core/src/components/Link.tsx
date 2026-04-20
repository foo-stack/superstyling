import { forwardRef, type ComponentProps, type ElementRef } from "react";
import { Anchor } from "tamagui";
import { useTranslatedProps, type PseudoPropsMixin, type SxPropMixin } from "./common";

type TamaguiAnchorProps = ComponentProps<typeof Anchor>;

/**
 * Link — Chakra-shaped wrapper over Tamagui's `Anchor`. Renders as `<a>` on
 * web and a pressable touch-target on native (Tamagui handles the platform
 * split internally).
 *
 * `isExternal` sets `target="_blank"` + `rel="noopener noreferrer"` on web;
 * ignored on native where there's no such concept.
 */
type TamaguiAnchorBase = Omit<TamaguiAnchorProps, "target" | "rel">;

export type LinkProps = TamaguiAnchorBase &
  PseudoPropsMixin<Partial<TamaguiAnchorBase>> &
  SxPropMixin<Partial<TamaguiAnchorBase> & PseudoPropsMixin<Partial<TamaguiAnchorBase>>> & {
    isExternal?: boolean;
  };

export type LinkElement = ElementRef<typeof Anchor>;

export const Link = forwardRef<LinkElement, LinkProps>(function Link(props, ref) {
  const { isExternal = false, ...rest } = props;
  const translated = useTranslatedProps(rest as Readonly<Record<string, unknown>>);
  // See Box.tsx for ref-typing rationale.
  return (
    <Anchor
      ref={ref as never}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(translated as unknown as TamaguiAnchorProps)}
    />
  );
});
Link.displayName = "Link";
