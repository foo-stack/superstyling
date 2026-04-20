/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-new-array-as-prop, react-perf/jsx-no-jsx-as-prop -- docs page */
import { Divider, HStack, Text, VStack } from "@superstyling/core";
import { ComponentDemo } from "../../src/docs/ComponentDemo";
import { DocsPage, PropsTable, Section } from "../../src/docs/DocsLayout";

export default function DividerPage() {
  return (
    <DocsPage
      title="Divider"
      description="A thin separator line with horizontal and vertical variants. Use it to split sections within a stack, or inline between items in a row."
    >
      <Section title="Import">
        <ComponentDemo
          code={`import { Divider } from "@superstyling/core";`}
          preview={
            <Text fontFamily="$mono">import {"{ Divider }"} from "@superstyling/core";</Text>
          }
          defaultOpen
        />
      </Section>

      <Section title="Horizontal (default)">
        <ComponentDemo
          code={`<VStack gap="$2">
  <Text>Section one</Text>
  <Divider />
  <Text>Section two</Text>
</VStack>`}
          preview={
            <VStack gap="$2">
              <Text>Section one</Text>
              <Divider />
              <Text>Section two</Text>
            </VStack>
          }
        />
      </Section>

      <Section title="Vertical">
        <ComponentDemo
          code={`<HStack height={32} alignItems="center" gap="$3">
  <Text>Left</Text>
  <Divider orientation="vertical" />
  <Text>Right</Text>
</HStack>`}
          preview={
            <HStack height={32} alignItems="center" gap="$3">
              <Text>Left</Text>
              <Divider orientation="vertical" />
              <Text>Right</Text>
            </HStack>
          }
        />
      </Section>

      <Section title="Props">
        <PropsTable
          props={[
            {
              name: "orientation",
              type: `"horizontal" | "vertical"`,
              default: `"horizontal"`,
              description:
                "Axis the divider sits on. Vertical requires a parent with a set height.",
            },
          ]}
        />
      </Section>
    </DocsPage>
  );
}
