#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";
import jscodeshift from "jscodeshift";
import codemodTransform, { Report } from "./codemod.js";

/**
 * CLI entry: `superstyling-migrate-from-chakra [path] [--dry]`
 *
 * Walks the given path (default `./src`), runs the codemod on every
 * `.ts / .tsx / .js / .jsx` file, and prints a migration report at the
 * end. Pass `--dry` to preview without writing files.
 */

const CANDIDATE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx"]);
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "build", ".turbo", ".next", ".expo"]);

function walk(root: string, out: string[] = []): string[] {
  for (const entry of readdirSync(root)) {
    const full = join(root, entry);
    const stats = statSync(full);
    if (stats.isDirectory()) {
      if (SKIP_DIRS.has(entry)) continue;
      walk(full, out);
    } else if (CANDIDATE_EXTENSIONS.has(extname(entry))) {
      out.push(full);
    }
  }
  return out;
}

export function main(argv: string[] = process.argv.slice(2)) {
  const dryRun = argv.includes("--dry");
  const target = resolve(argv.find((a) => !a.startsWith("--")) ?? "./src");

  const files = walk(target);
  const report = new Report();

  const parser = (
    jscodeshift as unknown as { withParser: (p: string) => typeof jscodeshift }
  ).withParser("tsx");

  let touched = 0;
  for (const path of files) {
    const source = readFileSync(path, "utf8");
    const api = makeApi(parser);
    const fileInfo = { path, source };
    const output = codemodTransform(fileInfo, api, { __report: report });
    if (typeof output === "string" && output !== source) {
      if (!dryRun) writeFileSync(path, output, "utf8");
      touched += 1;
    }
  }

  // Print summary.
  // eslint-disable-next-line no-console
  console.log(report.format());
  // eslint-disable-next-line no-console
  console.log(`\n${dryRun ? "[dry-run] " : ""}${touched} file(s) modified.`);
  return { touched, report };
}

function makeApi(j: typeof jscodeshift) {
  return {
    jscodeshift: j,
    j,
    stats: () => undefined,
    report: () => undefined,
  } as unknown as import("jscodeshift").API;
}

// Allow running via `node dist/cli.js` or `npx`.
const invokedAsScript =
  typeof process !== "undefined" &&
  process.argv[1] &&
  fileURLToPath(import.meta.url) === process.argv[1];
if (invokedAsScript) {
  main();
}
