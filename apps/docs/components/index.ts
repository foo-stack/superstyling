/**
 * Central re-export for docs building blocks. MDX pages can pull everything
 * from one specifier:
 *
 * ```mdx
 * import { ComponentDemo, PropsTable, StatusRow } from "../../components";
 * ```
 *
 * Vocs's markdown pipeline doesn't expose an MDX-provider hook for auto-
 * injecting components, so per-page imports stay. This barrel keeps that
 * overhead to a single line.
 */

export { ComponentDemo, type ComponentDemoProps } from "./ComponentDemo";
export { PropsTable, type PropRow } from "./PropsTable";
export { StatusRow, type StatusRowProps } from "./StatusRow";
export {
  ComponentDocsFrame,
  type ComponentDocsFrameProps,
  type RelatedLink,
  type A11yCheck,
} from "./ComponentDocsFrame";
