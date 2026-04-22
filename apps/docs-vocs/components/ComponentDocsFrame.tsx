/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-jsx-as-prop -- docs frame */
import { Box, Heading, Link, Text, VStack } from "@superstyling/core";
import { StatusRow } from "./StatusRow";

export interface RelatedLink {
  label: string;
  href: string;
}

export interface A11yCheck {
  /** e.g. "Role" / "Keyboard" / "Screen reader" */
  kind: string;
  /** The requirement. */
  description: string;
}

export interface ComponentDocsFrameProps {
  /** Optional status row override — pass `null` to hide. Default: Tier 1 / Cross-platform / v0.1.0. */
  status?: React.ReactNode;
  /** Anatomy code (JSX source showing compound slots). Rendered in a fenced pre. */
  anatomy?: string;
  /** Accessibility checklist. */
  a11y?: A11yCheck[];
  /** "See also" links rendered in a footer section. */
  seeAlso?: RelatedLink[];
  /** Page body (the MDX content). */
  children: React.ReactNode;
}

/**
 * Per-page chrome for `/components/*` pages: status badges at the top,
 * MDX content in the middle, optional anatomy block + a11y section +
 * "See also" footer at the bottom.
 *
 * Usage in an .mdx file:
 *
 * ```mdx
 * import { ComponentDocsFrame } from "../../components/ComponentDocsFrame";
 *
 * <ComponentDocsFrame
 *   anatomy={`<Modal>...`}
 *   a11y={[{ kind: "Keyboard", description: "ESC closes when focus is inside." }]}
 *   seeAlso={[{ label: "FormControl", href: "/components/form-control" }]}
 * >
 *   # Modal
 *   ...rest of page...
 * </ComponentDocsFrame>
 * ```
 */
export function ComponentDocsFrame({
  status,
  anatomy,
  a11y,
  seeAlso,
  children,
}: ComponentDocsFrameProps) {
  return (
    <Box>
      {status === null
        ? null
        : (status ?? <StatusRow tier="1" platforms="Cross-platform" since="v0.1.0" />)}

      {children}

      {anatomy ? (
        <VStack gap="$2" marginTop="$6">
          <Heading level={2}>Anatomy</Heading>
          <Text fontSize="$3" color="$color10">
            Compound slots this component exposes.
          </Text>
          <Box
            paddingHorizontal="$4"
            paddingVertical="$3"
            borderWidth={1}
            borderColor="$borderColor"
            borderRadius={8}
            backgroundColor="$color1"
          >
            <pre
              style={{
                margin: 0,
                fontSize: 13,
                lineHeight: "1.55",
                fontFamily:
                  'JetBrains Mono, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                whiteSpace: "pre",
                overflowX: "auto",
              }}
            >
              {anatomy}
            </pre>
          </Box>
        </VStack>
      ) : null}

      {a11y && a11y.length > 0 ? (
        <VStack gap="$2" marginTop="$6">
          <Heading level={2}>Accessibility</Heading>
          <VStack gap="$2">
            {a11y.map((item, i) => (
              <Box
                key={i}
                flexDirection="row"
                gap="$2"
                padding="$3"
                borderWidth={1}
                borderColor="$borderColor"
                borderRadius={8}
              >
                <Text
                  fontFamily="$mono"
                  fontWeight="700"
                  fontSize="$2"
                  width={110}
                  color="$primary"
                >
                  {item.kind}
                </Text>
                <Text fontSize="$3" flex={1}>
                  {item.description}
                </Text>
              </Box>
            ))}
          </VStack>
        </VStack>
      ) : null}

      {seeAlso && seeAlso.length > 0 ? (
        <VStack gap="$2" marginTop="$6">
          <Heading level={2}>See also</Heading>
          <VStack gap="$1">
            {seeAlso.map((link) => (
              <Link key={link.href} href={link.href}>
                → {link.label}
              </Link>
            ))}
          </VStack>
        </VStack>
      ) : null}
    </Box>
  );
}
