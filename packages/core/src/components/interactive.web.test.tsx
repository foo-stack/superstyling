/* oxlint-disable react-perf/jsx-no-new-function-as-prop, react-perf/jsx-no-jsx-as-prop, unicorn/consistent-function-scoping -- perf rules are noise in tests */
import { describe, expect, test } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { SuperStylingProvider } from "../SuperStylingProvider";
import { Button, IconButton, Link } from "./index";
import type { ReactNode } from "react";

function wrap(children: ReactNode) {
  return render(<SuperStylingProvider>{children}</SuperStylingProvider>);
}

describe("Button", () => {
  test("renders children and handles onPress", () => {
    let pressed = 0;
    const { getByText } = wrap(<Button onPress={() => pressed++}>Click me</Button>);
    const el = getByText("Click me");
    fireEvent.click(el);
    expect(pressed).toBe(1);
  });

  test("renders with each variant without crashing", () => {
    for (const variant of ["solid", "outline", "ghost", "link"] as const) {
      const { container } = wrap(<Button variant={variant}>{variant}</Button>);
      expect(container.firstElementChild).not.toBeNull();
    }
  });

  test("renders with each size without crashing", () => {
    for (const size of ["xs", "sm", "md", "lg"] as const) {
      const { container } = wrap(<Button size={size}>{size}</Button>);
      expect(container.firstElementChild).not.toBeNull();
    }
  });

  test("respects colorScheme prop", () => {
    const { container } = wrap(<Button colorScheme="blue">Submit</Button>);
    expect(container.firstElementChild).not.toBeNull();
  });

  test("renders loadingText when isLoading + loadingText is set", () => {
    const { getByText, queryByText } = wrap(
      <Button isLoading loadingText="Saving">
        Save
      </Button>,
    );
    expect(getByText("Saving")).toBeDefined();
    expect(queryByText("Save")).toBeNull();
  });

  test("disables when isDisabled is true", () => {
    let pressed = 0;
    const { getByText } = wrap(
      <Button isDisabled onPress={() => pressed++}>
        Disabled
      </Button>,
    );
    fireEvent.click(getByText("Disabled"));
    expect(pressed).toBe(0);
  });
});

describe("IconButton", () => {
  test("renders icon + aria-label", () => {
    const Icon = () => <span data-testid="icon-el" />;
    const { getByTestId } = wrap(<IconButton aria-label="Close dialog" icon={<Icon />} />);
    expect(getByTestId("icon-el")).toBeDefined();
  });

  test("handles onPress", () => {
    let pressed = 0;
    const Icon = () => <span data-testid="ib" />;
    const { getByTestId } = wrap(
      <IconButton aria-label="Act" icon={<Icon />} onPress={() => pressed++} />,
    );
    fireEvent.click(getByTestId("ib"));
    expect(pressed).toBe(1);
  });
});

describe("Link", () => {
  test("renders with href", () => {
    const { container } = wrap(<Link href="/about">About</Link>);
    const a = container.querySelector("a");
    expect(a?.getAttribute("href")).toBe("/about");
  });

  test("isExternal adds target=_blank + rel", () => {
    const { container } = wrap(
      <Link href="https://example.com" isExternal>
        Ext
      </Link>,
    );
    const a = container.querySelector("a");
    expect(a?.getAttribute("target")).toBe("_blank");
    expect(a?.getAttribute("rel")).toBe("noopener noreferrer");
  });
});
