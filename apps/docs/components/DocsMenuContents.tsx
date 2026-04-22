import { VStack, Text, Link } from "@superstyling/core";
import { NAV } from "./nav";

/**
 * Sidebar nav. Renders the static NAV tree; active item gets a primary
 * accent + bolder weight. Server-rendered by default — the active-path
 * indicator uses a simple prop rather than a client hook so SSR is clean.
 */
export function DocsMenuContents({ currentPath }: { currentPath?: string }) {
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
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                textDecorationLine="none"
                paddingVertical="$1"
                paddingHorizontal="$2"
                borderRadius="$2"
                _hover={{ backgroundColor: "$backgroundHover" }}
              >
                <Text
                  fontSize={14}
                  color={isActive ? "$primary" : "$color"}
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
