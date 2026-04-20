/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-new-array-as-prop, react-perf/jsx-no-jsx-as-prop -- docs page */
import { HStack, Spinner, Text } from "@superstyling/core";
import { ComponentDemo } from "../../src/docs/ComponentDemo";
import { DocsPage, PropsTable, Section } from "../../src/docs/DocsLayout";

export default function SpinnerPage() {
  return (
    <DocsPage
      title="Spinner"
      description="Indeterminate loading indicator. Uses the native ActivityIndicator on iOS/Android and a CSS-driven rotating SVG on the web for visual parity."
    >
      <Section title="Import">
        <ComponentDemo
          code={`import { Spinner } from "@superstyling/core";`}
          preview={
            <Text fontFamily="$mono">import {"{ Spinner }"} from "@superstyling/core";</Text>
          }
          defaultOpen
        />
      </Section>

      <Section title="Sizes">
        <ComponentDemo
          code={`<HStack gap="$4" alignItems="center">
  <Spinner size="small" />
  <Spinner size="large" />
</HStack>`}
          preview={
            <HStack gap="$4" alignItems="center">
              <Spinner size="small" />
              <Spinner size="large" />
            </HStack>
          }
        />
      </Section>

      <Section title="Coloured">
        <ComponentDemo
          code={`<Spinner size="large" color="$primary" />`}
          preview={<Spinner size="large" color="$primary" />}
        />
      </Section>

      <Section title="Props">
        <PropsTable
          props={[
            {
              name: "size",
              type: `"small" | "large"`,
              default: `"small"`,
              description:
                "Visual size. Matches React Native's ActivityIndicator values so the native renderer doesn't re-scale.",
            },
            {
              name: "color",
              type: "ColorToken | CSS color",
              description: "Stroke colour. Inherits theme foreground by default.",
            },
          ]}
        />
      </Section>
    </DocsPage>
  );
}
