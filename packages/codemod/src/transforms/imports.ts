import type { FileInfo, JSCodeshift, Collection } from "jscodeshift";
import type { Report } from "../report.js";

/**
 * Rewrite Chakra imports to their Superstyling equivalents.
 *
 *   import { Button, useDisclosure } from "@chakra-ui/react";
 *       → import { Button, useDisclosure } from "@superstyling/core";
 *
 *   import { CloseIcon } from "@chakra-ui/icons";
 *       → import { CloseIcon } from "@superstyling/icons";
 */

const SOURCE_MAP: Record<string, string> = {
  "@chakra-ui/react": "@superstyling/core",
  "@chakra-ui/core": "@superstyling/core",
  "@chakra-ui/icons": "@superstyling/icons",
};

const UNMAPPED_CHAKRA_PREFIXES = [
  "@chakra-ui/theme-tools",
  "@chakra-ui/styled-system",
  "@chakra-ui/anatomy",
  "@chakra-ui/cli",
];

export function rewriteImports(
  j: JSCodeshift,
  root: Collection,
  fileInfo: FileInfo,
  report: Report,
): boolean {
  let changed = false;

  root.find(j.ImportDeclaration).forEach((path) => {
    const source = path.node.source.value;
    if (typeof source !== "string") return;

    const mapped = SOURCE_MAP[source];
    if (mapped) {
      path.node.source = j.literal(mapped);
      changed = true;
      report.add({
        file: fileInfo.path,
        line: path.node.loc?.start.line,
        kind: "rewritten",
        transform: "imports",
        message: `${source} → ${mapped}`,
      });
      return;
    }

    if (UNMAPPED_CHAKRA_PREFIXES.some((p) => source === p || source.startsWith(`${p}/`))) {
      path.node.comments = [
        ...(path.node.comments ?? []),
        j.commentLine(
          ` TODO(superstyling): ${source} has no direct equivalent; hand-convert.`,
          true,
          false,
        ),
      ];
      changed = true;
      report.add({
        file: fileInfo.path,
        line: path.node.loc?.start.line,
        kind: "todo",
        transform: "imports",
        message: `${source} has no direct equivalent; hand-convert.`,
      });
    }
  });

  return changed;
}
