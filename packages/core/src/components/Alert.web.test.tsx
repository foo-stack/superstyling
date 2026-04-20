import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";
import { SuperStylingProvider } from "../SuperStylingProvider";
import { Alert } from "./index";
import type { ReactNode } from "react";

function wrap(children: ReactNode) {
  return render(<SuperStylingProvider>{children}</SuperStylingProvider>);
}

describe("Alert", () => {
  test("renders title + description with role=alert", () => {
    const { container, getByText } = wrap(
      <Alert status="info">
        <Alert.Icon />
        <Alert.Content>
          <Alert.Title>Heads up</Alert.Title>
          <Alert.Description>Something happened.</Alert.Description>
        </Alert.Content>
      </Alert>,
    );
    expect(getByText("Heads up")).toBeDefined();
    expect(getByText("Something happened.")).toBeDefined();
    // role="alert" lives on the Alert root element.
    expect(container.querySelector('[role="alert"]')).not.toBeNull();
  });

  test("renders each status without crashing", () => {
    for (const status of ["info", "success", "warning", "error", "loading"] as const) {
      const { container } = wrap(
        <Alert status={status}>
          <Alert.Icon />
          <Alert.Title>{status}</Alert.Title>
        </Alert>,
      );
      expect(container.firstElementChild).not.toBeNull();
    }
  });

  test("renders each variant without crashing", () => {
    for (const variant of ["subtle", "solid", "left-accent", "top-accent"] as const) {
      const { container } = wrap(
        <Alert variant={variant}>
          <Alert.Title>{variant}</Alert.Title>
        </Alert>,
      );
      expect(container.firstElementChild).not.toBeNull();
    }
  });

  test("Alert.Icon renders a user-provided icon instead of the default", () => {
    const { getByTestId, queryByTestId } = wrap(
      <Alert status="info">
        <Alert.Icon>
          <span data-testid="custom-icon" />
        </Alert.Icon>
        <Alert.Title>Custom</Alert.Title>
      </Alert>,
    );
    expect(getByTestId("custom-icon")).toBeDefined();
    // The default SVG icon should not render when a custom child is provided.
    expect(queryByTestId("default-info-icon")).toBeNull();
  });

  test("subcomponents throw outside of Alert", () => {
    expect(() =>
      render(
        <SuperStylingProvider>
          <Alert.Title>Orphan</Alert.Title>
        </SuperStylingProvider>,
      ),
    ).toThrow(/must be rendered inside <Alert>/);
  });
});
