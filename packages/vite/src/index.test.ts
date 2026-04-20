import { describe, expect, test } from "vitest";
import { colorModeScriptSnippet, superstylingAliases, superstylingVitePlugin } from "./index";

describe("superstylingVitePlugin", () => {
  test("returns an array with three composed plugins", () => {
    const plugins = superstylingVitePlugin({ config: "./tamagui.config.ts" });
    expect(Array.isArray(plugins)).toBe(true);
    // aliasPlugin, devDepsPlugin, tamaguiPluginInstance
    expect(plugins.length).toBe(3);
  });

  test("alias plugin emits resolve.alias entries", async () => {
    const [aliasPlugin] = superstylingVitePlugin({ config: "./tamagui.config.ts" });
    // Plugin objects have a `config` hook returning the config patch
    // oxlint-disable-next-line typescript/no-explicit-any
    const cfg = await (aliasPlugin as any).config.call({});
    expect(cfg.resolve.alias).toBeDefined();
    expect(Array.isArray(cfg.resolve.alias) || typeof cfg.resolve.alias === "object").toBe(true);
  });

  test("dev-deps plugin includes react-native-web-lite by default", async () => {
    const [, devDepsPlugin] = superstylingVitePlugin({ config: "./tamagui.config.ts" });
    // oxlint-disable-next-line typescript/no-explicit-any
    const cfg = await (devDepsPlugin as any).config.call({});
    expect(cfg.optimizeDeps.include).toContain("@tamagui/react-native-web-lite");
  });

  test("dev-deps plugin swaps to full react-native-web when rnwLite=false", async () => {
    const [, devDepsPlugin] = superstylingVitePlugin({
      config: "./tamagui.config.ts",
      rnwLite: false,
    });
    // oxlint-disable-next-line typescript/no-explicit-any
    const cfg = await (devDepsPlugin as any).config.call({});
    expect(cfg.optimizeDeps.include).toContain("react-native-web");
    expect(cfg.optimizeDeps.include).not.toContain("@tamagui/react-native-web-lite");
  });

  test("passes through extra optimizeDeps entries", async () => {
    const [, devDepsPlugin] = superstylingVitePlugin({
      config: "./tamagui.config.ts",
      optimizeDepsInclude: ["some-dep"],
    });
    // oxlint-disable-next-line typescript/no-explicit-any
    const cfg = await (devDepsPlugin as any).config.call({});
    expect(cfg.optimizeDeps.include).toContain("some-dep");
  });
});

describe("superstylingAliases", () => {
  test("returns an array of alias entries", () => {
    const aliases = superstylingAliases({ rnwLite: true, svg: true });
    expect(Array.isArray(aliases)).toBe(true);
    expect(aliases.length).toBeGreaterThan(0);
    for (const entry of aliases) {
      expect("find" in entry && "replacement" in entry).toBe(true);
    }
  });
});

describe("colorModeScriptSnippet", () => {
  test("returns a script tag with the generated body", () => {
    const snippet = colorModeScriptSnippet();
    expect(snippet.startsWith("<script>")).toBe(true);
    expect(snippet.endsWith("</script>")).toBe(true);
    expect(snippet).toContain("localStorage");
  });

  test("embeds custom storageKey", () => {
    const snippet = colorModeScriptSnippet({ storageKey: "custom-mode-key" });
    expect(snippet).toContain("custom-mode-key");
  });

  test("embeds initialMode", () => {
    const light = colorModeScriptSnippet({ initialMode: "light" });
    const dark = colorModeScriptSnippet({ initialMode: "dark" });
    const sys = colorModeScriptSnippet({ initialMode: "system" });
    expect(light).toContain('"light"');
    expect(dark).toContain('"dark"');
    expect(sys).toContain('"system"');
  });
});
