/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-function-as-prop, react-perf/jsx-no-new-array-as-prop -- docs page, not a hot path */
import { useState } from "react";
import { Checkbox, HStack, VStack } from "@superstyling/core";
import { DocsPage } from "~/components/DocsPage";
import { ComponentDemo } from "~/components/ComponentDemo";
import { DocsCodeBlock } from "~/components/DocsCodeBlock";
import { PropsTable } from "~/components/PropsTable";
import { StatusRow } from "~/components/StatusRow";
import { mdxComponents } from "~/components/MDXComponents";

const H1 = mdxComponents.h1;
const H2 = mdxComponents.h2;
const P = mdxComponents.p;

function BasicCheckboxDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox isChecked={checked} onChange={setChecked} colorScheme="blue">
      I agree to the terms
    </Checkbox>
  );
}

export default function CheckboxPage() {
  return (
    <DocsPage currentPath="/components/checkbox">
      <H1>Checkbox</H1>
      <StatusRow tier="1" platforms="Cross-platform" since="v0.1.0" />
      <P>
        Boolean toggle with a label slot. Three sizes, full colorScheme palette, FormControl-aware.
      </P>
      <H2>Import</H2>
      <DocsCodeBlock language="tsx">
        {`import { Checkbox } from "@superstyling/core";`}
      </DocsCodeBlock>
      <H2>Basic usage</H2>
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
      <H2>Sizes</H2>
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
      <H2>Disabled</H2>
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
      <H2>Props</H2>
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
    </DocsPage>
  );
}
