import { forwardRef } from "react";
import { Flex, type FlexProps, type FlexElement } from "./Flex";

/**
 * Center — Flex with justify + align both `center`. Chakra-shaped alias for
 * the common "center this thing in both axes" pattern.
 */
export type CenterProps = Omit<FlexProps, "justify" | "align">;

export const Center = forwardRef<FlexElement, CenterProps>(function Center(props, ref) {
  return <Flex ref={ref as never} justify="center" align="center" {...props} />;
});
Center.displayName = "Center";
