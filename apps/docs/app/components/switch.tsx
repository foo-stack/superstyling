/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-new-array-as-prop, react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-function-as-prop -- docs page */
import { useState } from "react";
import { HStack, Switch, Text, VStack } from "@superstyling/core";
import { ComponentDemo } from "../../src/docs/ComponentDemo";
import { DocsPage, PropsTable, Section } from "../../src/docs/DocsLayout";

export default function SwitchPage() {
  return (
    <DocsPage
      title="Switch"
      description="Boolean toggle rendered as a sliding thumb. Three sizes, full colorScheme palette, label slot, FormControl-aware."
    >
      <Section title="Import">
        <ComponentDemo
          code={`import { Switch } from "@superstyling/core";`}
          preview={<Text fontFamily="$mono">import {"{ Switch }"} from "@superstyling/core";</Text>}
          defaultOpen
        />
      </Section>

      <Section title="Basic usage">
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
      </Section>

      <Section title="Sizes">
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
      </Section>

      <Section title="Disabled">
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
      </Section>

      <Section title="Props">
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
              name: "children",
              type: "ReactNode",
              description: "Label text rendered beside the switch.",
            },
          ]}
        />
      </Section>
    </DocsPage>
  );
}

function BasicSwitchDemo() {
  const [on, setOn] = useState(true);
  return (
    <Switch isChecked={on} onChange={setOn} colorScheme="green">
      Email notifications
    </Switch>
  );
}
