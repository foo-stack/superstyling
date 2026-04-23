import { type ReactElement, type ReactNode } from "react";
import { Tooltip as TamaguiTooltip } from "@tamagui/tooltip";
import { Text as TamaguiText } from "tamagui";

/**
 * Tooltip — wraps a single trigger child with a hover/focus-triggered
 * label. Matches Chakra's `<Tooltip label="..." placement="...">` API.
 *
 * Built on Tamagui's `@tamagui/tooltip`; portals the bubble automatically
 * and handles keyboard focus, pointer dismiss, and placement flipping.
 */

export type TooltipPlacement =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "top-start"
  | "top-end"
  | "right-start"
  | "right-end"
  | "bottom-start"
  | "bottom-end"
  | "left-start"
  | "left-end";

export interface TooltipProps {
  /** Text shown in the tooltip bubble. Accepts any node. */
  label: ReactNode;
  /** The single trigger element. */
  children: ReactElement;
  /** Side of the trigger the tooltip appears on. Default `"top"`. */
  placement?: TooltipPlacement;
  /** Show an arrow pointing at the trigger. Default `true`. */
  hasArrow?: boolean;
  /** ms before the tooltip appears on hover/focus. Default 500. */
  openDelay?: number;
  /** ms before the tooltip hides after leaving the trigger. Default 0. */
  closeDelay?: number;
  /** Skip wrapping behavior entirely. Useful for conditional UX. */
  isDisabled?: boolean;
}

export function Tooltip(props: TooltipProps) {
  const {
    label,
    children,
    placement = "top",
    hasArrow = true,
    openDelay = 500,
    closeDelay = 0,
    isDisabled,
  } = props;

  if (isDisabled) return children;

  return (
    <TamaguiTooltip
      placement={placement as never}
      restMs={openDelay}
      delay={{ open: openDelay, close: closeDelay }}
    >
      <TamaguiTooltip.Trigger asChild>{children}</TamaguiTooltip.Trigger>
      <TamaguiTooltip.Content
        enterStyle={{ x: 0, y: -4, opacity: 0, scale: 0.95 }}
        exitStyle={{ x: 0, y: -4, opacity: 0, scale: 0.95 }}
        scale={1}
        x={0}
        y={0}
        opacity={1}
        {...({ animation: "quick" } as object)}
        backgroundColor="$color12"
        paddingHorizontal="$3"
        paddingVertical="$2"
        borderRadius={6}
      >
        {hasArrow ? <TamaguiTooltip.Arrow borderColor="$color12" /> : null}
        {typeof label === "string" ? (
          <TamaguiText color="$color1" fontSize={13}>
            {label}
          </TamaguiText>
        ) : (
          label
        )}
      </TamaguiTooltip.Content>
    </TamaguiTooltip>
  );
}
Tooltip.displayName = "Tooltip";
