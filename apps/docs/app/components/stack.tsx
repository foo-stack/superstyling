/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-new-array-as-prop, react-perf/jsx-no-jsx-as-prop -- docs page */
import { Box, HStack, Stack, Text, VStack } from "@superstyling/core";
import { ComponentDemo } from "../../src/docs/ComponentDemo";
import { DocsPage, PropsTable, Section } from "../../src/docs/DocsLayout";

const swatch = { width: 40, height: 40, backgroundColor: "$primary", borderRadius: 4 } as const;

export default function StackPage() {
  return (
    <DocsPage
      title="Stack · HStack · VStack"
      description="Layout primitives that arrange children in a row (HStack) or column (VStack). Stack itself is the direction-aware base — use it when the axis is a prop; use HStack/VStack when you know the axis at design time."
    >
      <Section title="Import">
        <ComponentDemo
          code={`import { Stack, HStack, VStack } from "@superstyling/core";`}
          preview={
            <Text fontFamily="$mono">
              import {"{ Stack, HStack, VStack }"} from "@superstyling/core";
            </Text>
          }
          defaultOpen
        />
      </Section>

      <Section title="HStack — row layout">
        <ComponentDemo
          code={`<HStack gap="$3">
  <Box {...swatch} />
  <Box {...swatch} />
  <Box {...swatch} />
</HStack>`}
          preview={
            <HStack gap="$3">
              <Box {...swatch} />
              <Box {...swatch} />
              <Box {...swatch} />
            </HStack>
          }
        />
      </Section>

      <Section title="VStack — column layout">
        <ComponentDemo
          code={`<VStack gap="$2" alignItems="flex-start">
  <Text>First</Text>
  <Text>Second</Text>
  <Text>Third</Text>
</VStack>`}
          preview={
            <VStack gap="$2" alignItems="flex-start">
              <Text>First</Text>
              <Text>Second</Text>
              <Text>Third</Text>
            </VStack>
          }
        />
      </Section>

      <Section title="Stack with dynamic direction">
        <ComponentDemo
          code={`<Stack direction="row" gap="$2" alignItems="center">
  <Box {...swatch} />
  <Text>Switch to column</Text>
</Stack>`}
          preview={
            <Stack direction="row" gap="$2" alignItems="center">
              <Box {...swatch} />
              <Text>Switch to column</Text>
            </Stack>
          }
        />
      </Section>

      <Section title="Wrapping rows">
        <ComponentDemo
          code={`<HStack gap="$2" flexWrap="wrap">
  {Array.from({ length: 10 }).map((_, i) => <Box key={i} {...swatch} />)}
</HStack>`}
          preview={
            <HStack gap="$2" flexWrap="wrap">
              {Array.from({ length: 10 }).map((_, i) => (
                <Box key={i} {...swatch} />
              ))}
            </HStack>
          }
        />
      </Section>

      <Section title="Props">
        <PropsTable
          props={[
            {
              name: "direction",
              type: `"row" | "column"`,
              default: `"column"`,
              description:
                "Axis children are laid out along. Only on <Stack>; HStack/VStack hard-code this.",
            },
            {
              name: "gap",
              type: "SpaceToken | number",
              description: "Gap between children. Accepts $-tokens or raw pixel numbers.",
            },
            {
              name: "alignItems",
              type: "FlexAlign",
              description:
                "Cross-axis alignment (e.g., center, flex-start). Same semantics as CSS flexbox.",
            },
            {
              name: "justifyContent",
              type: "FlexJustify",
              description: "Main-axis alignment (e.g., space-between, center).",
            },
            {
              name: "flexWrap",
              type: `"wrap" | "nowrap" | "wrap-reverse"`,
              default: `"nowrap"`,
              description: "Whether overflowing children wrap to a new line.",
            },
          ]}
        />
      </Section>
    </DocsPage>
  );
}
