import { Children, cloneElement, forwardRef, isValidElement, type ReactElement } from "react";
import { XStack, type XStackProps } from "tamagui";
import { useTranslatedProps, type PseudoPropsMixin, type SxPropMixin } from "./common";
import type { ButtonSize, ButtonVariant } from "./Button";

/**
 * ButtonGroup — layout wrapper for a row of Buttons. Injects `size` /
 * `variant` / `colorScheme` / `isDisabled` into every Button child so
 * authors don't repeat them.
 *
 * `isAttached` collapses spacing + merges adjacent borders for a
 * segmented-button look.
 */

export type ButtonGroupProps = XStackProps &
  PseudoPropsMixin<Partial<XStackProps>> &
  SxPropMixin<Partial<XStackProps> & PseudoPropsMixin<Partial<XStackProps>>> & {
    size?: ButtonSize;
    variant?: ButtonVariant;
    colorScheme?: string;
    isDisabled?: boolean;
    /** Attach adjacent buttons into a single segmented group. */
    isAttached?: boolean;
    /** Gap between buttons when not attached. */
    spacing?: XStackProps["gap"];
  };

export const ButtonGroup = forwardRef<unknown, ButtonGroupProps>(function ButtonGroup(props, ref) {
  const {
    size,
    variant,
    colorScheme,
    isDisabled,
    isAttached,
    spacing = "$2",
    gap,
    children,
    ...rest
  } = props;
  const translated = useTranslatedProps(rest as Readonly<Record<string, unknown>>);

  // Clone each button child to inject shared props. Strings / fragments
  // pass through unchanged.
  const count = Children.count(children);
  const mapped = Children.map(children, (child, i) => {
    if (!isValidElement(child)) return child;
    const injected: Record<string, unknown> = {};
    const existing = child.props as Record<string, unknown>;
    if (size !== undefined && existing.size === undefined) injected.size = size;
    if (variant !== undefined && existing.variant === undefined) injected.variant = variant;
    if (colorScheme !== undefined && existing.colorScheme === undefined)
      injected.colorScheme = colorScheme;
    if (isDisabled !== undefined && existing.isDisabled === undefined)
      injected.isDisabled = isDisabled;
    if (isAttached) {
      const isFirst = i === 0;
      const isLast = i === count - 1;
      injected.borderTopLeftRadius = isFirst ? undefined : 0;
      injected.borderBottomLeftRadius = isFirst ? undefined : 0;
      injected.borderTopRightRadius = isLast ? undefined : 0;
      injected.borderBottomRightRadius = isLast ? undefined : 0;
      if (!isFirst) injected.marginLeft = -1;
    }
    return cloneElement(child as ReactElement<Record<string, unknown>>, injected);
  });

  return (
    <XStack
      ref={ref as never}
      gap={isAttached ? 0 : (gap ?? spacing)}
      {...(translated as unknown as XStackProps)}
    >
      {mapped}
    </XStack>
  );
});
ButtonGroup.displayName = "ButtonGroup";
