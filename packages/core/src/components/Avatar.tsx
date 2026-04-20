import { forwardRef, type ComponentProps, type ElementRef } from "react";
import { Avatar as TamaguiAvatar, type AvatarProps as TamaguiAvatarProps } from "tamagui";
import { useTranslatedProps, type PseudoPropsMixin, type SxPropMixin } from "./common";

/**
 * Avatar — user profile image with fallback. Wraps Tamagui's `Avatar` compound
 * component; exposed as a dot-namespace (`Avatar.Image`, `Avatar.Fallback`) per
 * Q24 (PLAN.md §3.8).
 *
 * Tamagui ships three parts: `Avatar`, `Avatar.Image`, `Avatar.Fallback`. We
 * wrap `Avatar` (the root) with our prop translation; `.Image` / `.Fallback`
 * re-export unchanged since they have no Chakra-specific API surface yet.
 */
export type AvatarProps = TamaguiAvatarProps &
  PseudoPropsMixin<Partial<TamaguiAvatarProps>> &
  SxPropMixin<Partial<TamaguiAvatarProps> & PseudoPropsMixin<Partial<TamaguiAvatarProps>>>;

export type AvatarElement = ElementRef<typeof TamaguiAvatar>;

const AvatarRoot = forwardRef<AvatarElement, AvatarProps>(function Avatar(props, ref) {
  const translated = useTranslatedProps(props as Readonly<Record<string, unknown>>);
  // See Box.tsx for ref-typing rationale.
  return <TamaguiAvatar ref={ref as never} {...(translated as unknown as TamaguiAvatarProps)} />;
});
AvatarRoot.displayName = "Avatar";

export type AvatarImageProps = ComponentProps<typeof TamaguiAvatar.Image>;
export type AvatarFallbackProps = ComponentProps<typeof TamaguiAvatar.Fallback>;

export const Avatar = Object.assign(AvatarRoot, {
  Image: TamaguiAvatar.Image,
  Fallback: TamaguiAvatar.Fallback,
});
