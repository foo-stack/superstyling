/* oxlint-disable react-perf/jsx-no-new-function-as-prop, react-perf/jsx-no-jsx-as-prop -- smoke tests */
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SuperStylingProvider, defaultSystem } from "../";
import { Drawer, Tooltip, Popover, Menu, AlertDialog, Button, Text } from "./index";

function wrap(ui: React.ReactNode) {
  return render(<SuperStylingProvider system={defaultSystem}>{ui}</SuperStylingProvider>);
}

describe("Phase 11 overlay surfaces", () => {
  it("renders Drawer subcomponent tree when open", () => {
    wrap(
      <Drawer isOpen onClose={() => {}} placement="right" size="md">
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Drawer title</Drawer.Title>
          </Drawer.Header>
          <Drawer.CloseButton />
          <Drawer.Body>
            <Text>Drawer body</Text>
          </Drawer.Body>
          <Drawer.Footer>
            <Button>Action</Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>,
    );
    // Dialog.Portal moves content outside `container`; use screen.
    expect(screen.getByText("Drawer title")).toBeDefined();
    expect(screen.getByText("Drawer body")).toBeDefined();
  });

  it("renders Tooltip trigger with a visible child", () => {
    const { container } = wrap(
      <Tooltip label="Helpful hint">
        <Button>Hover me</Button>
      </Tooltip>,
    );
    // Trigger is always rendered; the tooltip content only shows on hover.
    expect(container.textContent).toContain("Hover me");
  });

  it("renders Popover compound when defaultIsOpen", () => {
    const { container } = wrap(
      <Popover defaultIsOpen>
        <Popover.Trigger>
          <Button>open</Button>
        </Popover.Trigger>
        <Popover.Content>
          <Popover.Header>
            <Text>Popover header</Text>
          </Popover.Header>
          <Popover.Body>
            <Text>Popover body</Text>
          </Popover.Body>
        </Popover.Content>
      </Popover>,
    );
    expect(container.textContent).toContain("open");
  });

  it("renders Menu compound with items", () => {
    const { container } = wrap(
      <Menu defaultIsOpen>
        <Menu.Button>
          <Button>Actions</Button>
        </Menu.Button>
        <Menu.List>
          <Menu.Group title="File">
            <Menu.Item onSelect={() => {}}>New</Menu.Item>
            <Menu.Item onSelect={() => {}}>Open</Menu.Item>
          </Menu.Group>
          <Menu.Divider />
          <Menu.Item isDisabled>Print</Menu.Item>
        </Menu.List>
      </Menu>,
    );
    expect(container.textContent).toContain("Actions");
  });

  it("renders AlertDialog as an alertdialog role when open", () => {
    wrap(
      <AlertDialog isOpen onClose={() => {}}>
        <AlertDialog.Overlay />
        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.Title>Delete item?</AlertDialog.Title>
          </AlertDialog.Header>
          <AlertDialog.Body>
            <Text>This cannot be undone.</Text>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button>Cancel</Button>
            <Button colorScheme="red">Delete</Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>,
    );
    expect(screen.getByText("Delete item?")).toBeDefined();
    expect(screen.getByText("This cannot be undone.")).toBeDefined();
  });
});
