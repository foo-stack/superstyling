import { describe, it, expect, vi } from "vitest";
import { adaptChakraTheme } from "./adaptChakraTheme";
import { defineStyleConfig, defineMultiStyleConfig } from "./defineStyleConfig";

describe("adaptChakraTheme", () => {
  it("passes through matching fields unchanged", () => {
    const { theme, warnings } = adaptChakraTheme(
      {
        colors: { brand: { "500": "#f00" } },
        space: { "4": "16px" },
        fonts: { heading: "Inter" },
        radii: { md: "8px" },
        config: { initialColorMode: "dark" },
      },
      { logWarnings: false },
    );
    expect(theme.colors).toEqual({ brand: { "500": "#f00" } });
    expect(theme.space).toEqual({ "4": "16px" });
    expect(theme.fonts).toEqual({ heading: "Inter" });
    expect(theme.radii).toEqual({ md: "8px" });
    expect(theme.config?.initialColorMode).toBe("dark");
    expect(warnings).toHaveLength(0);
  });

  it("drops unsupported surfaces with warnings", () => {
    const { warnings } = adaptChakraTheme(
      {
        styles: { global: { body: { bg: "white" } } },
        layerStyles: { card: { p: 4 } },
        textStyles: { heading: { fontSize: 24 } },
      },
      { logWarnings: false },
    );
    expect(warnings.length).toBe(3);
    expect(warnings.some((w) => w.includes("styles.global"))).toBe(true);
    expect(warnings.some((w) => w.includes("layerStyles"))).toBe(true);
    expect(warnings.some((w) => w.includes("textStyles"))).toBe(true);
  });

  it("adapts components section — static objects pass through", () => {
    const { theme } = adaptChakraTheme(
      {
        components: {
          Button: {
            baseStyle: { fontWeight: 600 },
            sizes: { md: { px: 4 } },
            variants: { solid: { bg: "blue.500" } },
            defaultProps: { size: "md" },
          },
        },
      },
      { logWarnings: false },
    );
    expect(theme.components?.Button?.baseStyle).toEqual({ fontWeight: 600 });
    expect(theme.components?.Button?.sizes?.md).toEqual({ px: 4 });
    expect(theme.components?.Button?.variants?.solid).toEqual({ bg: "blue.500" });
    expect(theme.components?.Button?.defaultProps).toEqual({ size: "md" });
  });

  it("skips function-valued style slots and flags them", () => {
    const { theme, warnings } = adaptChakraTheme(
      {
        components: {
          Button: {
            baseStyle: (() => ({ color: "red" })) as unknown,
            variants: { ghost: (() => ({ bg: "transparent" })) as unknown },
          },
        },
      },
      { logWarnings: false },
    );
    expect(theme.components?.Button?.baseStyle).toBeUndefined();
    expect(theme.components?.Button?.variants).toBeUndefined();
    expect(warnings.some((w) => w.includes("Button.baseStyle"))).toBe(true);
    expect(warnings.some((w) => w.includes("Button.variants.ghost"))).toBe(true);
  });

  it("logs a single console.warn when warnings exist and logWarnings=true", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    adaptChakraTheme({ styles: { global: {} } });
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });
});

describe("defineStyleConfig", () => {
  it("is an identity helper", () => {
    const input = { baseStyle: { fontWeight: 600 } };
    expect(defineStyleConfig(input)).toEqual(input);
  });
});

describe("defineMultiStyleConfig", () => {
  it("flattens part-keyed baseStyle into a single style object", () => {
    const out = defineMultiStyleConfig({
      parts: ["container", "button"],
      baseStyle: {
        container: { p: 4 },
        button: { fontWeight: 600 },
      },
    });
    expect(out.baseStyle).toEqual({ p: 4, fontWeight: 600 });
  });

  it("flattens sizes and variants", () => {
    const out = defineMultiStyleConfig({
      parts: ["a", "b"],
      sizes: { md: { a: { p: 4 }, b: { px: 2 } } },
      variants: { solid: { a: { bg: "blue.500" }, b: { color: "white" } } },
    });
    expect(out.sizes?.md).toEqual({ p: 4, px: 2 });
    expect(out.variants?.solid).toEqual({ bg: "blue.500", color: "white" });
  });

  it("preserves defaultProps", () => {
    const out = defineMultiStyleConfig({ defaultProps: { size: "md" } });
    expect(out.defaultProps).toEqual({ size: "md" });
  });
});
