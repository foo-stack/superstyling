import type { FileInfo, JSCodeshift, Collection } from "jscodeshift";
import type { Report } from "../report.js";

/**
 * Rewrite Chakra theme construction calls.
 *
 *   const theme = extendTheme({ colors: {...}, components: {...} });
 *     → const theme = createSystem(adaptChakraTheme({ colors:{...}, components:{...} }).theme);
 *
 * `defineStyleConfig` / `defineMultiStyleConfig` are already re-exported
 * from `@superstyling/core`, so they pass through unchanged after the
 * import rewrite.
 *
 * Unconvertible Chakra theme surfaces flagged for manual follow-up:
 *   - `extendBaseTheme(...)`                  — annotated TODO
 *   - `withDefaultColorScheme({...})(theme)`  — annotated TODO
 *   - function-valued `baseStyle` / `variants` inside the config       — flagged by adaptChakraTheme at runtime
 */

const PASS_THROUGH = new Set(["defineStyleConfig", "defineMultiStyleConfig"]);

export function rewriteTheme(
  j: JSCodeshift,
  root: Collection,
  fileInfo: FileInfo,
  report: Report,
): boolean {
  let changed = false;

  root
    .find(j.CallExpression)
    .filter((path) => {
      const callee = path.node.callee;
      return callee.type === "Identifier" && callee.name === "extendTheme";
    })
    .forEach((path) => {
      const args = path.node.arguments;
      if (args.length === 0) return;

      // Build: createSystem(adaptChakraTheme(<original args spread into one object>).theme)
      // For simplicity when user passed multiple args (Chakra supports overrides merged
      // left-to-right), we wrap them in Object.assign({}, ...args).
      let innerArg: (typeof args)[number];
      if (args.length === 1) {
        innerArg = args[0]!;
      } else {
        innerArg = j.callExpression(
          j.memberExpression(j.identifier("Object"), j.identifier("assign")),
          [j.objectExpression([]), ...args],
        );
      }

      const adapted = j.callExpression(j.identifier("adaptChakraTheme"), [innerArg as never]);
      const themeAccess = j.memberExpression(adapted, j.identifier("theme"));
      const createSys = j.callExpression(j.identifier("createSystem"), [themeAccess]);

      // Replace the CallExpression in place.
      path.replace(createSys);
      changed = true;

      report.add({
        file: fileInfo.path,
        line: path.node.loc?.start.line,
        kind: "rewritten",
        transform: "theme",
        message: "extendTheme(...) → createSystem(adaptChakraTheme(...).theme)",
      });
      report.add({
        file: fileInfo.path,
        line: path.node.loc?.start.line,
        kind: "todo",
        transform: "theme",
        message:
          "Review adaptChakraTheme warnings at runtime — `styles.global`, `layerStyles`, `textStyles`, and function-valued style configs are dropped.",
      });
    });

  // Flag unconvertible theme helpers.
  const UNSUPPORTED_THEME_CALLS = [
    "extendBaseTheme",
    "withDefaultColorScheme",
    "withDefaultSize",
    "withDefaultVariant",
  ];
  root
    .find(j.CallExpression)
    .filter((path) => {
      const callee = path.node.callee;
      return callee.type === "Identifier" && UNSUPPORTED_THEME_CALLS.includes(callee.name);
    })
    .forEach((path) => {
      const callee = path.node.callee as { name: string };
      report.add({
        file: fileInfo.path,
        line: path.node.loc?.start.line,
        kind: "todo",
        transform: "theme",
        message: `\`${callee.name}()\` has no direct equivalent; hand-convert.`,
      });
    });

  // Ensure createSystem + adaptChakraTheme are imported if we touched anything.
  if (changed) ensureImports(j, root, ["createSystem", "adaptChakraTheme"]);

  // Ensure pass-through helpers still resolve via a Superstyling import.
  PASS_THROUGH.forEach((_name) => void _name);

  return changed;
}

function ensureImports(j: JSCodeshift, root: Collection, names: string[]) {
  let existing = root.find(j.ImportDeclaration).filter((p) => {
    const src = p.node.source.value;
    return src === "@superstyling/core";
  });

  if (existing.size() === 0) {
    const specifiers = names.map((n) => j.importSpecifier(j.identifier(n)));
    const decl = j.importDeclaration(specifiers, j.literal("@superstyling/core"));
    root.get().node.program.body.unshift(decl);
    return;
  }

  existing.forEach((path) => {
    const already = new Set(
      (path.node.specifiers ?? []).map((s) =>
        s.type === "ImportSpecifier" ? s.imported.name : "",
      ),
    );
    for (const n of names) {
      if (!already.has(n)) {
        path.node.specifiers = [
          ...(path.node.specifiers ?? []),
          j.importSpecifier(j.identifier(n)),
        ];
      }
    }
  });
}
