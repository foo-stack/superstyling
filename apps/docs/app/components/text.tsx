/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-new-array-as-prop, react-perf/jsx-no-jsx-as-prop -- docs page */
import { Text, VStack } from "@superstyling/core";
import { ComponentDemo } from "../../src/docs/ComponentDemo";
import { DocsPage, PropsTable, Section } from "../../src/docs/DocsLayout";

export default function TextPage() {
  return (
    <DocsPage
      title="Text"
      description="The primary inline-text primitive. Maps to a platform-appropriate text element (a plain <span> on web, RN <Text> on native) and accepts every typography token and style prop the system knows."
    >
      <Section title="Import">
        <ComponentDemo
          code={`import { Text } from "@superstyling/core";`}
          preview={<Text fontFamily="$mono">import {"{ Text }"} from "@superstyling/core";</Text>}
          defaultOpen
        />
      </Section>

      <Section title="Sizes">
        <ComponentDemo
          code={`<Text fontSize="$1">Extra small ($1)</Text>
<Text fontSize="$2">Small ($2)</Text>
<Text fontSize="$3">Default ($3)</Text>
<Text fontSize="$4">Large ($4)</Text>
<Text fontSize="$6">Extra large ($6)</Text>`}
          preview={
            <VStack gap="$1">
              <Text fontSize="$1">Extra small ($1)</Text>
              <Text fontSize="$2">Small ($2)</Text>
              <Text fontSize="$3">Default ($3)</Text>
              <Text fontSize="$4">Large ($4)</Text>
              <Text fontSize="$6">Extra large ($6)</Text>
            </VStack>
          }
        />
      </Section>

      <Section title="Weights">
        <ComponentDemo
          code={`<Text fontWeight="400">Regular</Text>
<Text fontWeight="500">Medium</Text>
<Text fontWeight="600">Semibold</Text>
<Text fontWeight="700">Bold</Text>`}
          preview={
            <VStack gap="$1">
              <Text fontWeight="400">Regular</Text>
              <Text fontWeight="500">Medium</Text>
              <Text fontWeight="600">Semibold</Text>
              <Text fontWeight="700">Bold</Text>
            </VStack>
          }
        />
      </Section>

      <Section title="Semantic colors">
        <ComponentDemo
          code={`<Text color="$foreground">Default foreground</Text>
<Text color="$color10">Muted</Text>
<Text color="$primary">Primary</Text>
<Text color="$red9">Danger</Text>
<Text color="$green9">Success</Text>`}
          preview={
            <VStack gap="$1" alignItems="flex-start">
              <Text color="$foreground">Default foreground</Text>
              <Text color="$color10">Muted</Text>
              <Text color="$primary">Primary</Text>
              <Text color="$red9">Danger</Text>
              <Text color="$green9">Success</Text>
            </VStack>
          }
        />
      </Section>

      <Section title="Truncation">
        <ComponentDemo
          code={`<Text numberOfLines={1} maxWidth={240}>
  A long sentence that should be truncated with an ellipsis at the end.
</Text>`}
          preview={
            <Text numberOfLines={1} maxWidth={240}>
              A long sentence that should be truncated with an ellipsis at the end.
            </Text>
          }
        />
      </Section>

      <Section title="Props">
        <PropsTable
          props={[
            {
              name: "fontSize",
              type: "$1 | $2 | $3 | … | number",
              default: "$3",
              description: "Token or raw pixel size. Tokens preserve responsive scaling.",
            },
            {
              name: "fontWeight",
              type: `"100"–"900"`,
              default: `"400"`,
              description: "Weight string. Use numeric values to match the design system.",
            },
            {
              name: "color",
              type: "ColorToken | CSS color",
              default: "$foreground",
              description: "Text color. Prefer semantic tokens so dark mode works automatically.",
            },
            {
              name: "numberOfLines",
              type: "number",
              description:
                "Caps line count. Adds ellipsis on overflow. Use with maxWidth/flex to control where the cut happens.",
            },
          ]}
        />
      </Section>
    </DocsPage>
  );
}
