import { Box, Heading, Link, Text, VStack } from "@superstyling/core";

const textHover = { color: "$color10" } as const;

export default function Home() {
  return (
    <Box flex={1} alignItems="center" justifyContent="center" padding="$4">
      <VStack gap="$4" alignItems="center">
        <Heading level={1}>Superstyling Docs</Heading>
        <Text fontSize="$4" _hover={textHover}>
          Hello from One on the web.
        </Text>
        <Link href="/components">→ Components showcase</Link>
      </VStack>
    </Box>
  );
}
