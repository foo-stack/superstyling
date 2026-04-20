/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-new-array-as-prop, react-perf/jsx-no-jsx-as-prop -- docs page */
import { Box, HStack, Text } from "@superstyling/core";
import { ComponentDemo } from "../../src/docs/ComponentDemo";
import { DocsPage, PropsTable, Section } from "../../src/docs/DocsLayout";

export default function BoxPage() {
  return (
    <DocsPage
      title="Box"
      description="The most basic layout primitive. Renders a Tamagui YStack under the hood, so it stretches its children vertically by default and accepts every style prop the design system understands."
    >
      <Section title="Import">
        <ComponentDemo
          code={`import { Box } from "@superstyling/core";`}
          preview={<Text fontFamily="$mono">import {"{ Box }"} from "@superstyling/core";</Text>}
          defaultOpen
        />
      </Section>

      <Section title="Basic usage">
        <ComponentDemo
          code={`<Box padding="$4" backgroundColor="$primary" borderRadius={8}>
  <Text color="$primaryContrast">Hello, Box.</Text>
</Box>`}
          preview={
            <Box padding="$4" backgroundColor="$primary" borderRadius={8}>
              <Text color="$primaryContrast">Hello, Box.</Text>
            </Box>
          }
        />
      </Section>

      <Section title="Composing with pseudo-props">
        <ComponentDemo
          code={`<Box
  padding="$4"
  backgroundColor="$color2"
  borderRadius={8}
  _hover={{ backgroundColor: "$primaryMuted" }}
>
  Hover me
</Box>`}
          preview={
            <Box
              padding="$4"
              backgroundColor="$color2"
              borderRadius={8}
              _hover={{ backgroundColor: "$primaryMuted" }}
            >
              <Text>Hover me</Text>
            </Box>
          }
        />
      </Section>

      <Section title="Responsive style props">
        <ComponentDemo
          code={`<Box
  padding={{ base: "$2", md: "$6" }}
  backgroundColor="$color3"
  borderRadius={8}
>
  Padding grows at the md breakpoint.
</Box>`}
          preview={
            <Box
              // oxlint-disable-next-line typescript/no-explicit-any
              padding={{ base: "$2", md: "$6" } as any}
              backgroundColor="$color3"
              borderRadius={8}
            >
              <Text>Padding grows at the md breakpoint.</Text>
            </Box>
          }
        />
      </Section>

      <Section title="Row layout via HStack-like flexDirection">
        <ComponentDemo
          code={`<Box flexDirection="row" gap="$2">
  <Box width={32} height={32} backgroundColor="$primary" borderRadius={4} />
  <Box width={32} height={32} backgroundColor="$primary" borderRadius={4} />
  <Box width={32} height={32} backgroundColor="$primary" borderRadius={4} />
</Box>`}
          preview={
            <HStack gap="$2">
              <Box width={32} height={32} backgroundColor="$primary" borderRadius={4} />
              <Box width={32} height={32} backgroundColor="$primary" borderRadius={4} />
              <Box width={32} height={32} backgroundColor="$primary" borderRadius={4} />
            </HStack>
          }
        />
      </Section>

      <Section title="Props">
        <Text fontSize="$3" color="$color10">
          Box accepts every Tamagui <Text fontFamily="$mono">YStack</Text> prop plus the
          Chakra-style pseudo-prop mixins (<Text fontFamily="$mono">_hover</Text>,{" "}
          <Text fontFamily="$mono">_focus</Text>,<Text fontFamily="$mono"> _active</Text>, …) and
          the
          <Text fontFamily="$mono"> sx</Text> escape hatch. The list below highlights the props
          unique to Superstyling's Box surface.
        </Text>
        <PropsTable
          props={[
            {
              name: "sx",
              type: "Partial<BoxProps>",
              description:
                "Escape hatch for style overrides. Merged onto the underlying element after props, so it wins any conflict.",
            },
            {
              name: "_hover",
              type: "Partial<BoxProps>",
              description:
                "Styles applied on pointer hover (web-only). On native this is treated as a no-op.",
            },
            {
              name: "_focus",
              type: "Partial<BoxProps>",
              description: "Styles applied when the element is focused.",
            },
            {
              name: "_focusVisible",
              type: "Partial<BoxProps>",
              description:
                "Styles applied when the element receives keyboard-triggered focus (web-only).",
            },
            {
              name: "_active",
              type: "Partial<BoxProps>",
              description: "Styles applied while the element is being pressed/activated.",
            },
            {
              name: "_pressed",
              type: "Partial<BoxProps>",
              description:
                "Alias for the native pressed state. Same semantics as _active cross-platform.",
            },
            {
              name: "_disabled",
              type: "Partial<BoxProps>",
              description:
                "Styles applied when the element carries aria-disabled or its disabled prop is true.",
            },
          ]}
        />
      </Section>
    </DocsPage>
  );
}
