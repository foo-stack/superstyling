/* oxlint-disable react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-array-as-prop -- smoke tests */
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SuperStylingProvider, defaultSystem } from "../";
import {
  Flex,
  Center,
  Container,
  Spacer,
  AspectRatio,
  Grid,
  GridItem,
  SimpleGrid,
  Wrap,
  WrapItem,
  Code,
  Kbd,
  Tag,
  Image,
  List,
  OrderedList,
  UnorderedList,
  ListItem,
  ListIcon,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  InputLeftAddon,
  InputRightAddon,
  ButtonGroup,
  CheckboxGroup,
  CloseButton,
  Button,
  Checkbox,
  Input,
  Box,
} from "./index";

function wrap(ui: React.ReactNode) {
  return render(<SuperStylingProvider system={defaultSystem}>{ui}</SuperStylingProvider>);
}

describe("Phase 10 layout primitives", () => {
  it("renders Flex / Center / Container / Spacer", () => {
    const { container } = wrap(
      <Flex direction="row" justify="center" align="center" wrap="wrap">
        <Container>content</Container>
        <Spacer />
        <Center>centered</Center>
      </Flex>,
    );
    expect(container.textContent).toContain("content");
    expect(container.textContent).toContain("centered");
  });

  it("renders AspectRatio with a single child", () => {
    const { container } = wrap(
      <AspectRatio ratio={16 / 9}>
        <Box>visual</Box>
      </AspectRatio>,
    );
    expect(container.textContent).toContain("visual");
  });

  it("renders Grid / GridItem / SimpleGrid", () => {
    const { container } = wrap(
      <>
        <Grid templateColumns="repeat(3, 1fr)" gap="$2">
          <GridItem colSpan={2}>a</GridItem>
          <GridItem>b</GridItem>
        </Grid>
        <SimpleGrid columns={3} spacing="$2">
          <Box>x</Box>
          <Box>y</Box>
          <Box>z</Box>
        </SimpleGrid>
      </>,
    );
    expect(container.textContent).toContain("a");
    expect(container.textContent).toContain("z");
  });

  it("renders Wrap + WrapItem with spacing", () => {
    const { container } = wrap(
      <Wrap spacing="$2" justify="center">
        <WrapItem>item 1</WrapItem>
        <WrapItem>item 2</WrapItem>
      </Wrap>,
    );
    expect(container.textContent).toContain("item 1");
    expect(container.textContent).toContain("item 2");
  });

  it("renders Code + Kbd as inline monospace", () => {
    const { container } = wrap(
      <>
        <Code>yarn add</Code>
        <Kbd>⌘</Kbd>
      </>,
    );
    expect(container.textContent).toContain("yarn add");
    expect(container.textContent).toContain("⌘");
  });

  it("renders Tag with subcomponents", () => {
    const { container } = wrap(
      <Tag variant="subtle" size="md">
        <Tag.Label>beta</Tag.Label>
        <Tag.CloseButton aria-label="remove beta" />
      </Tag>,
    );
    expect(container.textContent).toContain("beta");
    expect(container.querySelector('[aria-label="remove beta"]')).not.toBeNull();
  });

  it("renders Image with a fallback node when no src", () => {
    const { container } = wrap(<Image alt="test" fallback={<Box>fallback</Box>} />);
    expect(container.textContent).toContain("fallback");
  });

  it("renders List family", () => {
    const { container } = wrap(
      <>
        <List>
          <ListItem>a</ListItem>
        </List>
        <OrderedList>
          <ListItem>b</ListItem>
        </OrderedList>
        <UnorderedList>
          <ListItem>
            <ListIcon>•</ListIcon>c
          </ListItem>
        </UnorderedList>
      </>,
    );
    expect(container.textContent).toContain("a");
    expect(container.textContent).toContain("b");
    expect(container.textContent).toContain("c");
  });

  it("renders InputGroup with left/right elements + addons", () => {
    const { container } = wrap(
      <InputGroup size="md">
        <InputLeftAddon>https://</InputLeftAddon>
        <Input placeholder="site" />
        <InputRightAddon>.io</InputRightAddon>
      </InputGroup>,
    );
    expect(container.textContent).toContain("https://");
    expect(container.textContent).toContain(".io");
  });

  it("renders InputLeftElement + InputRightElement overlays", () => {
    const { container } = wrap(
      <InputGroup size="md">
        <InputLeftElement>
          <Box>L</Box>
        </InputLeftElement>
        <Input placeholder="mid" />
        <InputRightElement>
          <Box>R</Box>
        </InputRightElement>
      </InputGroup>,
    );
    expect(container.textContent).toContain("L");
    expect(container.textContent).toContain("R");
  });

  it("renders ButtonGroup + injects size/variant to children", () => {
    const { container } = wrap(
      <ButtonGroup size="sm" variant="outline" spacing="$2">
        <Button>one</Button>
        <Button>two</Button>
      </ButtonGroup>,
    );
    expect(container.textContent).toContain("one");
    expect(container.textContent).toContain("two");
  });

  it("renders CheckboxGroup with shared state", () => {
    const { container } = wrap(
      <CheckboxGroup defaultValue={["a"]} onChange={() => {}}>
        <Checkbox value="a">A</Checkbox>
        <Checkbox value="b">B</Checkbox>
      </CheckboxGroup>,
    );
    expect(container.textContent).toContain("A");
    expect(container.textContent).toContain("B");
  });

  it("renders CloseButton with aria-label", () => {
    const { container } = wrap(<CloseButton aria-label="dismiss" />);
    expect(container.querySelector('[aria-label="dismiss"]')).not.toBeNull();
  });
});
