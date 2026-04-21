#!/usr/bin/env node
/**
 * Post-tsc pass: adds `.js` to extensionless relative imports in compiled
 * `.js` and `.d.ts` files under each package's `dist/`.
 *
 * Why: our source imports are extensionless (`import { Foo } from "./foo"`).
 * TypeScript with `moduleResolution: Bundler` preserves the extensionless
 * form in output, which Node's strict ESM resolver rejects. Bundlers
 * (Vite/Next/Metro/esbuild) handle extensionless, but Node-to-package
 * resolution — which Vite's build pipeline hits during SSR pre-bundling —
 * does not.
 *
 * The alternative is to rewrite every source file with `.js` extensions +
 * `moduleResolution: NodeNext`. This pass is less invasive and only runs at
 * build time.
 *
 * Usage: node scripts/add-js-extensions.mjs <dist-dir>
 */

import { promises as fs } from "node:fs";
import { join } from "node:path";

const distDir = process.argv[2];
if (!distDir) {
  console.error("usage: add-js-extensions.mjs <dist-dir>");
  process.exit(1);
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (entry.isFile() && (entry.name.endsWith(".js") || entry.name.endsWith(".d.ts"))) {
      files.push(full);
    }
  }
  return files;
}

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

// Matches: import/export … from "./foo" | "../foo" (no extension, no trailing slash)
// Preserves: absolute package specs (no "./" or "../"), anything already ending in .js/.json/.mjs/.cjs/.ts/.tsx
const IMPORT_RE = /((?:import|export)[^'"]*?from\s*['"])(\.{1,2}\/[^'"]*?)(['"])/g;
const DYNAMIC_IMPORT_RE = /(import\s*\(\s*['"])(\.{1,2}\/[^'"]*?)(['"]\s*\))/g;

async function rewriteFile(file) {
  const src = await fs.readFile(file, "utf8");

  async function resolveSpec(spec) {
    // Already has a recognised extension — leave it.
    if (/\.(js|mjs|cjs|json|ts|tsx)$/.test(spec)) return spec;
    const candidateFile = join(file, "..", `${spec}.js`);
    const candidateIndex = join(file, "..", spec, "index.js");
    if (await exists(candidateFile)) return `${spec}.js`;
    if (await exists(candidateIndex)) return `${spec}/index.js`;
    // Unresolved — leave as-is; likely a .native.ts / platform split or
    // intentional alias. Consumer-side bundler will handle it.
    return spec;
  }

  // Rewrite import/export + dynamic import(). Apply patterns sequentially,
  // feeding each pattern the output of the last so both can fire on the
  // same file.
  const patterns = [IMPORT_RE, DYNAMIC_IMPORT_RE];
  let out = src;
  for (const re of patterns) {
    const source = out;
    const parts = [];
    let lastIndex = 0;
    re.lastIndex = 0;
    for (const m of source.matchAll(re)) {
      const [full, pre, spec, post] = m;
      parts.push(source.slice(lastIndex, m.index));
      const resolved = await resolveSpec(spec);
      parts.push(`${pre}${resolved}${post}`);
      lastIndex = m.index + full.length;
    }
    parts.push(source.slice(lastIndex));
    out = parts.join("");
  }

  if (out !== src) await fs.writeFile(file, out, "utf8");
}

const files = await walk(distDir);
await Promise.all(files.map(rewriteFile));
console.log(`rewrote ${files.length} files under ${distDir}`);
