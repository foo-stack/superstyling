import { forwardRef, type ComponentProps } from "react";
import { Text as TamaguiText, XStack, YStack, type XStackProps, type YStackProps } from "tamagui";

/**
 * Stat — single metric display. Dot-namespaced compound:
 *
 *   <Stat>
 *     <Stat.Label>MRR</Stat.Label>
 *     <Stat.Number>$12,340</Stat.Number>
 *     <Stat.HelpText>
 *       <Stat.Arrow type="increase" />
 *       +12% vs last month
 *     </Stat.HelpText>
 *   </Stat>
 *
 * Wrap multiple Stats in `<Stat.Group>` for horizontal layout with
 * evenly distributed columns.
 */

// Root ──────────────────────────────────────────────────────────────────

export type StatProps = YStackProps;

const StatRoot = forwardRef<unknown, StatProps>(function Stat(props, ref) {
  return <YStack ref={ref as never} gap={4} flex={1} {...props} />;
});
StatRoot.displayName = "Stat";

// Label / Number / HelpText ─────────────────────────────────────────────

const StatLabel = forwardRef<unknown, ComponentProps<typeof TamaguiText>>(
  function StatLabel(props, ref) {
    return (
      <TamaguiText ref={ref as never} fontSize={13} fontWeight="500" color="$color10" {...props} />
    );
  },
);
StatLabel.displayName = "Stat.Label";

const StatNumber = forwardRef<unknown, ComponentProps<typeof TamaguiText>>(
  function StatNumber(props, ref) {
    return (
      <TamaguiText ref={ref as never} fontSize={28} fontWeight="700" color="$color" {...props} />
    );
  },
);
StatNumber.displayName = "Stat.Number";

const StatHelpText = forwardRef<unknown, ComponentProps<typeof TamaguiText>>(
  function StatHelpText(props, ref) {
    return <TamaguiText ref={ref as never} fontSize={12} color="$color10" {...props} />;
  },
);
StatHelpText.displayName = "Stat.HelpText";

// Arrow ────────────────────────────────────────────────────────────────

export type StatArrowType = "increase" | "decrease";

export interface StatArrowProps {
  type?: StatArrowType;
  color?: string;
}

const StatArrow = function StatArrow(props: StatArrowProps) {
  const { type = "increase", color } = props;
  const effectiveColor = color ?? (type === "increase" ? "$green9" : "$red9");
  return (
    <TamaguiText fontSize={12} color={effectiveColor} {...({ display: "inline" } as object)}>
      {type === "increase" ? "▲" : "▼"}
    </TamaguiText>
  );
};
StatArrow.displayName = "Stat.Arrow";

// Group ────────────────────────────────────────────────────────────────

const StatGroup = forwardRef<unknown, XStackProps>(function StatGroup(props, ref) {
  return <XStack ref={ref as never} gap="$4" flexWrap="wrap" {...props} />;
});
StatGroup.displayName = "Stat.Group";

// ───────────────────────────────────────────────────────────────────────

export const Stat = Object.assign(StatRoot, {
  Label: StatLabel,
  Number: StatNumber,
  HelpText: StatHelpText,
  Arrow: StatArrow,
  Group: StatGroup,
});
