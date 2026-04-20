/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-jsx-as-prop -- docs building block */
import { Badge, HStack } from "@superstyling/core";
import type { BadgeProps } from "@superstyling/core";

export interface StatusRowProps {
  /** Tier label: "1" | "2" | "3" or custom text. */
  tier?: "1" | "2" | "3" | string;
  /** Platform coverage. */
  platforms?: "Cross-platform" | "Web-only" | "Native-only" | string;
  /** Version the component shipped in. */
  since?: string;
  /** Additional badges rendered after the standard three. */
  children?: React.ReactNode;
}

const tierScheme: Record<string, BadgeProps["colorScheme"]> = {
  "1": "blue",
  "2": "purple",
  "3": "gray",
};

/**
 * Row of status badges rendered at the top of every component docs page.
 * Exposes tier, platform coverage, and the version a component first shipped in.
 *
 * Used by `<ComponentDocsFrame>` in P8.5.6; pages can also drop it directly
 * for one-off combinations.
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
