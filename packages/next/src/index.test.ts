import { describe, expect, test } from "vitest";
import { buildColorModeScript, DEFAULT_STORAGE_KEY, withSuperStyling } from "./index";

describe("withSuperStyling", () => {
  test("is an exported function", () => {
    // We don't invoke it in tests because `@tamagui/next-plugin` imports
    // webpack, which is only present in a real Next toolchain. Runtime
    // behaviour is covered by the Next fixture app's build step.
    expect(typeof withSuperStyling).toBe("function");
  });
});

describe("buildColorModeScript", () => {
  test("defaults to light + superstyling storage key", () => {
    const body = buildColorModeScript();
    expect(body).toContain('"light"');
    expect(body).toContain(JSON.stringify(DEFAULT_STORAGE_KEY));
    expect(body).toContain("localStorage");
  });

  test("honours custom storageKey", () => {
    const body = buildColorModeScript({ storageKey: "my-key" });
    expect(body).toContain('"my-key"');
  });

  test("honours initialMode", () => {
    expect(buildColorModeScript({ initialMode: "dark" })).toContain('"dark"');
    expect(buildColorModeScript({ initialMode: "system" })).toContain('"system"');
  });

  test("returns body without surrounding <script> tags (router helpers add them)", () => {
    const body = buildColorModeScript();
    expect(body.startsWith("<script>")).toBe(false);
    expect(body.endsWith("</script>")).toBe(false);
  });
});
