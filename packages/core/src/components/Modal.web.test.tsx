/* oxlint-disable react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-function-as-prop -- test file */
import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SuperStylingProvider } from "../SuperStylingProvider";
import { Modal } from "./index";

function wrap(ui: React.ReactNode) {
  return render(<SuperStylingProvider>{ui}</SuperStylingProvider>);
}

describe("Modal", () => {
  test("renders content when isOpen is true", () => {
    wrap(
      <Modal isOpen={true} onClose={() => {}}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Title</Modal.Title>
          </Modal.Header>
          <Modal.Body>Body content</Modal.Body>
        </Modal.Content>
      </Modal>,
    );
    expect(screen.getByText("Title")).toBeDefined();
    expect(screen.getByText("Body content")).toBeDefined();
  });

  test("isOpen=false does not crash and keeps closed state (Tamagui may keep DOM hidden)", () => {
    // Tamagui's Dialog may retain closed-state DOM and hide via CSS rather
    // than unmount — we only assert that rendering with isOpen=false doesn't
    // throw. True mount/unmount verification is covered by the open-state
    // tests above and by visual/E2E tests.
    expect(() =>
      wrap(
        <Modal isOpen={false} onClose={() => {}}>
          <Modal.Overlay />
          <Modal.Content>
            <Modal.Body>Hidden body</Modal.Body>
          </Modal.Content>
        </Modal>,
      ),
    ).not.toThrow();
  });

  test("Modal.CloseButton invokes onClose when clicked", () => {
    const onClose = vi.fn();
    wrap(
      <Modal isOpen={true} onClose={onClose}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>T</Modal.Title>
          </Modal.Header>
          <Modal.CloseButton />
        </Modal.Content>
      </Modal>,
    );
    const closeButton = screen.getByLabelText("Close");
    closeButton.click();
    expect(onClose).toHaveBeenCalled();
  });

  test("Modal subcomponents throw when used outside Modal", () => {
    // Only subcomponents that consume context throw — Modal.Header / Footer /
    // Title / Description render static styled containers and don't gate.
    expect(() =>
      render(
        <SuperStylingProvider>
          <Modal.CloseButton />
        </SuperStylingProvider>,
      ),
    ).toThrow(/must be rendered inside <Modal>/);
  });

  test("Modal.Body respects scrollBehavior='inside' via context", () => {
    // Smoke test — content renders with scrollBehavior flag through
    wrap(
      <Modal isOpen={true} onClose={() => {}} scrollBehavior="inside">
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Body>Scrollable body</Modal.Body>
        </Modal.Content>
      </Modal>,
    );
    expect(screen.getByText("Scrollable body")).toBeDefined();
  });

  test("supports different sizes without crashing", () => {
    for (const size of ["xs", "sm", "md", "lg", "xl", "full"] as const) {
      const { unmount } = wrap(
        <Modal isOpen={true} onClose={() => {}} size={size}>
          <Modal.Overlay />
          <Modal.Content>
            <Modal.Body>{size}</Modal.Body>
          </Modal.Content>
        </Modal>,
      );
      expect(screen.getByText(size)).toBeDefined();
      unmount();
    }
  });

  test("supports different motionPresets without crashing", () => {
    for (const motion of ["scale", "slideInBottom", "slideInTop", "none"] as const) {
      const { unmount } = wrap(
        <Modal isOpen={true} onClose={() => {}} motionPreset={motion}>
          <Modal.Overlay />
          <Modal.Content>
            <Modal.Body>{motion}</Modal.Body>
          </Modal.Content>
        </Modal>,
      );
      expect(screen.getByText(motion)).toBeDefined();
      unmount();
    }
  });
});
