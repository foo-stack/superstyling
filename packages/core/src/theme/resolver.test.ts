import { describe, expect, test } from "vitest";
import { defaultTheme } from "./default";
import { mergeTheme } from "./merge";
import {
  buildColorSchemeThemes,
  buildColorTokens,
  buildMediaQueries,
  buildThemes,
  resolveColorReference,
  resolveTheme,
} from "./resolver";

describe("buildColorTokens", () => {
  test("flattens color scales into dotted keys", () => {
    const out = buildColorTokens(defaultTheme.colors);
    expect(out["blue.500"]).toBe("#3182CE");
    expect(out["gray.900"]).toBe("#171923");
    expect(out["red.50"]).toBe("#FFF5F5");
  });

  test("preserves top-level string colors", () => {
    const out = buildColorTokens(defaultTheme.colors);
    expect(out.black).toBe("#000000");
    expect(out.white).toBe("#FFFFFF");
    expect(out.transparent).toBe("transparent");
    expect(out.current).toBe("currentColor");
  });

  test("flattens alpha scales", () => {
    const out = buildColorTokens(defaultTheme.colors);
    expect(out["whiteAlpha.500"]).toBe("rgba(255, 255, 255, 0.36)");
    expect(out["blackAlpha.900"]).toBe("rgba(0, 0, 0, 0.92)");
  });
});

describe("resolveColorReference", () => {
  test("resolves dotted token path", () => {
    expect(resolveColorReference("gray.900", defaultTheme.colors)).toBe("#171923");
    expect(resolveColorReference("blue.500", defaultTheme.colors)).toBe("#3182CE");
  });

  test("resolves bare named color", () => {
    expect(resolveColorReference("white", defaultTheme.colors)).toBe("#FFFFFF");
    expect(resolveColorReference("black", defaultTheme.colors)).toBe("#000000");
  });

  test("passes through non-theme values unchanged", () => {
    expect(resolveColorReference("#FF00FF", defaultTheme.colors)).toBe("#FF00FF");
    expect(resolveColorReference("rgb(1,2,3)", defaultTheme.colors)).toBe("rgb(1,2,3)");
  });

  test("passes through unknown scale references unchanged", () => {
    expect(resolveColorReference("unknown.500", defaultTheme.colors)).toBe("unknown.500");
    expect(resolveColorReference("gray.unknown", defaultTheme.colors)).toBe("gray.unknown");
  });
});

describe("buildThemes", () => {
  test("produces a light theme from default semantic tokens", () => {
    const themes = buildThemes(defaultTheme.semanticTokens, defaultTheme.colors);
    expect(themes.light?.background).toBe("#FFFFFF"); // "white" → resolved
    expect(themes.light?.foreground).toBe("#171923"); // "gray.900" → resolved
    expect(themes.light?.primary).toBe("#3182CE"); // "blue.500" → resolved
  });

  test("produces a dark theme with _dark overrides resolved", () => {
    const themes = buildThemes(defaultTheme.semanticTokens, defaultTheme.colors);
    expect(themes.dark?.background).toBe("#171923"); // "gray.900"
    expect(themes.dark?.foreground).toBe("#FFFFFF"); // "white"
    expect(themes.dark?.primary).toBe("#4299E1"); // "blue.400"
  });

  test("creates arbitrary mode themes when _<mode> keys exist", () => {
    const themes = buildThemes(
      {
        colors: {
          background: {
            default: "white",
            _dark: "gray.900",
            _highContrast: "black",
          },
        },
      },
      defaultTheme.colors,
    );
    expect(themes.highContrast?.background).toBe("#000000");
  });
});

describe("buildMediaQueries", () => {
  test("converts em breakpoints to px minWidth entries (no 'base')", () => {
    const media = buildMediaQueries(defaultTheme.breakpoints);
    expect(media.base).toBeUndefined();
    expect(media.sm).toEqual({ minWidth: 480 });
    expect(media.md).toEqual({ minWidth: 768 });
    expect(media.lg).toEqual({ minWidth: 992 });
    expect(media.xl).toEqual({ minWidth: 1280 });
    expect(media["2xl"]).toEqual({ minWidth: 1536 });
  });
});

