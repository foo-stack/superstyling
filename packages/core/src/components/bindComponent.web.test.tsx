import { describe, expect, test, vi } from "vitest";
import { render } from "@testing-library/react";
import { bindComponent } from "./bindComponent";

const Base = () => null;

describe("bindComponent — empty/absent override", () => {
  test("returns the base component by reference when override is undefined", () => {
    expect(bindComponent(Base, undefined)).toBe(Base);
  });
});

describe("bindComponent — baseStyle", () => {
  test("merges baseStyle into every instance", () => {
    const spy = vi.fn().mockReturnValue(null);
    const Bound = bindComponent(spy, { baseStyle: { padding: 16 } });
    render(<Bound />);
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ padding: 16 }), undefined);
  });

  test("user props override baseStyle", () => {
    const spy = vi.fn().mockReturnValue(null);
    const Bound = bindComponent(spy, { baseStyle: { padding: 16 } });
    render(<Bound padding={32} />);
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ padding: 32 }), undefined);
  });
});

describe("bindComponent — sizes", () => {
  test("picks the matching size entry based on size prop", () => {
    const spy = vi.fn().mockReturnValue(null);
    const Bound = bindComponent(spy, {
      sizes: { md: { fontSize: 16 }, lg: { fontSize: 20 } },
    });
    render(<Bound size="lg" />);
    const received = spy.mock.calls[0][0];
    expect(received.fontSize).toBe(20);
    expect(received.size).toBe("lg"); // size prop is preserved for the base component
  });

  test("applies no size styles when size prop is missing", () => {
    const spy = vi.fn().mockReturnValue(null);
    const Bound = bindComponent(spy, {
      sizes: { md: { fontSize: 16 } },
    });
    render(<Bound />);
    const received = spy.mock.calls[0][0];
    expect(received.fontSize).toBeUndefined();
  });

  test("ignores unknown size values gracefully", () => {
    const spy = vi.fn().mockReturnValue(null);
    const Bound = bindComponent(spy, {
      sizes: { md: { fontSize: 16 } },
    });
    render(<Bound size="xxl" />);
    const received = spy.mock.calls[0][0];
    expect(received.fontSize).toBeUndefined();
    expect(received.size).toBe("xxl");
  });
});

describe("bindComponent — variants", () => {
  test("picks the matching variant entry based on variant prop", () => {
    const spy = vi.fn().mockReturnValue(null);
    const Bound = bindComponent(spy, {
      variants: {
        solid: { bg: "blue.500", color: "white" },
        outline: { borderWidth: 1, borderColor: "blue.500" },
      },
    });
    render(<Bound variant="outline" />);
    const received = spy.mock.calls[0][0];
    expect(received.borderWidth).toBe(1);
    expect(received.borderColor).toBe("blue.500");
    expect(received.bg).toBeUndefined();
  });
});

describe("bindComponent — defaultProps", () => {
  test("applies defaultProps unless the user overrides", () => {
    const spy = vi.fn().mockReturnValue(null);
    const Bound = bindComponent(spy, {
      defaultProps: { size: "md", color: "blue.500" },
    });
    render(<Bound />);
    const received = spy.mock.calls[0][0];
    expect(received.size).toBe("md");
    expect(received.color).toBe("blue.500");
  });

  test("user props win over defaultProps", () => {
    const spy = vi.fn().mockReturnValue(null);
    const Bound = bindComponent(spy, {
      defaultProps: { size: "md", color: "blue.500" },
    });
    render(<Bound color="red.500" />);
    const received = spy.mock.calls[0][0];
    expect(received.size).toBe("md");
    expect(received.color).toBe("red.500");
  });
});

describe("bindComponent — precedence", () => {
  test("merge order: defaultProps < baseStyle < sizes < variants < user props", () => {
    const spy = vi.fn().mockReturnValue(null);
    const Bound = bindComponent(spy, {
      defaultProps: { padding: 1 },
      baseStyle: { padding: 2 },
      sizes: { md: { padding: 3 } },
      variants: { solid: { padding: 4 } },
    });

    render(<Bound size="md" variant="solid" padding={99} />);
    expect(spy.mock.calls[0][0].padding).toBe(99); // user wins

    spy.mockClear();
    render(<Bound size="md" variant="solid" />);
    expect(spy.mock.calls[0][0].padding).toBe(4); // variant wins over size/base/default

    spy.mockClear();
    render(<Bound size="md" />);
    expect(spy.mock.calls[0][0].padding).toBe(3); // size wins over base/default

    spy.mockClear();
    render(<Bound />);
    expect(spy.mock.calls[0][0].padding).toBe(2); // base wins over default
  });
});
