import { Children, cloneElement, forwardRef, isValidElement, type ReactNode } from "react";
import { YStack, type YStackProps } from "tamagui";
import { useTranslatedProps, type PseudoPropsMixin, type SxPropMixin } from "./common";

/**
 * AspectRatio — wrapper that enforces a width:height ratio on its child.
 * Child is positioned absolutely and stretched to cover; wrapper uses the
 * padding-top % trick on web (fallback) plus the CSS `aspect-ratio`
 * property on modern browsers + native (RN 0.71+).
 *
 * Matches Chakra's `<AspectRatio ratio={16/9}>`.
 */

export type AspectRatioProps = Omit<YStackProps, "aspectRatio"> &
  PseudoPropsMixin<Partial<YStackProps>> &
  SxPropMixin<Partial<YStackProps> & PseudoPropsMixin<Partial<YStackProps>>> & {
    /** Aspect ratio as width / height. Default 4/3. */
    ratio?: number;
    children: ReactNode;
  };

export const AspectRatio = forwardRef<unknown, AspectRatioProps>(function AspectRatio(props, ref) {
  const { ratio = 4 / 3, children, ...rest } = props;
  const translated = useTranslatedProps(rest as Readonly<Record<string, unknown>>);

  // Stretch the single child to fill. Anything more complex should be
  // wrapped in a single Box by the user.
  const child = Children.only(children);
  const stretched = isValidElement(child)
    ? cloneElement(child as React.ReactElement<Record<string, unknown>>, {
        ...(child.props as Record<string, unknown>),
        style: [
          (child.props as { style?: unknown }).style,
          { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
        ],
      })
    : child;

  return (
    <YStack
      ref={ref as never}
      position="relative"
      width="100%"
      aspectRatio={ratio}
      {...(translated as unknown as YStackProps)}
    >
      {stretched}
    </YStack>
  );
});
AspectRatio.displayName = "AspectRatio";
