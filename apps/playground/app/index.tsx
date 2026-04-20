import { Box, Heading, Text } from "@superstyling/core";

export default function Home() {
  return (
    <Box flex={1} alignItems="center" justifyContent="center" padding="$4">
      <Heading level={1}>Superstyling Playground</Heading>
      <Text fontSize="$4" marginTop="$4">
        Hello from Expo Router on iOS / Android / Web.
      </Text>
    </Box>
  );
}
