/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-new-array-as-prop, react-perf/jsx-no-jsx-as-prop -- docs page */
import { Heading, Text, VStack } from "@superstyling/core";
import { ComponentDemo } from "../../src/docs/ComponentDemo";
import { DocsPage, PropsTable, Section } from "../../src/docs/DocsLayout";

export default function HeadingPage() {
  return (
    <DocsPage
      title="Heading"
      description="Semantic heading primitive. On web the level prop maps to the matching h1–h6 element; on native it always renders as Text with the visual size applied so screen readers announce the correct hierarchy."
    >
      <Section title="Import">
        <ComponentDemo
          code={`import { Heading } from "@superstyling/core";`}
          preview={
            <Text fontFamily="$mono">import {"{ Heading }"} from "@superstyling/core";</Text>
          }
          defaultOpen
        />
      </Section>

      <Section title="All six levels">
        <ComponentDemo
          code={`<Heading level={1}>Heading 1</Heading>
<Heading level={2}>Heading 2</Heading>
<Heading level={3}>Heading 3</Heading>
<Heading level={4}>Heading 4</Heading>
<Heading level={5}>Heading 5</Heading>
<Heading level={6}>Heading 6</Heading>`}
          preview={
            <VStack gap="$2">
              <Heading level={1}>Heading 1</Heading>
              <Heading level={2}>Heading 2</Heading>
              <Heading level={3}>Heading 3</Heading>
              <Heading level={4}>Heading 4</Heading>
              <Heading level={5}>Heading 5</Heading>
              <Heading level={6}>Heading 6</Heading>
            </VStack>
          }
        />
      </Section>

      <Section title="Overriding size while keeping semantics">
        <ComponentDemo
          code={`<Heading level={2} fontSize="$10">
  Semantically h2, visually larger
</Heading>`}
          preview={
            <Heading level={2} fontSize="$10">
              Semantically h2, visually larger
            </Heading>
          }
        />
      </Section>

      <Section title="Color tokens">
        <ComponentDemo
          code={`<Heading level={3} color="$primary">
  A primary-coloured heading
</Heading>`}
          preview={
            <Heading level={3} color="$primary">
              A primary-coloured heading
            </Heading>
          }
        />
      </Section>

      <Section title="Props">
        <PropsTable
          props={[
            {
              name: "level",
              type: "1 | 2 | 3 | 4 | 5 | 6",
              required: true,
              description:
                "Semantic level. On web this becomes the matching heading element; on native it stays a Text but the role is set so screen readers expose the level.",
            },
            {
              name: "fontSize",
              type: "$1 | $2 | … | number",
              description: "Override the level's default visual size.",
            },
            {
              name: "fontWeight",
              type: `"100"–"900"`,
              default: `"700"`,
              description: "Heading weight. Defaults to 700 across all levels.",
            },
            {
              name: "color",
              type: "ColorToken | CSS color",
              default: "$foreground",
              description: "Heading colour. Prefer semantic tokens for dark-mode parity.",
            },
          ]}
        />
      </Section>

      <Section title="Accessibility">
        <Text fontSize="$3">
          Keep headings in document order and don't skip levels. Superstyling preserves the semantic
          element on web and sets the correct
          <Text fontFamily="$mono"> accessibilityRole="header"</Text> plus
          <Text fontFamily="$mono"> aria-level</Text> on native, so both platforms surface the same
          heading hierarchy to assistive tech.
        </Text>
      </Section>
    </DocsPage>
  );
}
