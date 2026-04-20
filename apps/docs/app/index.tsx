/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-jsx-as-prop -- landing page */
import { Box, Heading, Link, Text, VStack } from "@superstyling/core";
import { DocsPage, Section } from "../src/docs/DocsLayout";

export default function Home() {
  return (
    <DocsPage
      title="Superstyling"
      description="A Chakra-UI-shaped React component library built on Tamagui. Same ergonomic API across web, iOS, and Android, with compile-time style extraction and a type-safe theme."
    >
      <Section title="Getting started">
        <VStack gap="$2" alignItems="flex-start">
          <Link href="/getting-started/next">
            <Text>→ Next.js (App Router or Pages)</Text>
          </Link>
          <Link href="/getting-started/expo">
            <Text>→ Expo (iOS + Android)</Text>
          </Link>
          <Link href="/getting-started/vite">
            <Text>→ Vite (SPA / Vike / One)</Text>
          </Link>
        </VStack>
      </Section>

      <Section title="Components">
        <Text fontSize="$3">
          Every v0.1 primitive has a docs page with live examples, variants, and the full props
          table. Start with{" "}
          <Link href="/components/button">
            <Text color="$primary">Button</Text>
          </Link>{" "}
          or browse the sidebar.
        </Text>
      </Section>

      <Section title="Why">
        <VStack gap="$2">
          <Text fontSize="$3">
            <Text fontWeight="700">One API, three platforms.</Text> Ship the same component code to
            web, iOS, and Android. Tamagui handles the renderer; Superstyling gives you Chakra-style
            ergonomics on top.
          </Text>
          <Text fontSize="$3">
            <Text fontWeight="700">Compile-time extraction.</Text> Style props compile to atomic CSS
            on the web and flat StyleSheet objects on native — no runtime parser.
          </Text>
          <Text fontSize="$3">
            <Text fontWeight="700">Type-safe theme.</Text> Your palette, spacing, breakpoints, and
            semantic tokens are typed end to end, so every color prop autocompletes.
          </Text>
        </VStack>
      </Section>

      <Box paddingVertical="$4">
        <Text fontSize="$2" color="$color10">
          © {new Date().getFullYear()} Superstyling · MIT License
        </Text>
      </Box>
    </DocsPage>
  );
}
