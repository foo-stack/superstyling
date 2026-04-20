import { Link } from "expo-router";
import { Box, Heading, Text, VStack } from "@superstyling/core";

export default function Home() {
  return (
    <Box flex={1} alignItems="center" justifyContent="center" padding="$4">
      <VStack gap="$4" alignItems="center">
        <Heading level={1}>Superstyling Playground</Heading>
        <Text fontSize="$4">Hello from Expo Router on iOS / Android / Web.</Text>
        <Link href="/components">→ Components showcase</Link>
      </VStack>
    </Box>
  );
}
