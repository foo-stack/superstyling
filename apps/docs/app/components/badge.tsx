/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-new-array-as-prop, react-perf/jsx-no-jsx-as-prop -- docs page */
import { Badge, HStack, Text, VStack } from "@superstyling/core";
import { ComponentDemo } from "../../src/docs/ComponentDemo";
import { DocsPage, PropsTable, Section } from "../../src/docs/DocsLayout";

const COLOR_SCHEMES = ["gray", "blue", "red", "green", "purple"] as const;
const VARIANTS = ["solid", "subtle", "outline"] as const;

export default function BadgePage() {
  return (
    <DocsPage
      title="Badge"
      description="Compact status or count indicator. Supports three visual variants and the full colorScheme palette."
    >
      <Section title="Import">
        <ComponentDemo
          code={`import { Badge } from "@superstyling/core";`}
          preview={<Text fontFamily="$mono">import {"{ Badge }"} from "@superstyling/core";</Text>}
          defaultOpen
        />
      </Section>

      <Section title="Variants × colorScheme">
        <ComponentDemo
          code={`{VARIANTS.map((variant) => (
  <HStack key={variant} gap="$2">
    {COLOR_SCHEMES.map((cs) => (
      <Badge key={cs} variant={variant} colorScheme={cs}>{cs}</Badge>
    ))}
  </HStack>
))}`}
          preview={
            <VStack gap="$3">
              {VARIANTS.map((variant) => (
                <HStack key={variant} gap="$2" alignItems="center">
                  <Text width={70} fontSize="$2" fontWeight="600">
                    {variant}
                  </Text>
                  {COLOR_SCHEMES.map((cs) => (
                    <Badge key={cs} variant={variant} colorScheme={cs}>
                      {cs}
                    </Badge>
                  ))}
                </HStack>
              ))}
            </VStack>
          }
        />
      </Section>

      <Section title="Sizes">
        <ComponentDemo
          code={`<HStack gap="$2" alignItems="center">
  <Badge size="sm">Small</Badge>
  <Badge size="md">Medium</Badge>
  <Badge size="lg">Large</Badge>
</HStack>`}
          preview={
            <HStack gap="$2" alignItems="center">
              <Badge size="sm">Small</Badge>
              <Badge size="md">Medium</Badge>
              <Badge size="lg">Large</Badge>
            </HStack>
          }
        />
      </Section>

      <Section title="Props">
        <PropsTable
          props={[
            {
              name: "variant",
              type: `"solid" | "subtle" | "outline"`,
              default: `"subtle"`,
              description: "Visual treatment.",
            },
            {
              name: "colorScheme",
              type: "string",
              default: `"gray"`,
              description: "Which palette to use. Must be a key on your theme's colorScheme set.",
            },
            {
              name: "size",
              type: `"sm" | "md" | "lg"`,
              default: `"md"`,
              description: "Overall size (padding + font).",
            },
          ]}
        />
      </Section>
    </DocsPage>
  );
}
