/**
 * Shared helpers for the primitive components.
 */
import { translateProps } from "../translateProps";
import { useBreakpointNames } from "../system/BreakpointContext";

/**
 * Runtime-translate Chakra-shaped props into Tamagui-shaped props. Uses the
 * active theme's breakpoint names from context so responsive object form
 * (`{ base: 2, md: 4 }`) is recognized correctly regardless of the user's
 * custom breakpoint set.
 *
 * Must be called from within a React render (it uses a context hook).
 */
export function useTranslatedProps(
  props: Readonly<Record<string, unknown>>,
): Record<string, unknown> {
  const breakpointNames = useBreakpointNames();
  return translateProps(props, { breakpointNames });
}

/** Pseudo-prop shape — used in per-component prop types. */
export interface PseudoPropsMixin<T> {
  _hover?: T;
  _focus?: T;
  _focusVisible?: T;
  _focusWithin?: T;
  _active?: T;
  _pressed?: T;
  _disabled?: T;
}

/** sx prop shape. */
export interface SxPropMixin<T> {
  sx?: T;
}
