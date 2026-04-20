/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-new-array-as-prop, react-perf/jsx-no-jsx-as-prop -- docs page */
import { Alert, Text, VStack } from "@superstyling/core";
import { ComponentDemo } from "../../src/docs/ComponentDemo";
import { DocsPage, PropsTable, Section } from "../../src/docs/DocsLayout";

const STATUSES = ["info", "success", "warning", "error", "loading"] as const;
const VARIANTS = ["subtle", "solid", "left-accent", "top-accent"] as const;

export default function AlertPage() {
  return (
    <DocsPage
      title="Alert"
      description="Callout for communicating status. Compound shape: Alert.Icon, Alert.Content with Alert.Title + Alert.Description inside. Five statuses × four visual variants."
    >
      <Section title="Import">
        <ComponentDemo
          code={`import { Alert } from "@superstyling/core";`}
          preview={<Text fontFamily="$mono">import {"{ Alert }"} from "@superstyling/core";</Text>}
          defaultOpen
        />
      </Section>

      <Section title="Basic usage">
        <ComponentDemo
          code={`<Alert status="success">
  <Alert.Icon />
  <Alert.Content>
    <Alert.Title>Saved</Alert.Title>
    <Alert.Description>Your changes have been persisted.</Alert.Description>
  </Alert.Content>
</Alert>`}
          preview={
            <Alert status="success">
              <Alert.Icon />
              <Alert.Content>
                <Alert.Title>Saved</Alert.Title>
                <Alert.Description>Your changes have been persisted.</Alert.Description>
              </Alert.Content>
            </Alert>
          }
        />
      </Section>

      <Section title="All statuses (subtle variant)">
        <ComponentDemo
          code={`{STATUSES.map((s) => (
  <Alert key={s} status={s}>
    <Alert.Icon />
    <Alert.Content>
      <Alert.Title>{titleCase(s)}</Alert.Title>
      <Alert.Description>A {s} alert.</Alert.Description>
    </Alert.Content>
  </Alert>
))}`}
          preview={
            <VStack gap="$2">
              {STATUSES.map((s) => (
                <Alert key={s} status={s}>
                  <Alert.Icon />
                  <Alert.Content>
                    <Alert.Title>{titleCase(s)}</Alert.Title>
                    <Alert.Description>A {s} alert.</Alert.Description>
                  </Alert.Content>
                </Alert>
              ))}
            </VStack>
          }
        />
      </Section>

      <Section title="Variants">
        <ComponentDemo
          code={`{VARIANTS.map((variant) => (
  <Alert key={variant} status="info" variant={variant}>
    <Alert.Icon />
    <Alert.Content>
      <Alert.Title>variant={variant}</Alert.Title>
    </Alert.Content>
  </Alert>
))}`}
          preview={
            <VStack gap="$2">
              {VARIANTS.map((variant) => (
                <Alert key={variant} status="info" variant={variant}>
                  <Alert.Icon />
                  <Alert.Content>
                    <Alert.Title>variant={variant}</Alert.Title>
                  </Alert.Content>
                </Alert>
              ))}
            </VStack>
          }
        />
      </Section>

      <Section title="Props">
        <PropsTable
          props={[
            {
              name: "status",
              type: `"info" | "success" | "warning" | "error" | "loading"`,
              default: `"info"`,
              description: "Semantic status — drives the icon and colour scheme.",
            },
            {
              name: "variant",
              type: `"subtle" | "solid" | "left-accent" | "top-accent"`,
              default: `"subtle"`,
              description: "Visual treatment.",
            },
          ]}
        />
      </Section>
    </DocsPage>
  );
}

function titleCase(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
