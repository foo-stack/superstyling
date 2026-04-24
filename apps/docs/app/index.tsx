/* oxlint-disable react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-array-as-prop, react-perf/jsx-no-new-object-as-prop -- docs landing, not a hot path */
import { Box, Button, HStack, Heading, Link, Text, VStack } from "@superstyling/core";
import { DocsPage } from "~/components/DocsPage";
import { DocsCodeBlock } from "~/components/DocsCodeBlock";

const FEATURES: { title: string; body: string }[] = [
  {
    title: "One API, three platforms",
    body: "Web, iOS, Android from a single component tree. Built on Tamagui v2.",
  },
  {
    title: "Chakra-shaped ergonomics",
    body: "Variants, sizes, colorScheme, FormControl, dot-namespaced compound components — the DX you know.",
  },
  {
    title: "Type-safe theme",
    body: "createSystem() wires your theme into Tamagui's config. Autocomplete every token.",
  },
  {
    title: "Compile-time CSS on web",
    body: "Tamagui's static extractor. Atomic CSS output, no runtime style recompute in production.",
  },
  {
    title: "Flat StyleSheet on native",
    body: "Same components, same props — but RN StyleSheet.create output on the other side.",
  },
  {
    title: "Every component you need",
    body: "Box, Stack, Button, Modal, FormControl, Input, Select, Alert, Avatar, Badge — all 20.",
  },
];

export default function HomePage() {
  return (
    <DocsPage currentPath="/">
      <VStack gap="$5" paddingBottom="$8">
        <VStack gap="$3" paddingTop="$6">
          <Heading level={1} fontSize={44} lineHeight={48}>
            Chakra on Tamagui
          </Heading>
          <Text fontSize={18} color="$color11" lineHeight={26}>
            A cross-platform UI library that brings Chakra's developer experience to Tamagui's
            cross-platform engine. Web + iOS + Android from a single API.
          </Text>
          <HStack gap="$3" paddingTop="$3" flexWrap="wrap">
            <Link href="/getting-started/next" textDecorationLine="none">
              <Button colorScheme="blue" size="md">
                Get started
              </Button>
            </Link>
            <Link href="/migration/from-chakra-v2" textDecorationLine="none">
              <Button variant="outline" size="md">
                Migrating from Chakra?
              </Button>
            </Link>
            <Link href="/components/button" textDecorationLine="none">
              <Button variant="ghost" size="md">
                Browse components
              </Button>
            </Link>
            <Link
              href="https://github.com/foo-stack/superstyling"
              isExternal
              textDecorationLine="none"
            >
              <Button variant="ghost" size="md">
                GitHub
              </Button>
            </Link>
          </HStack>
        </VStack>

        <VStack gap="$2" paddingTop="$4">
          <Heading level={2}>Install</Heading>
          <DocsCodeBlock language="bash">
            {`yarn add @superstyling/core @superstyling/vite react-native-web`}
          </DocsCodeBlock>
          <Text fontSize={13} color="$color10">
            Next.js, Expo, and Vite each get their own integration package. Pick the{" "}
            <Link href="/getting-started/next">Next</Link>,{" "}
            <Link href="/getting-started/expo">Expo</Link>, or{" "}
            <Link href="/getting-started/vite">Vite</Link> guide.
          </Text>
        </VStack>

        <VStack gap="$4" paddingTop="$4">
          <Heading level={2}>Why</Heading>
          <Box flexDirection="row" flexWrap="wrap" gap="$4" $md={{ flexDirection: "row" }}>
            {FEATURES.map((f) => (
              <Box
                key={f.title}
                flexBasis="100%"
                $md={{ flexBasis: "48%" }}
                padding="$4"
                borderWidth={1}
                borderColor="$borderColor"
                borderRadius={10}
                backgroundColor="$color2"
                gap="$2"
              >
                <Text fontSize={16} fontWeight="600" color="$color">
                  {f.title}
                </Text>
                <Text fontSize={14} color="$color11" lineHeight={20}>
                  {f.body}
                </Text>
              </Box>
            ))}
          </Box>
        </VStack>
      </VStack>
    </DocsPage>
  );
}
