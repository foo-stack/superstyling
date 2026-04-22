/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-jsx-as-prop -- docs building block */
import { Badge, HStack } from "@superstyling/core";
import type { BadgeProps } from "@superstyling/core";

export interface StatusRowProps {
  tier?: "1" | "2" | "3" | string;
  platforms?: "Cross-platform" | "Web-only" | "Native-only" | string;
  since?: string;
  children?: React.ReactNode;
}

const tierScheme: Record<string, BadgeProps["colorScheme"]> = {
  "1": "blue",
  "2": "purple",
  "3": "gray",
};

/**
 * Tier + platform + since badges rendered under the H1 on every component
 * page. Ported verbatim from Vocs apps/docs/components/StatusRow.tsx.
 */
export function StatusRow({ tier, platforms, since, children }: StatusRowProps) {
  return (
    <HStack gap="$2" flexWrap="wrap" marginVertical="$3" alignItems="center">
      {tier ? (
        <Badge variant="subtle" colorScheme={tierScheme[tier] ?? "gray"} size="sm">
          Tier {tier}
        </Badge>
      ) : null}
      {platforms ? (
        <Badge variant="outline" colorScheme="gray" size="sm">
          {platforms}
        </Badge>
      ) : null}
      {since ? (
        <Badge variant="subtle" colorScheme="green" size="sm">
          Since {since}
        </Badge>
      ) : null}
      {children}
    </HStack>
  );
}
