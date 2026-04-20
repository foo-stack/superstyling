import { describe, expect, test } from "vitest";
import { babelPreset } from "./babel-plugin";
import { withSuperStylingMetro } from "./metro-config";

describe("babelPreset", () => {
  test("includes tamagui babel plugin with forwarded options", () => {
    const plugins = babelPreset({ config: "./tamagui.config.ts" });
    const tamaguiEntry = plugins.find((p) => Array.isArray(p) && p[0] === "@tamagui/babel-plugin");
    expect(tamaguiEntry).toBeDefined();
    expect(tamaguiEntry[1].config).toBe("./tamagui.config.ts");
    expect(tamaguiEntry[1].components).toEqual(["tamagui"]);
  });

  test("appends react-native-worklets/plugin last by default", () => {
    const plugins = babelPreset({ config: "./tamagui.config.ts" });
    expect(plugins[plugins.length - 1]).toBe("react-native-worklets/plugin");
  });

  test("omits worklets plugin when includeWorkletsPlugin=false", () => {
    const plugins = babelPreset({
      config: "./tamagui.config.ts",
      includeWorkletsPlugin: false,
    });
    expect(plugins).not.toContain("react-native-worklets/plugin");
  });

  test("forwards custom components and disableExtraction", () => {
    const plugins = babelPreset({
      config: "./tamagui.config.ts",
      components: ["tamagui", "@superstyling/core"],
      disableExtraction: true,
    });
    const tamaguiEntry = plugins.find((p) => Array.isArray(p) && p[0] === "@tamagui/babel-plugin");
    expect(tamaguiEntry[1].components).toEqual(["tamagui", "@superstyling/core"]);
    expect(tamaguiEntry[1].disableExtraction).toBe(true);
  });
});

describe("withSuperStylingMetro (flag-only path — no tamagui config)", () => {
  test("returns a new object, doesn't mutate input", () => {
    const input = { resolver: { foo: 1 }, transformer: { bar: 2 } };
    const out = withSuperStylingMetro(input, { projectRoot: "/tmp" });
    expect(out).not.toBe(input);
    expect(input.resolver).toEqual({ foo: 1 });
    expect(input.transformer).toEqual({ bar: 2 });
  });

  test("enables symlinks, package exports, and allowRequireContext by default", () => {
    const out = withSuperStylingMetro({}, { projectRoot: "/tmp" });
    expect(out.resolver.unstable_enableSymlinks).toBe(true);
    expect(out.resolver.unstable_enablePackageExports).toBe(true);
    expect(out.transformer.unstable_allowRequireContext).toBe(true);
  });

  test("preserves pre-existing resolver fields", () => {
    const out = withSuperStylingMetro(
      { resolver: { sourceExts: ["ts", "tsx"] } },
      { projectRoot: "/tmp" },
    );
    expect(out.resolver.sourceExts).toEqual(["ts", "tsx"]);
    expect(out.resolver.unstable_enableSymlinks).toBe(true);
  });

  test("opt-out flags are honoured", () => {
    const out = withSuperStylingMetro(
      {},
      {
        projectRoot: "/tmp",
        unstable_enableSymlinks: false,
        unstable_enablePackageExports: false,
        unstable_allowRequireContext: false,
      },
    );
    expect(out.resolver.unstable_enableSymlinks).toBe(false);
    expect(out.resolver.unstable_enablePackageExports).toBe(false);
    expect(out.transformer.unstable_allowRequireContext).toBe(false);
  });
});

describe("withSuperStylingMetro (tamagui composition)", () => {
  test("composes @tamagui/metro-plugin's withTamagui when config is passed", () => {
    const out = withSuperStylingMetro(
      { resolver: {}, transformer: {} },
      { projectRoot: "/tmp", config: "./tamagui.config.ts" },
    );
    // withTamagui sets transformer.transformerPath for the Tamagui transformer.
    expect(out.transformer).toBeDefined();
    // Our own flags are still present.
    expect(out.resolver.unstable_enableSymlinks).toBe(true);
    expect(out.resolver.unstable_enablePackageExports).toBe(true);
  });
});
