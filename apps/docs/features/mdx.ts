import { readdirSync, statSync } from "node:fs";
import { resolve as pathResolve, join as pathJoin } from "node:path";
import { bundleMDX } from "mdx-bundler";

export interface Frontmatter {
  title: string;
  description?: string;
  /** Inferred from the `.mdx` path: `components`, `examples`, `getting-started`. */
  category: string;
  /** Path segment after the category, no extension: e.g. `button`. */
  slug: string;
  /** URL the page resolves at: `/components/button`. */
  href: string;
}

// Relative to the docs-next workspace root (process.cwd() during `one dev` /
// `one build`). Using `import.meta.dirname` would resolve to wherever Vite
// places the compiled bundle at runtime, which is not the source tree.
const DATA_ROOT = pathResolve(process.cwd(), "data", "docs");

/**
 * List every MDX page on disk with its frontmatter. Used for `generateStaticParams`
 * in dynamic routes and for building the ufuzzy search index.
 */
export function getAllPages(): Frontmatter[] {
  const out: Frontmatter[] = [];
  for (const category of readdirSync(DATA_ROOT)) {
    const catPath = pathJoin(DATA_ROOT, category);
    if (!statSync(catPath).isDirectory()) continue;
    for (const file of readdirSync(catPath)) {
      if (!file.endsWith(".mdx")) continue;
      const slug = file.replace(/\.mdx$/, "");
      out.push({
        title: slug,
        category,
        slug,
        href: `/${category}/${slug}`,
      });
    }
  }
  return out;
}

/**
 * Compile one MDX file for the given `/<category>/<slug>` pair. Returns the
 * compiled code (run through `getMDXComponent` on the client) plus any
 * frontmatter declared at the top of the file.
 */
// Library deps that esbuild would otherwise chase into react-native (Flow-
// annotated, crashes mdx-bundler's embedded esbuild). Mark external and
// resolve at render time via the `components` prop on the compiled Component
// — our page strip script already removes `@superstyling/*` imports from
// MDX files for the same reason.
const MDX_EXTERNALS = [
  "react-native",
  "react-native-web",
  "tamagui",
  "@tamagui/core",
  "@tamagui/web",
  "one",
];

export async function getMDXPage(
  category: string,
  slug: string,
): Promise<{ code: string; frontmatter: Frontmatter }> {
  const file = pathJoin(DATA_ROOT, category, `${slug}.mdx`);
  const { code, frontmatter } = await bundleMDX<Partial<Frontmatter>>({
    file,
    cwd: pathJoin(DATA_ROOT, category),
    esbuildOptions: (options) => {
      options.external = [...(options.external ?? []), ...MDX_EXTERNALS];
      return options;
    },
  });
  return {
    code,
    frontmatter: {
      title: frontmatter.title ?? slug,
      description: frontmatter.description,
      category,
      slug,
      href: `/${category}/${slug}`,
    },
  };
}
