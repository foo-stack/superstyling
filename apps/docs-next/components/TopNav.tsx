import { HStack, Box, Text, Link } from "@superstyling/core";
import { VersionSwitcher } from "./VersionSwitcher";

/**
 * Top navigation strip. Wordmark on the left, version switcher + external
 * links on the right.
 */
export function TopNav() {
  return (
    <HStack
      position="sticky"
      top={0}
      zIndex={10}
      height={56}
      alignItems="center"
      paddingHorizontal="$4"
      borderBottomWidth={1}
      borderBottomColor="$borderColor"
      backgroundColor="$background"
      gap="$4"
    >
      <Link href="/" textDecorationLine="none">
        <Text fontSize={18} fontWeight="700" color="$color">
          Superstyling
        </Text>
      </Link>
      <Box flex={1} />
      <VersionSwitcher />
      <Link href="https://github.com/foo-stack/superstyling" isExternal>
        <Text fontSize={14} color="$color">
          GitHub
        </Text>
      </Link>
    </HStack>
  );
}
