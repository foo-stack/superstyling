/**
 * The full map of components MDX pages can reference. Passed to
 * `getMDXComponent(code)(components)` in every dynamic doc route so pages
 * can use bare JSX tags like `<Button>` without importing.
 *
 * Every bare-specifier import stripped out of the MDX source during port
 * needs a corresponding entry here.
 */

import * as Core from "@superstyling/core";
import * as Icons from "@superstyling/icons";
import { ComponentDemo } from "./ComponentDemo";
import { PropsTable } from "./PropsTable";
import { DocsCodeBlock } from "./DocsCodeBlock";
import { InlineTabs } from "./InlineTabs";
import { StatusRow } from "./StatusRow";
import { mdxComponents } from "./MDXComponents";

// Broad Record type so TS doesn't try to serialize the full spread shape
// (which trips error TS7056 — "exceeds the maximum length the compiler
// will serialize" — because of the Select + FormControl compound types).
export const pageComponents: Record<string, unknown> = {
  // MDX tag → styled component overrides (h1, p, code, pre, etc.)
  ...mdxComponents,

  // Custom docs building blocks that MDX pages reference directly
  ComponentDemo,
  PropsTable,
  DocsCodeBlock,
  InlineTabs,
  StatusRow,

  // Every @superstyling/core primitive — spread the whole barrel so any
  // bare `<Button>`, `<Modal.Content>`, `<FormControl.Label>`, etc. works.
  ...Core,

  // Every icon. `CheckIcon`, `ChevronDownIcon`, …
  ...Icons,
};
