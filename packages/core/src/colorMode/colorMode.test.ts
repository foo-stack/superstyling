import { describe, expect, test } from "vitest";
import { buildColorModeScript } from "./ColorModeScript";

describe("buildColorModeScript", () => {
  test("produces a self-executing IIFE", () => {
    const script = buildColorModeScript("light", "ss-color-mode");
    expect(script.startsWith("(function(){")).toBe(true);
    expect(script.endsWith("})();")).toBe(true);
  });

  test("reads from the provided storage key", () => {
    const script = buildColorModeScript("light", "my-mode");
    expect(script).toContain('var k="my-mode"');
  });

  test("respects the initial-mode hint", () => {
    const light = buildColorModeScript("light", "k");
    const dark = buildColorModeScript("dark", "k");
    const system = buildColorModeScript("system", "k");
    expect(light).toContain('var init="light"');
    expect(dark).toContain('var init="dark"');
    expect(system).toContain('var init="system"');
  });

  test("sets data-theme and t_<mode> class on <html>", () => {
    const script = buildColorModeScript("light", "k");
    expect(script).toContain("d.setAttribute('data-theme',mode)");
    expect(script).toContain("d.classList.add('t_'+mode)");
  });

  test("uses matchMedia fallback only when init==='system'", () => {
    const script = buildColorModeScript("system", "k");
    expect(script).toContain("matchMedia('(prefers-color-scheme: dark)').matches");
  });

  test("is try/catch-guarded so storage or DOM errors don't break hydration", () => {
    const script = buildColorModeScript("light", "k");
    expect(script).toContain("try{");
    expect(script).toContain("}catch(e){}");
  });
});
