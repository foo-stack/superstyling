/* oxlint-disable react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-function-as-prop -- smoke tests */
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  SuperStylingProvider,
  adaptChakraTheme,
  createSystem,
  Alert,
  Badge,
  Box,
  Button,
  Text,
} from "../";

/**
 * Parity smoke test: a realistic Chakra-shaped theme flows through
 * adaptChakraTheme → createSystem → SuperStylingProvider without error,
 * and 5 primitive families (Box/Text/Button/Badge/Alert) render with the
 * adapted theme active.
 */

const chakraShapedTheme = {
  colors: {
    brand: {
      "50": "#f0f9ff",
      "100": "#e0f2fe",
      "200": "#bae6fd",
      "300": "#7dd3fc",
      "400": "#38bdf8",
      "500": "#0ea5e9",
      "600": "#0284c7",
      "700": "#0369a1",
      "800": "#075985",
      "900": "#0c4a6e",
      "950": "#082f49",
    },
  },
  space: { custom: "72px" },
  radii: { xl: "16px" },
  fonts: { heading: "Inter, sans-serif" },
  components: {
    Button: {
      baseStyle: { fontWeight: 600 },
      sizes: { md: { px: 4 } },
      variants: { solid: { bg: "brand.500", color: "white" } },
      defaultProps: { variant: "solid" },
    },
  },
  config: { initialColorMode: "light" },
  // Unsupported surface — should be dropped cleanly.
  styles: { global: { body: { bg: "white" } } },
};

describe("adaptChakraTheme — parity smoke", () => {
  it("adapted theme → createSystem → renders 5 primitive families", () => {
    const { theme, warnings } = adaptChakraTheme(chakraShapedTheme, { logWarnings: false });
    // One warning expected (styles.global).
    expect(warnings.length).toBe(1);

    const system = createSystem(theme);
    const { container } = render(
      <SuperStylingProvider system={system}>
        <Box>
          <Text>hello</Text>
          <Button>click</Button>
          <Badge>status</Badge>
          <Alert status="info">note</Alert>
        </Box>
      </SuperStylingProvider>,
    );
    expect(container.textContent).toContain("hello");
    expect(container.textContent).toContain("click");
    expect(container.textContent).toContain("status");
    expect(container.textContent).toContain("note");
  });
});
