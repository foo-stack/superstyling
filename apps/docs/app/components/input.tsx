/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-new-array-as-prop, react-perf/jsx-no-jsx-as-prop -- docs page */
import { Input, Text, Textarea, VStack } from "@superstyling/core";
import { ComponentDemo } from "../../src/docs/ComponentDemo";
import { DocsPage, PropsTable, Section } from "../../src/docs/DocsLayout";

export default function InputPage() {
  return (
    <DocsPage
      title="Input · Textarea"
      description="Single-line (Input) and multi-line (Textarea) text inputs. Both share four variants, four sizes, and full FormControl integration."
    >
      <Section title="Import">
        <ComponentDemo
          code={`import { Input, Textarea } from "@superstyling/core";`}
          preview={
            <Text fontFamily="$mono">
              import {"{ Input, Textarea }"} from "@superstyling/core";
            </Text>
          }
          defaultOpen
        />
      </Section>

      <Section title="Variants">
        <ComponentDemo
          code={`<Input variant="outline" placeholder="Outline (default)" />
<Input variant="filled" placeholder="Filled" />
<Input variant="flushed" placeholder="Flushed" />
<Input variant="unstyled" placeholder="Unstyled" />`}
          preview={
            <VStack gap="$2">
              <Input variant="outline" placeholder="Outline (default)" />
              <Input variant="filled" placeholder="Filled" />
              <Input variant="flushed" placeholder="Flushed" />
              <Input variant="unstyled" placeholder="Unstyled" />
            </VStack>
          }
        />
      </Section>

      <Section title="Sizes">
        <ComponentDemo
          code={`<Input size="xs" placeholder="Extra small" />
<Input size="sm" placeholder="Small" />
<Input size="md" placeholder="Medium" />
<Input size="lg" placeholder="Large" />`}
          preview={
            <VStack gap="$2">
              <Input size="xs" placeholder="Extra small" />
              <Input size="sm" placeholder="Small" />
              <Input size="md" placeholder="Medium" />
              <Input size="lg" placeholder="Large" />
            </VStack>
          }
        />
      </Section>

      <Section title="Type=password">
        <ComponentDemo
          code={`<Input type="password" placeholder="••••••••" />`}
          preview={<Input type="password" placeholder="••••••••" />}
        />
      </Section>

      <Section title="Textarea">
        <ComponentDemo
          code={`<Textarea placeholder="Tell us about yourself" rows={4} />`}
          preview={<Textarea placeholder="Tell us about yourself" rows={4} />}
        />
      </Section>

      <Section title="Props (shared)">
        <PropsTable
          props={[
            {
              name: "variant",
              type: `"outline" | "filled" | "flushed" | "unstyled"`,
              default: `"outline"`,
              description: "Visual treatment.",
            },
            {
              name: "size",
              type: `"xs" | "sm" | "md" | "lg"`,
              default: `"md"`,
              description: "Height + font.",
            },
            { name: "placeholder", type: "string", description: "Placeholder text." },
            { name: "value", type: "string", description: "Controlled value." },
            {
              name: "onChangeText",
              type: "(v: string) => void",
              description: "Called with the new string on every keystroke.",
            },
            {
              name: "isInvalid",
              type: "boolean",
              description: "Visual invalid state. Auto-synced when nested in a FormControl.",
            },
            { name: "isDisabled", type: "boolean", description: "Disable + dim." },
            {
              name: "isReadOnly",
              type: "boolean",
              description: "Prevent edit but allow selection.",
            },
            {
              name: "type",
              type: `"text" | "email" | "password" | …`,
              default: `"text"`,
              description:
                "HTML input type on web. On native, type='password' maps to secureTextEntry.",
            },
          ]}
        />
      </Section>

      <Section title="Textarea-specific props">
        <PropsTable
          props={[
            {
              name: "rows",
              type: "number",
              default: "3",
              description: "Visible row count. Maps to numberOfLines on native.",
            },
          ]}
        />
      </Section>
    </DocsPage>
  );
}
