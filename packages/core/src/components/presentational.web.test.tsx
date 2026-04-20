import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";
import { SuperStylingProvider } from "../SuperStylingProvider";
import { Badge, Divider, Spinner } from "./index";
import type { ReactNode } from "react";

function wrap(children: ReactNode) {
  return render(<SuperStylingProvider>{children}</SuperStylingProvider>);
}

describe("Divider", () => {
  test("renders by default (horizontal)", () => {
    const { container } = wrap(<Divider />);
    expect(container.firstElementChild).not.toBeNull();
  });

  test("renders with orientation='vertical' without crashing", () => {
    // Tamagui's Separator may or may not surface `aria-orientation` at the DOM
    // level depending on the underlying element; we verify render success and
    // leave orientation-specific a11y assertions for screen-reader E2E.
    const { container } = wrap(<Divider orientation="vertical" />);
    expect(container.firstElementChild).not.toBeNull();
  });
});

describe("Spinner", () => {
  test("renders without crashing inside provider", () => {
    const { container } = wrap(<Spinner />);
    expect(container.firstElementChild).not.toBeNull();
  });
});

describe("Badge", () => {
  test("renders children text (uppercase)", () => {
    const { getByText } = wrap(<Badge>new</Badge>);
    // Badge applies textTransform: uppercase via CSS, but DOM content is raw.
    expect(getByText("new")).toBeDefined();
  });

  test("renders with each variant without crashing", () => {
    for (const variant of ["solid", "subtle", "outline"] as const) {
      const { container } = wrap(<Badge variant={variant}>{variant}</Badge>);
      expect(container.firstElementChild).not.toBeNull();
    }
  });

  test("renders with each size without crashing", () => {
    for (const size of ["sm", "md", "lg"] as const) {
      const { container } = wrap(<Badge size={size}>badge</Badge>);
      expect(container.firstElementChild).not.toBeNull();
    }
  });

  test("renders with custom colorScheme", () => {
    const { container } = wrap(<Badge colorScheme="blue">link</Badge>);
    expect(container.firstElementChild).not.toBeNull();
  });
});
