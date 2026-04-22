/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-function-as-prop, react-perf/jsx-no-new-array-as-prop -- docs page, not a hot path */
import { useState } from "react";
import { Radio, RadioGroup, VStack } from "@superstyling/core";
import { DocsPage } from "~/components/DocsPage";
import { ComponentDemo } from "~/components/ComponentDemo";
import { DocsCodeBlock } from "~/components/DocsCodeBlock";
import { PropsTable } from "~/components/PropsTable";
import { StatusRow } from "~/components/StatusRow";
import { mdxComponents } from "~/components/MDXComponents";

const H1 = mdxComponents.h1;
const H2 = mdxComponents.h2;
const P = mdxComponents.p;

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

export default function RadioPage() {
  return (
    <DocsPage currentPath="/components/radio">
      <H1>Radio · RadioGroup</H1>
      <StatusRow tier="1" platforms="Cross-platform" since="v0.1.0" />
      <P>
        Exclusive-select pattern. RadioGroup owns the selected value; Radio items consume it by
        matching their value prop. Size and invalid state propagate from the group down via context.
      </P>
      <H2>Import</H2>
      <DocsCodeBlock language="tsx">
        {`import { Radio, RadioGroup } from "@superstyling/core";`}
      </DocsCodeBlock>
      <H2>Basic usage</H2>
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
      <H2>Sizes</H2>
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
      <H2>Props — RadioGroup</H2>
      <PropsTable
        props={[
          { name: "value", type: "string", description: "Controlled selected value." },
          {
            name: "defaultValue",
            type: "string",
            description: "Uncontrolled initial value.",
          },
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
          {
            name: "colorScheme",
            type: "string",
            default: `"gray"`,
            description: "Palette.",
          },
          { name: "isDisabled", type: "boolean", description: "Disable the whole group." },
          {
            name: "isInvalid",
            type: "boolean",
            description: "Invalid state. Auto-synced from FormControl.",
          },
        ]}
      />
      <H2>Props — Radio</H2>
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
    </DocsPage>
  );
}
