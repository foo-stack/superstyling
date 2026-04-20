import { Box, Heading, Text } from "@superstyling/core";

const textHover = { color: "$color10" } as const;

export default function Home() {
  return (
    <Box flex={1} alignItems="center" justifyContent="center" padding="$4">
      <Heading level={1}>Superstyling Docs</Heading>
      <Text fontSize="$4" marginTop="$4" _hover={textHover}>
        Hello from One on the web.
      </Text>
    </Box>
  );
}
