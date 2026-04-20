/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-jsx-as-prop -- docs layout */
import type { ReactNode } from "react";
import { Box, HStack, Heading, Link, Text, VStack } from "@superstyling/core";
import { DOCS_NAV } from "./nav";
import { Search } from "./Search";

function currentPath(): string {
  if (typeof window === "undefined") return "";
  return window.location.pathname || "/";
}

const SIDEBAR_WIDTH = 260;
const CONTENT_MAX_WIDTH = 860;

export interface DocsPageProps {
  title: string;
  description?: string;
  children: ReactNode;
}

/**
 * Shell for every docs page. Renders:
 *   - A top bar with brand + nav
 *   - A sidebar built from `DOCS_NAV`
 *   - The page body (title + description + children)
 *
 * Used by both component pages and Getting Started guides so layout stays
 * consistent without the overhead of an MDX toolchain.
 */
export function DocsPage({ title, description, children }: DocsPageProps) {
  const active = currentPath();
  return (
    <VStack flex={1} backgroundColor="$background">
      {/* Top bar */}
      <HStack
        paddingHorizontal="$6"
        paddingVertical="$3"
        borderBottomWidth={1}
        borderColor="$borderColor"
        alignItems="center"
        justifyContent="space-between"
      >
        <Link href="/">
          <Text fontWeight="700" fontSize="$4">
            Superstyling
          </Text>
        </Link>
        <Search />
      </HStack>

      {/* Sidebar + content */}
      <Box flexDirection="row" flex={1}>
        <Box
          width={SIDEBAR_WIDTH}
          paddingVertical="$4"
          paddingHorizontal="$4"
          borderRightWidth={1}
          borderColor="$borderColor"
        >
          <VStack gap="$4">
            {DOCS_NAV.map((section) => (
              <VStack key={section.title} gap="$1">
                <Text fontSize="$2" fontWeight="700" color="$color10">
                  {section.title.toUpperCase()}
                </Text>
                {section.items.map((item) => {
                  const isActive = item.href === active;
                  return (
                    <Link key={item.href} href={item.href}>
                      <Text
                        fontSize="$3"
                        color={isActive ? "$primary" : "$foreground"}
                        fontWeight={isActive ? "600" : "400"}
                      >
                        {item.title}
                      </Text>
                    </Link>
                  );
                })}
              </VStack>
            ))}
          </VStack>
        </Box>

        <Box flex={1} paddingHorizontal="$6" paddingVertical="$6">
          <VStack gap="$4" maxWidth={CONTENT_MAX_WIDTH}>
            <VStack gap="$2">
              <Heading level={1}>{title}</Heading>
              {description ? (
                <Text fontSize="$4" color="$color10">
                  {description}
                </Text>
              ) : null}
            </VStack>
            {children}
          </VStack>
        </Box>
      </Box>
    </VStack>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Smaller building blocks used by pages

export function PropsTable({
  props,
}: {
  props: Array<{
    name: string;
    type: string;
    default?: string;
    required?: boolean;
    description: string;
  }>;
}) {
  return (
    <VStack borderWidth={1} borderColor="$borderColor" borderRadius={8} overflow="hidden">
      <Box
        flexDirection="row"
        paddingHorizontal="$3"
        paddingVertical="$2"
        backgroundColor="$color2"
        borderBottomWidth={1}
        borderColor="$borderColor"
      >
        <Text flex={2} fontWeight="700" fontSize="$2">
          Prop
        </Text>
        <Text flex={3} fontWeight="700" fontSize="$2">
          Type
        </Text>
        <Text flex={2} fontWeight="700" fontSize="$2">
          Default
        </Text>
        <Text flex={5} fontWeight="700" fontSize="$2">
          Description
        </Text>
      </Box>
      {props.map((p, i) => (
        <Box
          key={p.name}
          flexDirection="row"
          paddingHorizontal="$3"
          paddingVertical="$2"
          borderTopWidth={i === 0 ? 0 : 1}
          borderColor="$borderColor"
        >
          <Text flex={2} fontFamily="$mono" fontSize="$2">
            {p.name}
            {p.required ? <Text color="$red9"> *</Text> : null}
          </Text>
          <Text flex={3} fontFamily="$mono" fontSize="$2" color="$color10">
            {p.type}
          </Text>
          <Text flex={2} fontFamily="$mono" fontSize="$2" color="$color10">
            {p.default ?? "—"}
          </Text>
          <Text flex={5} fontSize="$2">
            {p.description}
          </Text>
        </Box>
      ))}
    </VStack>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <VStack gap="$3" marginTop="$4">
      <Heading level={2}>{title}</Heading>
      {children}
    </VStack>
  );
}
