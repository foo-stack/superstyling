import { useMemo } from "react";
import { getMDXComponent } from "mdx-bundler/client";
import { useLoader } from "one";
import { DocsPage } from "~/components/DocsPage";
import { pageComponents } from "~/components/pageComponents";

export async function generateStaticParams() {
  const { getAllPages } = await import("~/features/mdx");
  return getAllPages()
    .filter((p) => p.category === "migration")
    .map((p) => ({ slug: p.slug }));
}

export async function loader({ params }: { params: { slug: string } }) {
  const { getMDXPage } = await import("~/features/mdx");
  return getMDXPage("migration", params.slug);
}

export default function MigrationDocPage() {
  const { code, frontmatter } = useLoader(loader);
  const Component = useMemo(() => getMDXComponent(code), [code]);
  return (
    <DocsPage currentPath={frontmatter.href}>
      {/* @ts-expect-error — MDX component prop type is too loose for our map */}
      <Component components={pageComponents} />
    </DocsPage>
  );
}
