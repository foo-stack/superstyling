/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-new-array-as-prop, react-perf/jsx-no-jsx-as-prop -- docs page */
import { Badge, Button, HStack, Text, VStack } from "@superstyling/core";
import { ComponentDemo } from "../../src/docs/ComponentDemo";
import { DocsPage, Section } from "../../src/docs/DocsLayout";

const CREATE_SYSTEM = `// tamagui.config.ts
import { createSystem } from "@superstyling/core";

export const system = createSystem({
  colors: {
    // Override just the brand palette; everything else uses defaults.
    brand: {
      "1": "#f0f9ff",
      "9": "#0284c7",
      "12": "#0c4a6e",
    },
  },
  space: {
    // Add a custom spacing token.
    huge: 96,
  },
  radii: {
    md: 10,     // override the default medium radius
    pill: 9999,
  },
});

export default system.config;

declare module "tamagui" {
  interface TamaguiCustomConfig extends typeof system.config {}
}`;

const COMPONENTS_OVERRIDE = `// Override per-component defaults via theme.components
export const system = createSystem({
  components: {
    Button: {
      // Make every <Button> use the brand scheme by default.
      defaultProps: { colorScheme: "brand" },
    },
    Heading: {
      // Tighten heading letter spacing globally.
      sx: { letterSpacing: -0.5 },
    },
  },
});`;

const USE_COLORS = `// Anywhere in your app, reference the custom tokens:
<Badge colorScheme="brand">New</Badge>
<Box padding="$huge" borderRadius="$pill">Hero</Box>`;

export default function ThemingExample() {
  return (
    <DocsPage
      title="Example — Theming walkthrough"
      description="Customize colors, spacing, radii, and per-component defaults by passing a ThemeInput into createSystem. Everything you don't override keeps the Superstyling defaults."
    >
      <Section title="1. Start with createSystem">
        <ComponentDemo
          code={CREATE_SYSTEM}
          preview={<Text fontFamily="$mono">// tamagui.config.ts with createSystem …</Text>}
          defaultOpen
        />
      </Section>

      <Section title="2. Use the tokens you defined">
        <ComponentDemo
          code={USE_COLORS}
          preview={
            <VStack gap="$2" alignItems="flex-start">
              <Badge colorScheme="blue">New</Badge>
              <Text fontSize="$2" color="$color10">
                (preview uses $blue — your own brand scheme would render here.)
              </Text>
            </VStack>
          }
        />
      </Section>

      <Section title="3. Per-component defaults">
        <Text fontSize="$3">
          Pass a <Text fontFamily="$mono">components</Text> map to apply defaultProps or style
          overrides to every instance of a primitive. Useful when your whole app wants{" "}
          <Text fontFamily="$mono">Button colorScheme="brand"</Text> without repeating it every
          time.
        </Text>
        <ComponentDemo
          code={COMPONENTS_OVERRIDE}
          preview={<Text fontFamily="$mono">// theme.components overrides …</Text>}
          defaultOpen
        />
      </Section>

      <Section title="Default vs custom — side by side">
        <HStack gap="$3" alignItems="center" flexWrap="wrap">
          <Button colorScheme="blue">Default blue</Button>
          <Button colorScheme="green">Default green</Button>
          <Button colorScheme="red">Default red</Button>
        </HStack>
      </Section>

      <Section title="What you can override">
        <VStack gap="$2">
          <Text fontSize="$3">
            · <Text fontFamily="$mono">colors</Text> — named palettes, each a 12-step scale
          </Text>
          <Text fontSize="$3">
            · <Text fontFamily="$mono">space</Text> / <Text fontFamily="$mono">sizes</Text> —
            spacing + size tokens
          </Text>
          <Text fontSize="$3">
            · <Text fontFamily="$mono">radii</Text> — border radius tokens
          </Text>
          <Text fontSize="$3">
            · <Text fontFamily="$mono">fonts</Text> / <Text fontFamily="$mono">fontSizes</Text> /{" "}
            <Text fontFamily="$mono">fontWeights</Text> — typography scale
          </Text>
          <Text fontSize="$3">
            · <Text fontFamily="$mono">breakpoints</Text> — responsive query keys
          </Text>
          <Text fontSize="$3">
            · <Text fontFamily="$mono">shadows</Text>, <Text fontFamily="$mono">zIndices</Text>,{" "}
            <Text fontFamily="$mono">letterSpacings</Text>,{" "}
            <Text fontFamily="$mono">lineHeights</Text>
          </Text>
          <Text fontSize="$3">
            · <Text fontFamily="$mono">semanticTokens</Text> — abstract tokens that resolve
            differently per color mode
          </Text>
          <Text fontSize="$3">
            · <Text fontFamily="$mono">components</Text> — per-primitive defaultProps and sx
            overrides
          </Text>
        </VStack>
      </Section>
    </DocsPage>
  );
}
