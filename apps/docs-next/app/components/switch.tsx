/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-function-as-prop, react-perf/jsx-no-new-array-as-prop -- docs page, not a hot path */
import { useState } from "react";
import { HStack, Switch, VStack } from "@superstyling/core";
import { DocsPage } from "~/components/DocsPage";
import { ComponentDemo } from "~/components/ComponentDemo";
import { DocsCodeBlock } from "~/components/DocsCodeBlock";
import { PropsTable } from "~/components/PropsTable";
import { StatusRow } from "~/components/StatusRow";
import { mdxComponents } from "~/components/MDXComponents";

const H1 = mdxComponents.h1;
const H2 = mdxComponents.h2;
const P = mdxComponents.p;

function BasicSwitchDemo() {
  const [on, setOn] = useState(true);
  return (
    <Switch isChecked={on} onChange={setOn} colorScheme="green">
      Email notifications
    </Switch>
  );
}

export default function SwitchPage() {
  return (
    <DocsPage currentPath="/components/switch">
      <H1>Switch</H1>
      <StatusRow tier="1" platforms="Cross-platform" since="v0.1.0" />
      <P>
        Boolean toggle rendered as a sliding thumb. Three sizes, full colorScheme palette, label
        slot, FormControl-aware.
      </P>
      <H2>Import</H2>
      <DocsCodeBlock language="tsx">{`import { Switch } from "@superstyling/core";`}</DocsCodeBlock>
      <H2>Basic usage</H2>
      <ComponentDemo
        code={`function Example() {
  const [on, setOn] = useState(true);
  return (
    <Switch isChecked={on} onChange={setOn} colorScheme="green">
      Email notifications
    </Switch>
  );
}`}
        preview={<BasicSwitchDemo />}
      />
      <H2>Sizes</H2>
      <ComponentDemo
        code={`<Switch size="sm">Small</Switch>
<Switch size="md">Medium</Switch>
<Switch size="lg">Large</Switch>`}
        preview={
          <HStack gap="$4" alignItems="center">
            <Switch size="sm" colorScheme="blue">
              Small
            </Switch>
            <Switch size="md" colorScheme="blue">
              Medium
            </Switch>
            <Switch size="lg" colorScheme="blue">
              Large
            </Switch>
          </HStack>
        }
      />
      <H2>Disabled</H2>
      <ComponentDemo
        code={`<Switch isDisabled>Off, disabled</Switch>
<Switch isDisabled defaultIsChecked>On, disabled</Switch>`}
        preview={
          <VStack gap="$2" alignItems="flex-start">
            <Switch isDisabled colorScheme="blue">
              Off, disabled
            </Switch>
            <Switch isDisabled defaultIsChecked colorScheme="blue">
              On, disabled
            </Switch>
          </VStack>
        }
      />
      <H2>Props</H2>
      <PropsTable
        props={[
          { name: "isChecked", type: "boolean", description: "Controlled on/off state." },
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
            description: "Track + thumb size.",
          },
          {
            name: "colorScheme",
            type: "string",
            default: `"gray"`,
            description: "Palette applied when on.",
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
