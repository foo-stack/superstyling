import { describe, it, expect } from "vitest";
import jscodeshift from "jscodeshift";
import codemod, { Report } from "./codemod.js";
import type { API, FileInfo } from "jscodeshift";

function run(source: string, path = "test.tsx") {
  const parser = (
    jscodeshift as unknown as { withParser: (p: string) => typeof jscodeshift }
  ).withParser("tsx");
  const api = {
    jscodeshift: parser,
    j: parser,
    stats: () => undefined,
    report: () => undefined,
  } as unknown as API;
  const fileInfo: FileInfo = { path, source };
  const report = new Report();
  const out = codemod(fileInfo, api, { __report: report });
  return { out: typeof out === "string" ? out : null, report };
}

describe("codemod — imports", () => {
  it("rewrites @chakra-ui/react → @superstyling/core", () => {
    const input = `import { Button, useDisclosure } from "@chakra-ui/react";\nexport const X = Button;`;
    const { out, report } = run(input);
    expect(out).toContain(`from "@superstyling/core"`);
    expect(out).not.toContain(`@chakra-ui/react`);
    expect(report.entries.some((e) => e.kind === "rewritten" && e.transform === "imports")).toBe(
      true,
    );
  });

  it("rewrites @chakra-ui/icons → @superstyling/icons", () => {
    const input = `import { CloseIcon } from "@chakra-ui/icons";\nexport default CloseIcon;`;
    const { out } = run(input);
    expect(out).toContain(`from "@superstyling/icons"`);
  });

  it("flags @chakra-ui/theme-tools imports as TODOs", () => {
    const input = `import { mode } from "@chakra-ui/theme-tools";\nexport default mode;`;
    const { out, report } = run(input);
    expect(out).toContain(`TODO(superstyling)`);
    expect(report.entries.some((e) => e.kind === "todo")).toBe(true);
  });

  it("leaves unrelated imports untouched", () => {
    const input = `import * as React from "react";\nimport { useState } from "react";\nexport const x = 1;`;
    const { out } = run(input);
    // no Chakra imports — codemod reports null
    expect(out).toBeNull();
  });
});

describe("codemod — provider", () => {
  it("renames <ChakraProvider> to <SuperStylingProvider>", () => {
    const input = `import { ChakraProvider } from "@chakra-ui/react";
export const App = () => <ChakraProvider theme={theme}><div /></ChakraProvider>;`;
    const { out } = run(input);
    expect(out).toContain("<SuperStylingProvider");
    expect(out).toContain("</SuperStylingProvider>");
    expect(out).not.toContain("ChakraProvider");
  });

  it("renames theme prop to system prop on the provider", () => {
    const input = `import { ChakraProvider } from "@chakra-ui/react";
export const App = () => <ChakraProvider theme={theme} />;`;
    const { out, report } = run(input);
    expect(out).toContain("system={theme}");
    expect(out).not.toContain("theme={theme}");
    expect(report.entries.some((e) => e.kind === "todo" && e.message.includes("system"))).toBe(
      true,
    );
  });

  it("flags ChakraBaseProvider with a TODO", () => {
    const input = `import { ChakraBaseProvider } from "@chakra-ui/react";
export const App = () => <ChakraBaseProvider><div /></ChakraBaseProvider>;`;
    const { out, report } = run(input);
    expect(out).toContain("<SuperStylingProvider");
    expect(
      report.entries.some((e) => e.kind === "todo" && e.message.includes("ChakraBaseProvider")),
    ).toBe(true);
  });
});

describe("codemod — theme", () => {
  it("wraps extendTheme(...) with createSystem(adaptChakraTheme(...).theme)", () => {
    const input = `import { extendTheme } from "@chakra-ui/react";
const theme = extendTheme({ colors: { brand: { "500": "#f00" } } });`;
    const { out, report } = run(input);
    expect(out).toContain("createSystem(adaptChakraTheme(");
    expect(out).toContain(").theme)");
    expect(out).toContain(`from "@superstyling/core"`);
    expect(out).toContain("createSystem");
    expect(out).toContain("adaptChakraTheme");
    expect(report.entries.some((e) => e.transform === "theme" && e.kind === "rewritten")).toBe(
      true,
    );
    expect(report.entries.some((e) => e.transform === "theme" && e.kind === "todo")).toBe(true);
  });

  it("handles multi-arg extendTheme via Object.assign merge", () => {
    const input = `import { extendTheme } from "@chakra-ui/react";
const theme = extendTheme({ a: 1 }, { b: 2 }, { c: 3 });`;
    const { out } = run(input);
    expect(out).toContain("Object.assign({}");
  });

  it("flags extendBaseTheme as TODO without rewriting", () => {
    const input = `import { extendBaseTheme } from "@chakra-ui/react";
const theme = extendBaseTheme({ colors: { brand: { "500": "#f00" } } });`;
    const { out, report } = run(input);
    // extendBaseTheme is not rewritten — only flagged
    expect(out).toContain("extendBaseTheme(");
    expect(
      report.entries.some((e) => e.kind === "todo" && e.message.includes("extendBaseTheme")),
    ).toBe(true);
  });
});

describe("codemod — report", () => {
  it("counts rewrites, todos, and files", () => {
    const input = `import { Button } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
export const X = <Button />;`;
    const { report } = run(input);
    const tally = report.countByKind();
    expect(tally.rewritten).toBeGreaterThan(0);
    expect(tally.todo).toBeGreaterThan(0);
    expect(report.filesTouched()).toBe(1);
  });

  it("format() renders a human-readable summary", () => {
    const input = `import { Button } from "@chakra-ui/react";\nexport const X = <Button />;`;
    const { report } = run(input);
    const s = report.format();
    expect(s).toContain("Superstyling migration report");
    expect(s).toContain("Files touched:");
    expect(s).toContain("Rewrites:");
  });
});

describe("codemod — combined fixture", () => {
  it("rewrites a realistic Chakra app entry point end-to-end", () => {
    const input = `
import { ChakraProvider, Button, extendTheme } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { mode } from "@chakra-ui/theme-tools";

const theme = extendTheme({
  colors: { brand: { "500": "#0ea5e9" } },
});

export default function App({ children }) {
  return (
    <ChakraProvider theme={theme}>
      <Button leftIcon={<CloseIcon />}>Hi</Button>
      {children}
    </ChakraProvider>
  );
}
`.trim();
    const { out, report } = run(input);
    expect(out).toContain(`from "@superstyling/core"`);
    expect(out).toContain(`from "@superstyling/icons"`);
    expect(out).toContain("SuperStylingProvider");
    expect(out).toContain("system={theme}");
    expect(out).toContain("createSystem(adaptChakraTheme(");
    expect(out).toContain("TODO(superstyling)"); // from theme-tools import
    const tally = report.countByKind();
    expect(tally.rewritten).toBeGreaterThanOrEqual(4);
    expect(tally.todo).toBeGreaterThanOrEqual(2);
  });
});
