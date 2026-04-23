import { type ReactNode } from "react";
import { AnimatePresence } from "@tamagui/animate-presence";
import { YStack, type YStackProps } from "tamagui";

/**
 * Transition wrappers — thin Tamagui AnimatePresence + enterStyle/exitStyle
 * presets that mirror Chakra's `<Collapse>`, `<Fade>`, `<ScaleFade>`,
 * `<Slide>` primitives.
 *
 * All share the same prop surface:
 *   - `in`: whether the child should be present/visible
 *   - `children`: the content to animate
 *
 * Content is only mounted when `in` is true; `AnimatePresence` handles
 * the enter/exit animation lifecycle.
 */

export interface TransitionBaseProps extends Omit<YStackProps, "children"> {
  /** When true, the child is mounted and animated in. When false, animated out + unmounted. */
  in?: boolean;
  children?: ReactNode;
}

// ────────────────────────────────────────────────────────────────────────
// Fade

export function Fade({ in: isIn = true, children, ...rest }: TransitionBaseProps) {
  return (
    <AnimatePresence>
      {isIn ? (
        <YStack
          key="fade"
          {...({ animation: "quicker" } as object)}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          opacity={1}
          {...rest}
        >
          {children}
        </YStack>
      ) : null}
    </AnimatePresence>
  );
}
Fade.displayName = "Fade";

// ────────────────────────────────────────────────────────────────────────
// ScaleFade

export interface ScaleFadeProps extends TransitionBaseProps {
  /** Starting scale when entering. Default 0.95. */
  initialScale?: number;
}

export function ScaleFade({
  in: isIn = true,
  initialScale = 0.95,
  children,
  ...rest
}: ScaleFadeProps) {
  return (
    <AnimatePresence>
      {isIn ? (
        <YStack
          key="scale-fade"
          {...({ animation: "quick" } as object)}
          enterStyle={{ opacity: 0, scale: initialScale }}
          exitStyle={{ opacity: 0, scale: initialScale }}
          opacity={1}
          scale={1}
          {...rest}
        >
          {children}
        </YStack>
      ) : null}
    </AnimatePresence>
  );
}
ScaleFade.displayName = "ScaleFade";

// ────────────────────────────────────────────────────────────────────────
// Slide

export type SlideDirection = "top" | "right" | "bottom" | "left";

export interface SlideProps extends Omit<TransitionBaseProps, "direction"> {
  /** Which edge the content slides from. Default `"bottom"`. */
  direction?: SlideDirection;
  /** Pixel offset. Default 40. */
  offset?: number;
}

function slideOffsets(direction: SlideDirection, offset: number) {
  switch (direction) {
    case "top":
      return { enter: { y: -offset, opacity: 0 }, exit: { y: -offset, opacity: 0 } };
    case "right":
      return { enter: { x: offset, opacity: 0 }, exit: { x: offset, opacity: 0 } };
    case "left":
      return { enter: { x: -offset, opacity: 0 }, exit: { x: -offset, opacity: 0 } };
    case "bottom":
    default:
      return { enter: { y: offset, opacity: 0 }, exit: { y: offset, opacity: 0 } };
  }
}

export function Slide({
  in: isIn = true,
  direction = "bottom",
  offset = 40,
  children,
  ...rest
}: SlideProps) {
  const { enter, exit } = slideOffsets(direction, offset);
  return (
    <AnimatePresence>
      {isIn ? (
        <YStack
          key={`slide-${direction}`}
          {...({ animation: "quick" } as object)}
          enterStyle={enter}
          exitStyle={exit}
          x={0}
          y={0}
          opacity={1}
          {...rest}
        >
          {children}
        </YStack>
      ) : null}
    </AnimatePresence>
  );
}
Slide.displayName = "Slide";

// ────────────────────────────────────────────────────────────────────────
// Collapse

export interface CollapseProps extends TransitionBaseProps {
  /** Whether the content is animated in. */
  in?: boolean;
  /** Start height when collapsed. Default 0 for full collapse. */
  startingHeight?: number;
}

export function Collapse({
  in: isIn = true,
  startingHeight = 0,
  children,
  ...rest
}: CollapseProps) {
  return (
    <AnimatePresence>
      {isIn ? (
        <YStack
          key="collapse"
          {...({ animation: "quick" } as object)}
          enterStyle={{ height: startingHeight, opacity: 0 }}
          exitStyle={{ height: startingHeight, opacity: 0 }}
          opacity={1}
          overflow="hidden"
          {...rest}
        >
          {children}
        </YStack>
      ) : null}
    </AnimatePresence>
  );
}
Collapse.displayName = "Collapse";
