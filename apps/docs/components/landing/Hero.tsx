/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-jsx-as-prop -- landing */
import { Badge, Box, Button, HStack, Heading, Link, Text, VStack } from "@superstyling/core";

/**
 * Landing-page hero. Big headline + tagline + CTA row.
 */
export function Hero() {
  return (
    <Box paddingVertical="$12" paddingHorizontal="$6" alignItems="center" justifyContent="center">
      <VStack gap="$6" alignItems="center" maxWidth={920} width="100%">
        <Badge variant="subtle" colorScheme="blue" size="md">
          v0.1.0 — pre-release
        </Badge>

        <VStack gap="$4" alignItems="center">
          <Heading level={1} fontSize={64} textAlign="center" letterSpacing={-1}>
            Chakra on Tamagui.
          </Heading>
          <Text fontSize="$5" color="$color10" textAlign="center" maxWidth={640} lineHeight="$6">
            A React component library that ships the same code to web, iOS, and Android.
            Chakra-style ergonomics. Tamagui-level performance. Type-safe theme. Zero runtime
            style-prop cost.
          </Text>
        </VStack>

        <HStack gap="$3" flexWrap="wrap" justifyContent="center">
          <Link href="/getting-started/next">
            <Button colorScheme="blue" size="lg">
              Get started
            </Button>
          </Link>
          <Link href="/components/button">
            <Button variant="outline" size="lg">
              Browse components
            </Button>
          </Link>
          <Link href="https://github.com/foo-stack/superstyling" isExternal>
            <Button variant="ghost" size="lg">
              GitHub ↗
            </Button>
          </Link>
        </HStack>
      </VStack>
    </Box>
  );
}
