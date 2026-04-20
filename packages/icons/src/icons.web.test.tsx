import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";
import { CheckIcon, ChevronDownIcon, CloseIcon, Icon, WarningIcon, createIcon } from "./index";

describe("Icon", () => {
  test("renders an inline <svg> with the default viewBox and stroke attrs", () => {
    const { container } = render(
      <Icon aria-label="placeholder">
        <path d="M0 0h24v24H0" />
      </Icon>,
    );
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
    expect(svg?.getAttribute("stroke-width")).toBe("2");
    expect(svg?.getAttribute("fill")).toBe("none");
    expect(svg?.getAttribute("aria-label")).toBe("placeholder");
    expect(svg?.getAttribute("aria-hidden")).toBe("false");
    expect(svg?.getAttribute("role")).toBe("img");
  });

  test("hides from AT when no aria-label provided", () => {
    const { container } = render(
      <Icon>
        <path d="M0 0h24v24H0" />
      </Icon>,
    );
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.hasAttribute("role")).toBe(false);
  });

  test("respects custom size and color", () => {
    const { container } = render(
      <Icon aria-label="sized" size={32} color="red">
        <path d="M0 0" />
      </Icon>,
    );
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("32");
    expect(svg?.getAttribute("height")).toBe("32");
    expect(svg?.getAttribute("stroke")).toBe("red");
  });
});

describe("createIcon", () => {
  test("produces a component with the given displayName", () => {
    const Foo = createIcon({ displayName: "FooIcon", paths: ["M0 0"] });
    expect(Foo.displayName).toBe("FooIcon");
  });

  test("renders each path entry as a <path> element", () => {
    const Multi = createIcon({
      displayName: "MultiIcon",
      paths: ["M1 1", "M2 2", "M3 3"],
    });
    const { container } = render(<Multi />);
    const paths = container.querySelectorAll("svg path");
    expect(paths).toHaveLength(3);
    expect(paths[0]?.getAttribute("d")).toBe("M1 1");
    expect(paths[2]?.getAttribute("d")).toBe("M3 3");
  });

  test("applies a custom viewBox if provided", () => {
    const Tall = createIcon({
      displayName: "TallIcon",
      paths: ["M0 0"],
      viewBox: "0 0 16 32",
    });
    const { container } = render(<Tall />);
    expect(container.querySelector("svg")?.getAttribute("viewBox")).toBe("0 0 16 32");
  });
});

describe("icon set — spot checks", () => {
  test("ChevronDownIcon renders a single path", () => {
    const { container } = render(<ChevronDownIcon />);
    const paths = container.querySelectorAll("svg path");
    expect(paths).toHaveLength(1);
    expect(paths[0]?.getAttribute("d")).toBe("M6 9l6 6 6-6");
  });

  test("CheckIcon renders with the v-shape path", () => {
    const { container } = render(<CheckIcon />);
    const path = container.querySelector("svg path");
    expect(path?.getAttribute("d")).toBe("M20 6L9 17l-5-5");
  });

  test("CloseIcon has two path strokes (the X)", () => {
    const { container } = render(<CloseIcon />);
    expect(container.querySelectorAll("svg path")).toHaveLength(2);
  });

  test("WarningIcon renders three paths (triangle + exclamation stem + dot)", () => {
    const { container } = render(<WarningIcon />);
    expect(container.querySelectorAll("svg path")).toHaveLength(3);
  });
});
