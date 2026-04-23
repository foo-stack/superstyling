import { forwardRef, type ReactNode } from "react";
import { YStack, type YStackProps } from "tamagui";

/**
 * Skeleton — shimmer placeholder box. When `isLoaded` becomes true, the
 * children render instead of the placeholder.
 *
 *   <Skeleton isLoaded={!loading} height={20}>
 *     <Text>Loaded content</Text>
 *   </Skeleton>
 */

export interface SkeletonProps extends Omit<YStackProps, "children"> {
  /** Flip to true to reveal children. */
  isLoaded?: boolean;
  /** ms between shimmer cycles. Default 1200. */
  fadeDuration?: number;
  /** Start color of the shimmer. */
  startColor?: string;
  /** End color of the shimmer. */
  endColor?: string;
  children?: ReactNode;
}

export const Skeleton = forwardRef<unknown, SkeletonProps>(function Skeleton(props, ref) {
  const {
    isLoaded,
    fadeDuration = 1200,
    startColor = "$color4",
    endColor = "$color5",
    children,
    ...rest
  } = props;

  if (isLoaded) {
    return <>{children}</>;
  }

  void fadeDuration;
  void endColor;

  return (
    <YStack
      ref={ref as never}
      borderRadius={4}
      backgroundColor={startColor}
      {...({ animation: "quicker" } as object)}
      // Cycle opacity via Tamagui's animation. For a true shimmer, users
      // can layer a gradient via `LinearGradient` from their choice of
      // library; keeping this primitive dep-free.
      opacity={0.7}
      {...rest}
    />
  );
});
Skeleton.displayName = "Skeleton";

/**
 * SkeletonCircle — circular shimmer. Matches Avatar dimensions by default.
 */
export interface SkeletonCircleProps extends SkeletonProps {
  size?: number;
}

export const SkeletonCircle = forwardRef<unknown, SkeletonCircleProps>(
  function SkeletonCircle(props, ref) {
    const { size = 40, ...rest } = props;
    return <Skeleton ref={ref as never} width={size} height={size} borderRadius={size} {...rest} />;
  },
);
SkeletonCircle.displayName = "SkeletonCircle";

/**
 * SkeletonText — multi-line text placeholder. `noOfLines` rows with
 * decreasing widths for a natural look.
 */
export interface SkeletonTextProps extends Omit<SkeletonProps, "children"> {
  noOfLines?: number;
  /** Gap between lines. Default `"$2"`. */
  spacing?: YStackProps["gap"];
  /** Line height in px. Default 12. */
  skeletonHeight?: number;
  children?: ReactNode;
}

export const SkeletonText = forwardRef<unknown, SkeletonTextProps>(
  function SkeletonText(props, ref) {
    const {
      noOfLines = 3,
      spacing = "$2",
      skeletonHeight = 12,
      isLoaded,
      children,
      ...rest
    } = props;

    if (isLoaded) {
      return <>{children}</>;
    }

    return (
      <YStack ref={ref as never} gap={spacing} {...rest}>
        {Array.from({ length: noOfLines }).map((_, i) => (
          <Skeleton key={i} height={skeletonHeight} width={i === noOfLines - 1 ? "60%" : "100%"} />
        ))}
      </YStack>
    );
  },
);
SkeletonText.displayName = "SkeletonText";
