/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-new-array-as-prop, react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-function-as-prop -- docs page */
import { useState } from "react";
import { Select, Text } from "@superstyling/core";
import { ComponentDemo } from "../../src/docs/ComponentDemo";
import { DocsPage, PropsTable, Section } from "../../src/docs/DocsLayout";

export default function SelectPage() {
  return (
    <DocsPage
      title="Select"
      description="Exclusive choice from a known list. Uses Tamagui's Adapt+Sheet pattern: a traditional dropdown on wider viewports, a bottom-sheet picker on phones. Select.Option is the item wrapper."
    >
      <Section title="Import">
        <ComponentDemo
          code={`import { Select } from "@superstyling/core";`}
          preview={<Text fontFamily="$mono">import {"{ Select }"} from "@superstyling/core";</Text>}
          defaultOpen
        />
      </Section>

      <Section title="Basic usage">
        <ComponentDemo
          code={`function Example() {
  const [role, setRole] = useState("");
  return (
    <Select value={role} onChange={setRole} placeholder="Choose role">
      <Select.Option value="eng" index={0}>Engineer</Select.Option>
      <Select.Option value="design" index={1}>Designer</Select.Option>
      <Select.Option value="pm" index={2}>Product manager</Select.Option>
    </Select>
  );
}`}
          preview={<BasicSelectDemo />}
        />
      </Section>

      <Section title="Sizes">
        <ComponentDemo
          code={`<Select size="sm" placeholder="Small">…</Select>
<Select size="md" placeholder="Medium">…</Select>
<Select size="lg" placeholder="Large">…</Select>`}
          preview={<SizeSelectDemo />}
        />
      </Section>

      <Section title="Props — Select (root)">
        <PropsTable
          props={[
            { name: "value", type: "string", description: "Controlled value." },
            { name: "defaultValue", type: "string", description: "Uncontrolled initial value." },
            {
              name: "onChange",
              type: "(value: string) => void",
              description: "Fires when selection changes.",
            },
            {
              name: "placeholder",
              type: "string",
              description: "Text shown when no value is selected.",
            },
            {
              name: "size",
              type: `"sm" | "md" | "lg"`,
              default: `"md"`,
              description: "Trigger height + font.",
            },
            {
              name: "colorScheme",
              type: "string",
              default: `"gray"`,
              description: "Palette applied to the trigger + selected-item indicator.",
            },
            {
              name: "isInvalid",
              type: "boolean",
              description: "Visual invalid state. Auto-synced from FormControl.",
            },
            { name: "isDisabled", type: "boolean", description: "Disable + dim." },
          ]}
        />
      </Section>

      <Section title="Props — Select.Option">
        <PropsTable
          props={[
            {
              name: "value",
              type: "string",
              required: true,
              description: "Value this item represents.",
            },
            {
              name: "index",
              type: "number",
              description:
                "Positional index required by Tamagui's Select internals. Use the array position.",
            },
            { name: "isDisabled", type: "boolean", description: "Disable this specific item." },
          ]}
        />
      </Section>
    </DocsPage>
  );
}

function BasicSelectDemo() {
  const [role, setRole] = useState("");
  return (
    <Select value={role} onChange={setRole} placeholder="Choose role">
      <Select.Option value="eng" index={0}>
        Engineer
      </Select.Option>
      <Select.Option value="design" index={1}>
        Designer
      </Select.Option>
      <Select.Option value="pm" index={2}>
        Product manager
      </Select.Option>
    </Select>
  );
}

function SizeSelectDemo() {
  return (
    <>
      {(["sm", "md", "lg"] as const).map((s) => (
        <Select key={s} size={s} placeholder={`Size=${s}`}>
          <Select.Option value="a" index={0}>
            Option A
          </Select.Option>
          <Select.Option value="b" index={1}>
            Option B
          </Select.Option>
        </Select>
      ))}
    </>
  );
}
