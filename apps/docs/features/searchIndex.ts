import { ALL_NAV_ITEMS } from "~/components/nav";

export interface SearchEntry {
  title: string;
  description: string;
  href: string;
  headings: string[];
  /** The concatenated haystack ufuzzy runs against. */
  haystack: string;
}

// Every MDX source pulled in as a raw string at bundle time. Vite transforms
// the glob into eager imports so the index is ready synchronously on first
// search keystroke — no network round-trip.
const MDX_SOURCES = import.meta.glob("/data/docs/**/*.mdx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function parseFrontmatter(source: string): { title?: string; description?: string } {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match || !match[1]) return {};
  const body = match[1];
  const title = body.match(/^title:\s*(.+)$/m)?.[1]?.trim();
  const description = body.match(/^description:\s*(.+)$/m)?.[1]?.trim();
  return { title, description };
}

function extractHeadings(source: string): string[] {
  const out: string[] = [];
  const re = /^#+\s+(.+)$/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source)) !== null) {
    const heading = m[1]?.trim();
    if (heading) out.push(heading);
  }
  return out;
}

function extractFirstParagraph(source: string): string {
  const body = source.replace(/^---\n[\s\S]*?\n---\n/, "");
  for (const line of body.split("\n")) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith("#") || t.startsWith("<") || t.startsWith("```")) continue;
    if (t.startsWith("import ") || t.startsWith("export ")) continue;
    return t;
  }
  return "";
}

function hrefFromPath(path: string): string {
  // `/data/docs/components/button.mdx` → `/components/button`
  return path.replace(/^\/data\/docs/, "").replace(/\.mdx$/, "");
}

/** Every page (MDX + TSX) available for search. */
export const SEARCH_INDEX: SearchEntry[] = (() => {
  const byHref = new Map<string, SearchEntry>();

  // MDX pages — parse each source file
  for (const [path, source] of Object.entries(MDX_SOURCES)) {
    const href = hrefFromPath(path);
    const { title, description } = parseFrontmatter(source);
    const headings = extractHeadings(source);
    const resolvedTitle = title ?? headings[0] ?? href;
    const resolvedDescription = description ?? extractFirstParagraph(source);
    const entry: SearchEntry = {
      title: resolvedTitle,
      description: resolvedDescription,
      href,
      headings,
      haystack: [resolvedTitle, resolvedDescription, ...headings].join(" · "),
    };
    byHref.set(href, entry);
  }

  // TSX-only pages — fall back to the nav label. Content isn't searchable for
  // these (we don't parse TSX source), but titles still match exact queries.
  for (const nav of ALL_NAV_ITEMS) {
    if (byHref.has(nav.href)) continue;
    byHref.set(nav.href, {
      title: nav.label,
      description: "",
      href: nav.href,
      headings: [],
      haystack: nav.label,
    });
  }

  return Array.from(byHref.values()).sort((a, b) => a.title.localeCompare(b.title));
})();