describe("resolveTheme", () => {
  test("produces a complete Tamagui-shaped resolved input from the default theme", () => {
    const resolved = resolveTheme(defaultTheme);
    expect(resolved.tokens.color["blue.500"]).toBe("#3182CE");
    expect(resolved.tokens.space["4"]).toBe("1rem");
    expect(resolved.tokens.radius.md).toBe("0.375rem");
    expect(resolved.tokens.zIndex.modal).toBe(1400);
    expect(resolved.themes.light).toBeDefined();
    expect(resolved.themes.dark).toBeDefined();
    expect(resolved.media.md).toEqual({ minWidth: 768 });
    expect(resolved.settings.defaultFont).toBe("body");
  });

  test("size tokens exclude nested objects like container", () => {
    const resolved = resolveTheme(defaultTheme);
    expect(resolved.tokens.size["container"]).toBeUndefined();
    expect(resolved.tokens.size.sm).toBe("24rem");
  });

  test("emits a `true` key on space, size, and radius (Tamagui requirement)", () => {
    // createTamagui() throws at construct time if these are missing; this
    // test prevents that regression. Seen in the wild when running
    // `yarn dev` in apps/docs.
    const resolved = resolveTheme(defaultTheme);
    expect(resolved.tokens.space.true).toBeDefined();
    expect(resolved.tokens.size.true).toBeDefined();
    expect(resolved.tokens.radius.true).toBeDefined();
  });
});

describe("buildColorSchemeThemes", () => {
  test("produces a standalone theme for every color scale", () => {
    const themes = buildColorSchemeThemes(defaultTheme.colors);
    expect(themes.blue).toBeDefined();
    expect(themes.red).toBeDefined();
    expect(themes.purple).toBeDefined();
  });

  test("produces mode-nested themes (light_{scale}, dark_{scale})", () => {
    const themes = buildColorSchemeThemes(defaultTheme.colors);
    expect(themes.light_blue).toBeDefined();
    expect(themes.dark_blue).toBeDefined();
  });

  test("maps primary tokens to the expected shades (light: 500)", () => {
    const themes = buildColorSchemeThemes(defaultTheme.colors);
    expect(themes.light_blue?.primary).toBe("#3182CE"); // blue.500
    expect(themes.light_blue?.primaryHover).toBe("#2B6CB0"); // blue.600
    expect(themes.light_blue?.primaryActive).toBe("#2C5282"); // blue.700
  });

  test("dark-mode scheme uses lighter shades for readability", () => {
    const themes = buildColorSchemeThemes(defaultTheme.colors);
    expect(themes.dark_blue?.primary).toBe("#4299E1"); // blue.400
    expect(themes.dark_blue?.primaryHover).toBe("#63B3ED"); // blue.300
  });

  test("skips non-scale color entries (transparent/current/black/white)", () => {
    const themes = buildColorSchemeThemes(defaultTheme.colors);
    expect(themes.black).toBeUndefined();
    expect(themes.white).toBeUndefined();
    expect(themes.transparent).toBeUndefined();
    expect(themes.current).toBeUndefined();
  });

  test("includes every scale across gray/red/orange/yellow/green/teal/blue/cyan/purple/pink", () => {
    const themes = buildColorSchemeThemes(defaultTheme.colors);
    for (const scale of [
      "gray",
      "red",
      "orange",
      "yellow",
      "green",
      "teal",
      "blue",
      "cyan",
      "purple",
      "pink",
    ]) {
      expect(themes[scale]).toBeDefined();
      expect(themes[`light_${scale}`]).toBeDefined();
      expect(themes[`dark_${scale}`]).toBeDefined();
    }
  });
});

describe("mergeTheme", () => {
  test("returns defaults unchanged when input is empty", () => {
    const merged = mergeTheme({});
    expect(merged.colors.blue["500"]).toBe("#3182CE");
    expect(merged.space["4"]).toBe("1rem");
  });

  test("overrides a single color scale shade without losing other shades", () => {
    const merged = mergeTheme({
      colors: { blue: { "500": "#ff0000" } as never },
    });
    expect(merged.colors.blue["500"]).toBe("#ff0000");
    expect(merged.colors.blue["100"]).toBe("#BEE3F8");
    expect(merged.colors.red["500"]).toBe("#E53E3E");
  });

  test("adds a user color scale alongside defaults", () => {
    const merged = mergeTheme({
      colors: {
        brand: {
          "50": "#F0F9FF",
          "100": "#E0F2FE",
          "200": "#BAE6FD",
          "300": "#7DD3FC",
          "400": "#38BDF8",
          "500": "#0EA5E9",
          "600": "#0284C7",
          "700": "#0369A1",
          "800": "#075985",
          "900": "#0C4A6E",
          "950": "#082F49",
        },
      },
    });
    expect((merged.colors.brand as Record<string, string>)["500"]).toBe("#0EA5E9");
    expect(merged.colors.blue["500"]).toBe("#3182CE");
  });

  test("merges config with defaults", () => {
    const merged = mergeTheme({ config: { initialColorMode: "dark" } });
    expect(merged.config.initialColorMode).toBe("dark");
    expect(merged.config.useSystemColorMode).toBe(false);
    expect(merged.config.cssVarPrefix).toBe("ss");
  });
});
