import type { ReactNode } from "react";
import { Box, Heading, Text, Link, Divider } from "@superstyling/core";
import { DocsCodeBlock } from "./DocsCodeBlock";

/**
 * MDX tag → styled component map. Passed as the `components` prop to
 * `getMDXComponent(code)(components)`. Every raw HTML tag that MDX can emit
 * is mapped here so pages render with our design system.
 */

function makeH(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const topMargin = level === 1 ? 0 : level === 2 ? "$6" : "$5";
  return function Hn({ children }: { children?: ReactNode }) {
    return (
      <Heading level={level} marginTop={topMargin} marginBottom="$3">
        {children}
      </Heading>
    );
  };
}

function InlineCode({ children }: { children?: ReactNode }) {
  return (
    <Text
      fontFamily="$mono"
      fontSize={14}
      backgroundColor="$color3"
      paddingHorizontal={4}
      paddingVertical={1}
      borderRadius={4}
    >
      {children}
    </Text>
  );
}

/**
 * MDX emits fenced code blocks as `<pre><code class="language-ts">...</code></pre>`.
 * We pull the language out of the inner `<code>`'s className and pipe
 * through our DocsCodeBlock.
 */
function Pre({ children }: { children: ReactNode }) {
  const codeEl =
    children && typeof children === "object" && "props" in (children as object)
      ? (children as { props: { className?: string; children?: string } }).props
      : null;
  const className = codeEl?.className ?? "";
  const language = /language-(\w+)/.exec(className)?.[1];
  const source = typeof codeEl?.children === "string" ? codeEl.children : "";
  return <DocsCodeBlock language={language}>{source}</DocsCodeBlock>;
}

export const mdxComponents = {
  h1: makeH(1),
  h2: makeH(2),
  h3: makeH(3),
  h4: makeH(4),
  h5: makeH(5),
  h6: makeH(6),
  p: ({ children }: { children?: ReactNode }) => (
    <Text marginVertical="$2" lineHeight={24} fontSize={16}>
      {children}
    </Text>
  ),
  a: ({ href, children }: { href?: string; children?: ReactNode }) => (
    <Link href={href ?? "#"} color="$primary" isExternal={href?.startsWith("http")}>
      {children}
    </Link>
  ),
  code: InlineCode,
  pre: Pre,
  hr: () => <Divider marginVertical="$4" />,
  blockquote: ({ children }: { children?: ReactNode }) => (
    <Box
      borderLeftWidth={3}
      borderLeftColor="$primary"
      paddingLeft="$3"
      marginVertical="$3"
      backgroundColor="$color2"
    >
      {children}
    </Box>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <Box marginVertical="$2" paddingLeft="$5" gap="$1">
      {children}
    </Box>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <Box marginVertical="$2" paddingLeft="$5" gap="$1">
      {children}
    </Box>
  ),
  li: ({ children }: { children?: ReactNode }) => (
    <Text fontSize={16} lineHeight={24}>
      {children}
    </Text>
  ),
};
