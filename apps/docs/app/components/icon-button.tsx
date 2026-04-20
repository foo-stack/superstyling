/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-new-array-as-prop, react-perf/jsx-no-jsx-as-prop -- docs page */
import { HStack, IconButton, Text } from "@superstyling/core";
import { ChevronDownIcon, PlusIcon, SearchIcon } from "@superstyling/icons";
import { ComponentDemo } from "../../src/docs/ComponentDemo";
import { DocsPage, PropsTable, Section } from "../../src/docs/DocsLayout";

export default function IconButtonPage() {
  return (
    <DocsPage
      title="IconButton"
      description="Square button that renders a single icon. Shares variants and colorScheme with Button but requires aria-label so assistive tech can name it."
    >
      <Section title="Import">
        <ComponentDemo
          code={`import { IconButton } from "@superstyling/core";`}
          preview={
            <Text fontFamily="$mono">import {"{ IconButton }"} from "@superstyling/core";</Text>
          }
          defaultOpen
        />
      </Section>

      <Section title="Variants">
        <ComponentDemo
          code={`<IconButton aria-label="Search" icon={<SearchIcon />} variant="outline" />
<IconButton aria-label="Add" icon={<PlusIcon />} colorScheme="blue" />
<IconButton aria-label="More" icon={<ChevronDownIcon />} variant="ghost" />`}
          preview={
            <HStack gap="$2" alignItems="center">
              <IconButton aria-label="Search" icon={<SearchIcon />} variant="outline" />
              <IconButton aria-label="Add" icon={<PlusIcon />} colorScheme="blue" />
              <IconButton aria-label="More" icon={<ChevronDownIcon />} variant="ghost" />
            </HStack>
          }
        />
      </Section>

      <Section title="Props">
        <PropsTable
          props={[
            {
              name: "aria-label",
              type: "string",
              required: true,
              description:
                "Accessible name. Screen readers announce this; required because the button has no visible text.",
            },
            {
              name: "icon",
              type: "ReactElement",
              required: true,
              description: "Icon element (from @superstyling/icons or your own SVG component).",
            },
            {
              name: "variant",
              type: `"solid" | "outline" | "ghost" | "link"`,
              default: `"solid"`,
              description: "Shared with Button.",
            },
            {
              name: "size",
              type: `"xs" | "sm" | "md" | "lg"`,
              default: `"md"`,
              description: "Square dimensions track the button size.",
            },
            { name: "colorScheme", type: "string", default: `"gray"`, description: "Palette." },
            {
              name: "isDisabled",
              type: "boolean",
              default: "false",
              description: "Disable interaction + a11y.",
            },
            { name: "onPress", type: "() => void", description: "Press handler." },
          ]}
        />
      </Section>
    </DocsPage>
  );
}
