import type { FileInfo, API, Transform } from "jscodeshift";
import { Report } from "./report.js";
import { rewriteImports } from "./transforms/imports.js";
import { rewriteProvider } from "./transforms/provider.js";
import { rewriteTheme } from "./transforms/theme.js";

/**
 * Run all three transforms in sequence. Returns the rewritten source
 * when any transform mutated the AST; returns `null` otherwise so
 * jscodeshift can skip the file in its report.
 *
 * A shared `Report` accumulates across transforms for a unified
 * end-of-run summary — but because jscodeshift runs this transform
 * per-file in isolated workers, we *also* print per-file lines via
 * its native stats and rely on the CLI to aggregate after the run.
 */

interface OptionsWithReport {
  __report?: Report;
}

const transform: Transform = (fileInfo: FileInfo, api: API, options?: unknown) => {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  const optsWithReport = (options ?? {}) as OptionsWithReport;
  const report = optsWithReport.__report ?? new Report();

  let changed = false;
  changed = rewriteImports(j, root, fileInfo, report) || changed;
  changed = rewriteProvider(j, root, fileInfo, report) || changed;
  changed = rewriteTheme(j, root, fileInfo, report) || changed;

  return changed ? root.toSource() : null;
};

export default transform;
export { Report };
export type { ReportEntry } from "./report.js";
