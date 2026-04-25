"use client";

import { VStack, Text, Link } from "@superstyling/core";
import { usePathname } from "one";
import { NAV } from "./nav";

/**
 * Sidebar nav. Renders the static NAV tree; active item gets a primary
 * background + light text. Active path comes from One's `usePathname` so
 * client-side route changes reflect immediately. `currentPath` is kept
 * as an SSR-time fallback so the first paint has the correct highlight
 * before client hydration runs.
 *
 * `onNavigate` lets parents (e.g. the mobile drawer) react to a click —
 * usually to close themselves.
 */
export function DocsMenuContents({
  currentPath,
  onNavigate,
}: {
  currentPath?: string;
  onNavigate?: () => void;
}) {
  const livePath = usePathname();
  const activePath = livePath ?? currentPath;

  return (
    <VStack gap="$5" width="100%">
      {NAV.map((section) => (
        <VStack key={section.label} gap="$1">
          <Text
            fontSize={11}
            fontWeight="700"
            color="$color11"
            textTransform="uppercase"
            letterSpacing={0.08 * 11}
            marginBottom="$2"
          >
            {section.label}
          </Text>
          {section.items.map((item) => {
            const isActive = activePath === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                textDecorationLine="none"
                paddingVertical="$1"
                paddingHorizontal="$2"
                borderRadius="$2"
                backgroundColor={isActive ? "$primary" : undefined}
                _hover={
                  isActive
                    ? { backgroundColor: "$primary" }
                    : { backgroundColor: "$backgroundHover" }
                }
                onPress={onNavigate}
              >
                <Text
                  fontSize={14}
                  color={isActive ? "$background" : "$color"}
                  fontWeight={isActive ? "600" : "400"}
                >
                  {item.label}
                </Text>
              </Link>
            );
          })}
        </VStack>
      ))}
    </VStack>
  );
}
