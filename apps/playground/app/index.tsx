import { YStack, Text, H1 } from "@superstyling/core";

export default function Home() {
  return (
    <YStack flex={1} alignItems="center" justifyContent="center" padding="$4">
      <H1>Superstyling Playground</H1>
      <Text fontSize="$4" marginTop="$4">
        Hello from Expo Router on iOS / Android / Web.
      </Text>
    </YStack>
  );
}
