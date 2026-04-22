/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-function-as-prop, react-perf/jsx-no-new-array-as-prop -- docs page, not a hot path */
import { useState } from "react";
import { Select } from "@superstyling/core";
import { DocsPage } from "~/components/DocsPage";
import { ComponentDemo } from "~/components/ComponentDemo";
import { DocsCodeBlock } from "~/components/DocsCodeBlock";
import { PropsTable } from "~/components/PropsTable";
import { StatusRow } from "~/components/StatusRow";
import { mdxComponents } from "~/components/MDXComponents";

const H1 = mdxComponents.h1;
const H2 = mdxComponents.h2;
const P = mdxComponents.p;

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

export default function SelectPage() {
  return (
    <DocsPage currentPath="/components/select">
      <H1>Select</H1>
      <StatusRow tier="1" platforms="Cross-platform" since="v0.1.0" />
      <P>
        Exclusive choice from a known list. Uses Tamagui's Adapt+Sheet pattern: a traditional
        dropdown on wider viewports, a bottom-sheet picker on phones. Select.Option is the item
        wrapper.
      </P>
      <H2>Import</H2>
      <DocsCodeBlock language="tsx">{`import { Select } from "@superstyling/core";`}</DocsCodeBlock>
      <H2>Basic usage</H2>
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
      <H2>Sizes</H2>
      <ComponentDemo
        code={`<Select size="sm" placeholder="Small">…</Select>
<Select size="md" placeholder="Medium">…</Select>
<Select size="lg" placeholder="Large">…</Select>`}
        preview={<SizeSelectDemo />}
      />
      <H2>Props — Select (root)</H2>
      <PropsTable
        props={[
          { name: "value", type: "string", description: "Controlled value." },
          {
            name: "defaultValue",
            type: "string",
            description: "Uncontrolled initial value.",
          },
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
      <H2>Props — Select.Option</H2>
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
    </DocsPage>
  );
}
