/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-jsx-as-prop -- landing */
import { Box, HStack, Heading, Text, VStack } from "@superstyling/core";

interface Feature {
  title: string;
  body: string;
  emoji: string;
}

const FEATURES: Feature[] = [
  {
    emoji: "🎯",
    title: "One API, three platforms",
    body: "Ship identical component code to web, iOS, and Android. Tamagui handles the renderer; Superstyling gives you Chakra-style ergonomics on top.",
  },
  {
    emoji: "⚡",
    title: "Compile-time extraction",
    body: "Style props compile to atomic CSS on the web and flat StyleSheet objects on native. No runtime parser, no style recalc cost.",
  },
  {
    emoji: "🎨",
    title: "Type-safe theme",
    body: "Your palette, spacing, breakpoints, and semantic tokens are typed end to end. Every color prop autocompletes.",
  },
  {
    emoji: "🌓",
    title: "Light + dark, zero FOUC",
    body: "ColorModeScript blocks React hydration until the right class is on <html>. No flash of unstyled content on first paint.",
  },
  {
    emoji: "🧩",
    title: "Every Chakra primitive",
    body: "Box, Stack, Button, Modal, FormControl, Input, Checkbox, Radio, Switch, Select — 20 components, 20 docs pages, ships at v0.1.",
  },
  {
    emoji: "🔗",
    title: "Integration packages",
    body: "@superstyling/next (App + Pages Router), @superstyling/expo (six subpath entries for native setup), @superstyling/vite.",
  },
];

export function FeatureGrid() {
  return (
    <Box paddingHorizontal="$6" paddingVertical="$10" alignItems="center">
      <Box width="100%" maxWidth={1120}>
        <VStack gap="$3" alignItems="center" marginBottom="$8">
          <Heading level={2} textAlign="center" fontSize={36}>
            Built for shipping cross-platform.
          </Heading>
          <Text fontSize="$4" color="$color10" textAlign="center" maxWidth={560}>
            The pieces you expect from Chakra, on the runtime you want for native.
          </Text>
        </VStack>

        <HStack gap="$4" flexWrap="wrap" justifyContent="center">
          {FEATURES.map((f) => (
            <VStack
              key={f.title}
              gap="$2"
              flexBasis={320}
              flexGrow={1}
              maxWidth={360}
              padding="$5"
              borderWidth={1}
              borderColor="$borderColor"
              borderRadius={10}
              backgroundColor="$background"
            >
              <Text fontSize={28}>{f.emoji}</Text>
              <Heading level={3} fontSize={18}>
                {f.title}
              </Heading>
              <Text fontSize="$3" color="$color10" lineHeight="$5">
                {f.body}
              </Text>
            </VStack>
          ))}
        </HStack>
      </Box>
    </Box>
  );
}
