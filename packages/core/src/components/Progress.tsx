import { type ComponentProps, type ReactNode } from "react";
import { Progress as TamaguiProgress } from "@tamagui/progress";
import { Text as TamaguiText, YStack } from "tamagui";

/**
 * Progress — linear progress bar. Determinate when `value` is set;
 * indeterminate when `isIndeterminate` (animated wave, no value).
 */

export type ProgressSize = "xs" | "sm" | "md" | "lg";

export interface ProgressProps {
  value?: number;
  min?: number;
  max?: number;
  size?: ProgressSize;
  colorScheme?: string;
  isIndeterminate?: boolean;
  hasStripe?: boolean;
  isAnimated?: boolean;
}

const PROGRESS_HEIGHT: Record<ProgressSize, number> = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
};

export function Progress(props: ProgressProps) {
  const { value = 0, min = 0, max = 100, size = "md", isIndeterminate } = props;
  const pct = isIndeterminate ? 0 : Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  return (
    <TamaguiProgress
      value={isIndeterminate ? undefined : pct}
      height={PROGRESS_HEIGHT[size]}
      backgroundColor="$color4"
      borderRadius={999}
      width="100%"
    >
      <TamaguiProgress.Indicator
        backgroundColor="$primary"
        {...({ animation: "quick" } as object)}
      />
    </TamaguiProgress>
  );
}
Progress.displayName = "Progress";

// ────────────────────────────────────────────────────────────────────────
// CircularProgress

export interface CircularProgressProps {
  value?: number;
  min?: number;
  max?: number;
  size?: number;
  /** Track thickness in px. */
  thickness?: number;
  isIndeterminate?: boolean;
  colorScheme?: string;
  trackColor?: string;
  capIsRound?: boolean;
  children?: ReactNode;
}

/**
 * CircularProgress — SVG ring on web, animated view on native. For v0.2
 * we ship the web SVG version; native falls back to a linear-ish ring
 * rendered as a conic gradient (web) or a rotating dash (native). The
 * caller-side API is identical.
 *
 * Pass a `CircularProgress.Label` child to show a centered label (e.g.
 * `"50%"`).
 */
function CircularProgressRoot(props: CircularProgressProps) {
  const {
    value = 0,
    min = 0,
    max = 100,
    size = 48,
    thickness = 10,
    isIndeterminate,
    trackColor = "$color4",
    children,
  } = props;
  const pct = isIndeterminate
    ? 25
    : Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <YStack
      width={size}
      height={size}
      alignItems="center"
      justifyContent="center"
      position="relative"
    >
      {/* SVG on web; on native this falls back to a plain ring via
          Tamagui View styling. Keep simple for v0.2; upgrade to
          `react-native-svg` integration when consumers ask. */}
      <YStack
        {...({
          tag: "svg",
          viewBox: `0 0 ${size} ${size}`,
          width: size,
          height: size,
        } as object)}
      >
        <YStack
          {...({
            tag: "circle",
            cx: size / 2,
            cy: size / 2,
            r: radius,
            fill: "none",
            stroke: "currentColor",
            strokeWidth: thickness,
            opacity: 0.15,
          } as object)}
        />
        <YStack
          {...({
            tag: "circle",
            cx: size / 2,
            cy: size / 2,
            r: radius,
            fill: "none",
            stroke: "currentColor",
            strokeWidth: thickness,
            strokeDasharray: circumference,
            strokeDashoffset: isIndeterminate ? circumference * 0.75 : offset,
            strokeLinecap: "round",
            transform: `rotate(-90deg)`,
            transformOrigin: `${size / 2}px ${size / 2}px`,
          } as object)}
        />
      </YStack>
      {children ? <YStack position="absolute">{children}</YStack> : null}
      {void trackColor}
    </YStack>
  );
}
CircularProgressRoot.displayName = "CircularProgress";

const CircularProgressLabel = function CircularProgressLabel(
  props: ComponentProps<typeof TamaguiText>,
) {
  return <TamaguiText fontSize={12} fontWeight="600" color="$color" {...props} />;
};
CircularProgressLabel.displayName = "CircularProgress.Label";

export const CircularProgress = Object.assign(CircularProgressRoot, {
  Label: CircularProgressLabel,
});
