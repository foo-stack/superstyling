import { forwardRef, type ElementRef } from "react";
import { YStack, type YStackProps } from "tamagui";

/**
 * Spacer — flex:1 filler. Inside a Flex / HStack / VStack, pushes siblings
 * apart. Matches Chakra's `<Spacer>`.
 */
export type SpacerProps = Omit<YStackProps, "flex">;

export type SpacerElement = ElementRef<typeof YStack>;

export const Spacer = forwardRef<SpacerElement, SpacerProps>(function Spacer(props, ref) {
  return <YStack ref={ref as never} flex={1} {...props} />;
});
Spacer.displayName = "Spacer";
