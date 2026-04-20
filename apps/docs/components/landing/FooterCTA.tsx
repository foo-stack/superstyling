/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-jsx-as-prop -- landing */
import { Box, Button, HStack, Heading, Link, Text, VStack } from "@superstyling/core";

/** Bottom CTA band — one last chance to send the visitor to getting-started. */
export function FooterCTA() {
  return (
    <Box
      paddingVertical="$12"
      paddingHorizontal="$6"
      alignItems="center"
      backgroundColor="$color2"
      borderTopWidth={1}
      borderColor="$borderColor"
    >
      <VStack gap="$4" alignItems="center" maxWidth={720} width="100%">
        <Heading level={2} fontSize={32} textAlign="center">
          Pick a platform. Ship today.
        </Heading>
        <Text fontSize="$4" color="$color10" textAlign="center">
          Getting-started guides walk you from <Text fontFamily="$mono">create-*</Text> to
          <Text fontFamily="$mono"> &lt;Button&gt;</Text> in under 10 minutes.
        </Text>
        <HStack gap="$3" flexWrap="wrap" justifyContent="center" marginTop="$2">
          <Link href="/getting-started/next">
            <Button colorScheme="blue">Next.js</Button>
          </Link>
          <Link href="/getting-started/expo">
            <Button colorScheme="blue" variant="outline">
              Expo
            </Button>
          </Link>
          <Link href="/getting-started/vite">
            <Button colorScheme="blue" variant="outline">
              Vite
            </Button>
          </Link>
        </HStack>
      </VStack>
    </Box>
  );
}
