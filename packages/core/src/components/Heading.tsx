import { forwardRef, type ComponentType, type ElementRef } from "react";
import { Platform } from "react-native";
import { H1, H2, H3, H4, H5, H6, type TextProps as TamaguiTextProps } from "tamagui";
import { useTranslatedProps, type PseudoPropsMixin, type SxPropMixin } from "./common";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Heading — semantic heading with configurable level.
 *
 * Per Q17 clarification (PLAN.md §3.5): because we dropped the polymorphic
 * `as` prop, `<Heading>` needs a way to pick the underlying HTML heading
 * element on web. We use `level` (1–6).
 *
 * On web, `<Heading level={1}>` renders as `<h1>` via Tamagui's H-components.
 * On native, the same `level` maps to `accessibilityRole="header"` +
 * `aria-level={level}` so VoiceOver and TalkBack announce heading level.
 */
export type HeadingProps = TamaguiTextProps &
  PseudoPropsMixin<Partial<TamaguiTextProps>> &
  SxPropMixin<Partial<TamaguiTextProps> & PseudoPropsMixin<Partial<TamaguiTextProps>>> & {
    /** Semantic heading level. Default: 2. */
    level?: HeadingLevel;
  };

const HEADINGS: Record<HeadingLevel, ComponentType<TamaguiTextProps>> = {
  1: H1,
  2: H2,
  3: H3,
  4: H4,
  5: H5,
  6: H6,
};

export type HeadingElement = ElementRef<typeof H2>;

export const Heading = forwardRef<HeadingElement, HeadingProps>(function Heading(props, ref) {
  const { level = 2, ...rest } = props;
  const Component = HEADINGS[level];
  const translated = useTranslatedProps(rest as Readonly<Record<string, unknown>>);
  // Merge a11y attrs into the translated bag first so the final spread carries
  // them. Going through JSX attributes directly fights Tamagui's augmented
  // TextProps index signature.
  // On web, H1-H6 carry their semantic role inherently; passing
  // `accessibilityRole="header"` would reach the DOM as an unknown attribute.
  // Apply it only on native.
  const merged: Record<string, unknown> = {
    ...(Platform.OS === "web" ? {} : { accessibilityRole: "header" }),
    "aria-level": level,
    ...translated,
  };
  // Tamagui v2-rc.41's H1-H6 types are plain function component types that
  // don't declare `ref` as a prop. React and Tamagui do forward the ref
  // correctly at runtime; we suppress the TS error at the seam.
  // @ts-expect-error — ref passthrough not modelled by Tamagui v2 types (see PLAN.md §9 risk)
  return <Component ref={ref} {...(merged as unknown as TamaguiTextProps)} />;
});
Heading.displayName = "Heading";
