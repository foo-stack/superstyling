/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-new-array-as-prop, react-perf/jsx-no-jsx-as-prop -- docs page */
import { Link, Text, VStack } from "@superstyling/core";
import { ComponentDemo } from "../../src/docs/ComponentDemo";
import { DocsPage, PropsTable, Section } from "../../src/docs/DocsLayout";

export default function LinkPage() {
  return (
    <DocsPage
      title="Link"
      description="Anchor primitive. Renders a real <a> on web so the browser handles keyboard, middle-click, and copy-link. On native it falls back to a pressable that invokes the Linking API."
    >
      <Section title="Import">
        <ComponentDemo
          code={`import { Link } from "@superstyling/core";`}
          preview={<Text fontFamily="$mono">import {"{ Link }"} from "@superstyling/core";</Text>}
          defaultOpen
        />
      </Section>

      <Section title="Internal vs external">
        <ComponentDemo
          code={`<Link href="/">Internal link</Link>
<Link href="https://tamagui.dev" isExternal>External link</Link>`}
          preview={
            <VStack gap="$2" alignItems="flex-start">
              <Link href="/">Internal link</Link>
              <Link href="https://tamagui.dev" isExternal>
                External link (opens in new tab)
              </Link>
            </VStack>
          }
        />
      </Section>

      <Section title="Props">
        <PropsTable
          props={[
            {
              name: "href",
              type: "string",
              required: true,
              description: "Destination URL. Absolute or relative.",
            },
            {
              name: "isExternal",
              type: "boolean",
              default: "false",
              description: `On web adds target="_blank" + rel="noopener noreferrer". On native uses Linking.openURL.`,
            },
          ]}
        />
      </Section>

      <Section title="Accessibility">
        <Text fontSize="$3">
          External links should have visible text that makes the destination obvious (avoid "click
          here"). Link's default focus ring comes from the underlying platform element; override via
          <Text fontFamily="$mono"> _focus</Text> if you need a custom state.
        </Text>
      </Section>
    </DocsPage>
  );
}
