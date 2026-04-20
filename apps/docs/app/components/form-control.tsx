/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-new-array-as-prop, react-perf/jsx-no-jsx-as-prop -- docs page */
import { FormControl, Input, Text, VStack } from "@superstyling/core";
import { ComponentDemo } from "../../src/docs/ComponentDemo";
import { DocsPage, PropsTable, Section } from "../../src/docs/DocsLayout";

export default function FormControlPage() {
  return (
    <DocsPage
      title="FormControl"
      description="Context wrapper that coordinates a label, input, helper text, and error message. Children automatically pick up aria-invalid, aria-required, aria-describedby, and a shared id via the useFormControlProps hook."
    >
      <Section title="Import">
        <ComponentDemo
          code={`import { FormControl } from "@superstyling/core";`}
          preview={
            <Text fontFamily="$mono">import {"{ FormControl }"} from "@superstyling/core";</Text>
          }
          defaultOpen
        />
      </Section>

      <Section title="Basic usage">
        <ComponentDemo
          code={`<FormControl isRequired>
  <FormControl.Label>Email</FormControl.Label>
  <Input placeholder="you@example.com" />
  <FormControl.HelperText>We'll never share your email.</FormControl.HelperText>
</FormControl>`}
          preview={
            <FormControl isRequired>
              <FormControl.Label>Email</FormControl.Label>
              <Input placeholder="you@example.com" />
              <FormControl.HelperText>We'll never share your email.</FormControl.HelperText>
            </FormControl>
          }
        />
      </Section>

      <Section title="Invalid state">
        <ComponentDemo
          code={`<FormControl isInvalid>
  <FormControl.Label>Email</FormControl.Label>
  <Input value="not-an-email" />
  <FormControl.HelperText>We'll never share your email.</FormControl.HelperText>
  <FormControl.ErrorMessage>Must contain @.</FormControl.ErrorMessage>
</FormControl>`}
          preview={
            <FormControl isInvalid>
              <FormControl.Label>Email</FormControl.Label>
              <Input value="not-an-email" />
              <FormControl.HelperText>We'll never share your email.</FormControl.HelperText>
              <FormControl.ErrorMessage>Must contain @.</FormControl.ErrorMessage>
            </FormControl>
          }
        />
      </Section>

      <Section title="Disabled / read-only">
        <ComponentDemo
          code={`<FormControl isDisabled>
  <FormControl.Label>Disabled field</FormControl.Label>
  <Input value="Can't edit this" />
</FormControl>`}
          preview={
            <VStack gap="$3">
              <FormControl isDisabled>
                <FormControl.Label>Disabled field</FormControl.Label>
                <Input value="Can't edit this" />
              </FormControl>
              <FormControl isReadOnly>
                <FormControl.Label>Read-only field</FormControl.Label>
                <Input value="Selectable, not editable" />
              </FormControl>
            </VStack>
          }
        />
      </Section>

      <Section title="Props — FormControl (root)">
        <PropsTable
          props={[
            {
              name: "isInvalid",
              type: "boolean",
              default: "false",
              description:
                "Marks the field invalid. Children receive aria-invalid and ErrorMessage becomes visible.",
            },
            {
              name: "isRequired",
              type: "boolean",
              default: "false",
              description: "Shows a red asterisk in the label and sets aria-required on the input.",
            },
            {
              name: "isDisabled",
              type: "boolean",
              default: "false",
              description: "Disables the wrapped input + styles children dim.",
            },
            {
              name: "isReadOnly",
              type: "boolean",
              default: "false",
              description: "Sets aria-readonly + readOnly on the input.",
            },
            {
              name: "id",
              type: "string",
              description:
                "Custom id. Defaults to a React-generated useId value; children auto-link to this.",
            },
          ]}
        />
      </Section>

      <Section title="Sub-components">
        <PropsTable
          props={[
            {
              name: "FormControl.Label",
              type: "{ children }",
              description: "Renders a styled label wired to the input via aria-labelledby.",
            },
            {
              name: "FormControl.HelperText",
              type: "{ children }",
              description:
                "Muted helper text. Hidden when isInvalid + ErrorMessage are both present (matches Chakra).",
            },
            {
              name: "FormControl.ErrorMessage",
              type: "{ children }",
              description: "Red, live-region text. Rendered only when isInvalid is true.",
            },
          ]}
        />
      </Section>
    </DocsPage>
  );
}
