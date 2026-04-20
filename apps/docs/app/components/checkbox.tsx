/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-new-array-as-prop, react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-function-as-prop -- docs page */
import { useState } from "react";
import { Checkbox, HStack, Text, VStack } from "@superstyling/core";
import { ComponentDemo } from "../../src/docs/ComponentDemo";
import { DocsPage, PropsTable, Section } from "../../src/docs/DocsLayout";

export default function CheckboxPage() {
  return (
    <DocsPage
      title="Checkbox"
      description="Boolean toggle with a label slot. Three sizes, full colorScheme palette, FormControl-aware."
    >
      <Section title="Import">
        <ComponentDemo
          code={`import { Checkbox } from "@superstyling/core";`}
          preview={
            <Text fontFamily="$mono">import {"{ Checkbox }"} from "@superstyling/core";</Text>
          }
          defaultOpen
        />
      </Section>

      <Section title="Basic usage">
        <ComponentDemo
          code={`function Example() {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox isChecked={checked} onChange={setChecked} colorScheme="blue">
      I agree to the terms
    </Checkbox>
  );
}`}
          preview={<BasicCheckboxDemo />}
        />
      </Section>

      <Section title="Sizes">
        <ComponentDemo
          code={`<Checkbox size="sm">Small</Checkbox>
<Checkbox size="md">Medium</Checkbox>
<Checkbox size="lg">Large</Checkbox>`}
          preview={
            <HStack gap="$4" alignItems="center">
              <Checkbox size="sm" colorScheme="blue">
                Small
              </Checkbox>
              <Checkbox size="md" colorScheme="blue">
                Medium
              </Checkbox>
              <Checkbox size="lg" colorScheme="blue">
                Large
              </Checkbox>
            </HStack>
          }
        />
      </Section>

      <Section title="Disabled">
        <ComponentDemo
          code={`<Checkbox isDisabled>Disabled unchecked</Checkbox>
<Checkbox isDisabled defaultIsChecked>Disabled checked</Checkbox>`}
          preview={
            <VStack gap="$2" alignItems="flex-start">
              <Checkbox isDisabled>Disabled unchecked</Checkbox>
              <Checkbox isDisabled defaultIsChecked>
                Disabled checked
              </Checkbox>
            </VStack>
          }
        />
      </Section>

      <Section title="Props">
        <PropsTable
          props={[
            { name: "isChecked", type: "boolean", description: "Controlled checked state." },
            {
              name: "defaultIsChecked",
              type: "boolean",
              default: "false",
              description: "Uncontrolled initial state.",
            },
            {
              name: "onChange",
              type: "(checked: boolean) => void",
              description: "Change handler.",
            },
            {
              name: "size",
              type: `"sm" | "md" | "lg"`,
              default: `"md"`,
              description: "Box and label size.",
            },
            {
              name: "colorScheme",
              type: "string",
              default: `"gray"`,
              description: "Palette applied when checked.",
            },
            { name: "isDisabled", type: "boolean", description: "Disable + dim." },
            {
              name: "isInvalid",
              type: "boolean",
              description: "Invalid visual state. Auto-synced from FormControl.",
            },
            {
              name: "children",
              type: "ReactNode",
              description: "Label. Strings/numbers wrapped in a Text automatically.",
            },
          ]}
        />
      </Section>
    </DocsPage>
  );
}

function BasicCheckboxDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox isChecked={checked} onChange={setChecked} colorScheme="blue">
      I agree to the terms
    </Checkbox>
  );
}
