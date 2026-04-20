import { describe, expect, test } from "vitest";
import { translateProps } from "./translateProps";

const defaultOpts = {
  breakpointNames: ["sm", "md", "lg", "xl", "2xl"] as const,
};

describe("translateProps — pass-through", () => {
  test("forwards Chakra shortcut props untouched (Tamagui resolves them)", () => {
    expect(translateProps({ p: 4, bg: "blue.500" }, defaultOpts)).toEqual({
      p: 4,
      bg: "blue.500",
    });
  });

  test("leaves non-object values untouched", () => {
    expect(translateProps({ color: "white", fontSize: "md" }, defaultOpts)).toEqual({
      color: "white",
      fontSize: "md",
    });
  });
});

describe("translateProps — pseudo-props", () => {
  test("_hover → hoverStyle, with nested keys preserved", () => {
    const out = translateProps({ _hover: { bg: "blue.600", color: "white" } }, defaultOpts);
    expect(out).toEqual({
      hoverStyle: { bg: "blue.600", color: "white" },
    });
  });

  test("_focus → focusStyle, _active → pressStyle, _disabled → disabledStyle", () => {
    const out = translateProps(
      {
        _focus: { borderColor: "blue.500" },
        _active: { opacity: 0.8 },
        _disabled: { opacity: 0.4 },
      },
      defaultOpts,
    );
    expect(out).toEqual({
      focusStyle: { borderColor: "blue.500" },
      pressStyle: { opacity: 0.8 },
      disabledStyle: { opacity: 0.4 },
    });
  });

  test("_pressed aliases to the same pressStyle target as _active", () => {
    const out = translateProps({ _pressed: { opacity: 0.5 } }, defaultOpts);
    expect(out).toEqual({ pressStyle: { opacity: 0.5 } });
  });

  test("nested pseudo-props inside a pseudo are translated recursively", () => {
    const out = translateProps(
      { _hover: { bg: "blue.600", _active: { opacity: 0.5 } } },
      defaultOpts,
    );
    expect(out).toEqual({
      hoverStyle: { bg: "blue.600", pressStyle: { opacity: 0.5 } },
    });
  });

  test("web-only pseudo _before maps to beforeStyle", () => {
    const out = translateProps({ _before: { content: '""', display: "block" } }, defaultOpts);
    expect(out).toEqual({
      beforeStyle: { content: '""', display: "block" },
    });
  });
});

describe("translateProps — responsive object form", () => {
  test("expands { base, md } into top-level + $md nested", () => {
    const out = translateProps({ p: { base: 2, md: 4 } }, defaultOpts);
    expect(out).toEqual({
      p: 2,
      $md: { p: 4 },
    });
  });

  test("expands multi-breakpoint objects across distinct media props", () => {
    const out = translateProps({ p: { base: 2, md: 4, lg: 6, xl: 8 } }, defaultOpts);
    expect(out).toEqual({
      p: 2,
      $md: { p: 4 },
      $lg: { p: 6 },
      $xl: { p: 8 },
    });
  });

  test("supports no-base responsive (e.g., only md+)", () => {
    const out = translateProps({ p: { md: 4, lg: 6 } }, defaultOpts);
    expect(out).toEqual({
      $md: { p: 4 },
      $lg: { p: 6 },
    });
  });

  test("merges multiple responsive props into shared media-key objects", () => {
    const out = translateProps(
      {
        p: { base: 2, md: 4 },
        bg: { base: "red.500", md: "blue.500" },
      },
      defaultOpts,
    );
    expect(out).toEqual({
      p: 2,
      bg: "red.500",
      $md: { p: 4, bg: "blue.500" },
    });
  });

  test("passes through style objects that aren't responsive", () => {
    const out = translateProps({ _hover: { bg: "blue.500", color: "white" } }, defaultOpts);
    expect(out).toEqual({
      hoverStyle: { bg: "blue.500", color: "white" },
    });
  });

  test("treats an object with mixed keys as non-responsive (pseudo wins)", () => {
    // `{ base: 2, bg: 'red.500' }` has a non-breakpoint key → not responsive.
    const out = translateProps({ custom: { base: 2, bg: "red.500" } }, defaultOpts);
    expect(out).toEqual({ custom: { base: 2, bg: "red.500" } });
  });
});

describe("translateProps — sx prop", () => {
  test("spreads sx as top-level props", () => {
    const out = translateProps({ sx: { bg: "blue.500", color: "white" } }, defaultOpts);
    expect(out).toEqual({ bg: "blue.500", color: "white" });
  });

  test("sx with pseudo-props translates recursively", () => {
    const out = translateProps(
      {
        sx: {
          bg: "blue.500",
          _hover: { bg: "blue.600" },
        },
      },
      defaultOpts,
    );
    expect(out).toEqual({
      bg: "blue.500",
      hoverStyle: { bg: "blue.600" },
    });
  });

  test("non-object sx is passed through untouched", () => {
    // Chakra tolerates unusual sx shapes; we don't spread non-objects.
    const out = translateProps({ sx: "oops" }, defaultOpts);
    expect(out).toEqual({ sx: "oops" });
  });

  test("sx + other props combine without collision", () => {
    const out = translateProps(
      {
        p: 4,
        sx: { bg: "red.500" },
      },
      defaultOpts,
    );
    expect(out).toEqual({ p: 4, bg: "red.500" });
  });
});

describe("translateProps — combined scenarios", () => {
  test("pseudo + responsive + sx together", () => {
    const out = translateProps(
      {
        p: { base: 2, md: 4 },
        _hover: { bg: "blue.600" },
        sx: { color: "white", _focus: { borderColor: "blue.500" } },
      },
      defaultOpts,
    );
    expect(out).toEqual({
      p: 2,
      $md: { p: 4 },
      hoverStyle: { bg: "blue.600" },
      color: "white",
      focusStyle: { borderColor: "blue.500" },
    });
  });
});
