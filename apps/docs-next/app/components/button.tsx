import { Button, HStack, VStack } from "@superstyling/core";
import { DocsPage } from "~/components/DocsPage";
import { ComponentDemo } from "~/components/ComponentDemo";
import { PropsTable } from "~/components/PropsTable";
import { DocsCodeBlock } from "~/components/DocsCodeBlock";
import { mdxComponents } from "~/components/MDXComponents";

const H1 = mdxComponents.h1;
const H2 = mdxComponents.h2;
const P = mdxComponents.p;

const propsRows = [
  {
    name: "variant",
    type: `"solid" | "outline" | "ghost" | "link"`,
    default: `"solid"`,
    description: "Visual variant.",
  },
  {
    name: "size",
    type: `"xs" | "sm" | "md" | "lg"`,
    default: `"md"`,
    description: "Size token.",
  },
  {
    name: "colorScheme",
    type: `"gray" | "red" | "orange" | "yellow" | "green" | "teal" | "blue" | "cyan" | "purple" | "pink"`,
    default: `"gray"`,
    description: "Palette scale applied to the variant.",
  },
  {
    name: "leftIcon",
    type: "ReactNode",
    description: "Optional icon rendered before the label.",
  },
  {
    name: "rightIcon",
    type: "ReactNode",
    description: "Optional icon rendered after the label.",
  },
  {
    name: "isLoading",
    type: "boolean",
    default: "false",
    description: "When true, shows a spinner and disables interaction.",
  },
  {
    name: "loadingText",
    type: "string",
    description: "Optional label replacing children while loading.",
  },
  {
    name: "isDisabled",
    type: "boolean",
    default: "false",
    description: "Disables the button.",
  },
  {
    name: "isActive",
    type: "boolean",
    default: "false",
    description: "Force the active visual state.",
  },
  {
    name: "onPress",
    type: "(e: GestureResponderEvent) => void",
    description: "Press handler. Cross-platform — maps to onClick on web.",
  },
];

export default function ButtonPage() {
  return (
    <DocsPage currentPath="/components/button">
      <H1>Button</H1>

      <P>
        Primary interactive primitive. Four variants × four sizes × full colorScheme palette, with
        slots for left/right icons and a built-in loading state.
      </P>

      <H2>Import</H2>

      <DocsCodeBlock language="ts">{`import { Button } from "@superstyling/core";`}</DocsCodeBlock>

      <H2>Variants</H2>

      <ComponentDemo
        code={`<Button variant="solid" colorScheme="blue">Solid</Button>
<Button variant="outline" colorScheme="blue">Outline</Button>
<Button variant="ghost" colorScheme="blue">Ghost</Button>
<Button variant="link" colorScheme="blue">Link</Button>`}
        preview={
          <HStack gap="$2" flexWrap="wrap" alignItems="center">
            <Button variant="solid" colorScheme="blue">
              Solid
            </Button>
            <Button variant="outline" colorScheme="blue">
              Outline
            </Button>
            <Button variant="ghost" colorScheme="blue">
              Ghost
            </Button>
            <Button variant="link" colorScheme="blue">
              Link
            </Button>
          </HStack>
        }
      />

      <H2>Sizes</H2>

      <ComponentDemo
        code={`<Button size="xs">xs</Button>
<Button size="sm">sm</Button>
<Button size="md">md</Button>
<Button size="lg">lg</Button>`}
        preview={
          <HStack gap="$2" flexWrap="wrap" alignItems="center">
            <Button size="xs">xs</Button>
            <Button size="sm">sm</Button>
            <Button size="md">md</Button>
            <Button size="lg">lg</Button>
          </HStack>
        }
      />

      <H2>Loading</H2>

      <ComponentDemo
        code={`<Button isLoading loadingText="Saving">Save</Button>`}
        preview={
          <VStack alignItems="flex-start">
            <Button isLoading loadingText="Saving">
              Save
            </Button>
          </VStack>
        }
      />

      <H2>Props</H2>

      <PropsTable props={propsRows} />
    </DocsPage>
  );
}
