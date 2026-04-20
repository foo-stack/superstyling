/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-new-array-as-prop, react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-function-as-prop -- docs page */
import { useState } from "react";
import { Radio, RadioGroup, Text, VStack } from "@superstyling/core";
import { ComponentDemo } from "../../src/docs/ComponentDemo";
import { DocsPage, PropsTable, Section } from "../../src/docs/DocsLayout";

export default function RadioPage() {
  return (
    <DocsPage
      title="Radio · RadioGroup"
      description="Exclusive-select pattern. RadioGroup owns the selected value; Radio items consume it by matching their value prop. Size and invalid state propagate from the group down via context."
    >
      <Section title="Import">
        <ComponentDemo
          code={`import { Radio, RadioGroup } from "@superstyling/core";`}
          preview={
            <Text fontFamily="$mono">
              import {"{ Radio, RadioGroup }"} from "@superstyling/core";
            </Text>
          }
          defaultOpen
        />
      </Section>

      <Section title="Basic usage">
        <ComponentDemo
          code={`function Example() {
  const [plan, setPlan] = useState("free");
  return (
    <RadioGroup value={plan} onChange={setPlan} colorScheme="blue">
      <Radio value="free">Free</Radio>
      <Radio value="pro">Pro</Radio>
      <Radio value="team">Team</Radio>
    </RadioGroup>
  );
}`}
          preview={<BasicRadioDemo />}
        />
      </Section>

      <Section title="Sizes">
        <ComponentDemo
          code={`<RadioGroup size="sm" defaultValue="a">
  <Radio value="a">A</Radio>
  <Radio value="b">B</Radio>
</RadioGroup>

<RadioGroup size="lg" defaultValue="a">…</RadioGroup>`}
          preview={
            <VStack gap="$4">
              <RadioGroup size="sm" defaultValue="a" colorScheme="blue">
                <Radio value="a">Small A</Radio>
                <Radio value="b">Small B</Radio>
              </RadioGroup>
              <RadioGroup size="lg" defaultValue="a" colorScheme="blue">
                <Radio value="a">Large A</Radio>
                <Radio value="b">Large B</Radio>
              </RadioGroup>
            </VStack>
          }
        />
      </Section>

      <Section title="Props — RadioGroup">
        <PropsTable
          props={[
            { name: "value", type: "string", description: "Controlled selected value." },
            { name: "defaultValue", type: "string", description: "Uncontrolled initial value." },
            {
              name: "onChange",
              type: "(value: string) => void",
              description: "Fires whenever selection changes.",
            },
            {
              name: "size",
              type: `"sm" | "md" | "lg"`,
              default: `"md"`,
              description: "Propagates to every Radio child.",
            },
            { name: "colorScheme", type: "string", default: `"gray"`, description: "Palette." },
            { name: "isDisabled", type: "boolean", description: "Disable the whole group." },
            {
              name: "isInvalid",
              type: "boolean",
              description: "Invalid state. Auto-synced from FormControl.",
            },
          ]}
        />
      </Section>

      <Section title="Props — Radio">
        <PropsTable
          props={[
            {
              name: "value",
              type: "string",
              required: true,
              description: "Value this item represents. Required.",
            },
            { name: "isDisabled", type: "boolean", description: "Disable this specific item." },
            { name: "children", type: "ReactNode", description: "Label text." },
          ]}
        />
      </Section>
    </DocsPage>
  );
}

function BasicRadioDemo() {
  const [plan, setPlan] = useState("free");
  return (
    <RadioGroup value={plan} onChange={setPlan} colorScheme="blue">
      <Radio value="free">Free</Radio>
      <Radio value="pro">Pro</Radio>
      <Radio value="team">Team</Radio>
    </RadioGroup>
  );
}
