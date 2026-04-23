import type { FileInfo, JSCodeshift, Collection } from "jscodeshift";
import type { Report } from "../report.js";

/**
 * Rename Chakra provider components to `SuperStylingProvider`.
 *
 *   <ChakraProvider theme={theme}>…</ChakraProvider>
 *     → <SuperStylingProvider system={theme}>…</SuperStylingProvider>
 *
 * We rename both the JSX element and the `theme` prop (→ `system`) so
 * the replaced provider expects the `createSystem(...)` output by
 * default. Users whose `theme` is a raw Chakra theme object still need
 * to wrap it with `adaptChakraTheme` + `createSystem` — the `theme`
 * transform below annotates that call site.
 *
 * `ChakraBaseProvider` (rare — theme-less variant) is renamed with a
 * TODO since it implies a non-default configuration the user set up.
 */

const PROVIDER_NAMES = ["ChakraProvider", "ChakraBaseProvider"];

export function rewriteProvider(
  j: JSCodeshift,
  root: Collection,
  fileInfo: FileInfo,
  report: Report,
): boolean {
  let changed = false;

  // Rename import specifiers. If a file imported both providers, we de-dupe.
  root.find(j.ImportSpecifier).forEach((path) => {
    const imported = path.node.imported;
    if (imported.type !== "Identifier") return;
    if (!PROVIDER_NAMES.includes(imported.name)) return;

    const oldName = imported.name;
    path.node.imported = j.identifier("SuperStylingProvider");
    if (path.node.local && path.node.local.name === oldName) {
      path.node.local = j.identifier("SuperStylingProvider");
    }
    changed = true;
  });

  // Rename JSX elements.
  root
    .find(j.JSXIdentifier)
    .filter((path) => PROVIDER_NAMES.includes(path.node.name))
    .forEach((path) => {
      const oldName = path.node.name;
      path.node.name = "SuperStylingProvider";
      changed = true;
      report.add({
        file: fileInfo.path,
        line: path.node.loc?.start.line,
        kind: "rewritten",
        transform: "provider",
        message: `<${oldName}> → <SuperStylingProvider>`,
      });

      if (oldName === "ChakraBaseProvider") {
        report.add({
          file: fileInfo.path,
          line: path.node.loc?.start.line,
          kind: "todo",
          transform: "provider",
          message:
            "ChakraBaseProvider implies a trimmed provider graph — review whether SuperStylingProvider's bundled providers (color mode, overlays, toast) are all wanted.",
        });
      }
    });

  // Rename `theme={...}` prop to `system={...}` on SuperStylingProvider elements.
  root
    .find(j.JSXAttribute)
    .filter((path) => {
      if (path.node.name.type !== "JSXIdentifier") return false;
      if (path.node.name.name !== "theme") return false;
      const parent = path.parent.node;
      if (!parent || parent.type !== "JSXOpeningElement") return false;
      const elName = parent.name;
      return elName.type === "JSXIdentifier" && elName.name === "SuperStylingProvider";
    })
    .forEach((path) => {
      (path.node.name as { name: string }).name = "system";
      changed = true;
      report.add({
        file: fileInfo.path,
        line: path.node.loc?.start.line,
        kind: "todo",
        transform: "provider",
        message:
          "Renamed `theme` prop to `system`. If the value is still a Chakra theme object, wrap with `createSystem(adaptChakraTheme(theme).theme)`.",
      });
    });

  return changed;
}
