import type { ReactNode } from "react";
import { Box, HStack, VStack } from "@superstyling/core";
import { DocsMenuContents } from "./DocsMenuContents";
import { DocsBreadcrumb } from "./DocsBreadcrumb";
import { TopNav } from "./TopNav";

/**
 * DocsPage — three-pane shell (top nav, sidebar, main content).
 *
 * Adapted from tamagui/tamagui @ code/tamagui.dev/features/docs/DocsPage.tsx
 * but compacted to ~60 lines using our own primitives. Sticky sidebar +
 * top-nav, max-width content column.
 *
 * Breadcrumb is rendered above `children` for any `currentPath` that
 * resolves to an entry in `nav.ts`. The landing page (`/`) skips it.
 */
export function DocsPage({ children, currentPath }: { children: ReactNode; currentPath?: string }) {
  return (
    <VStack minHeight="100vh" backgroundColor="$background">
      <TopNav />
      <HStack alignItems="flex-start" flex={1}>
        <Box
          width={280}
          position="sticky"
          top={56}
          maxHeight="calc(100vh - 56px)"
          overflowY="auto"
          borderRightWidth={1}
          borderRightColor="$borderColor"
          padding="$4"
          display="none"
          $md={{ display: "flex" }}
        >
          <DocsMenuContents currentPath={currentPath} />
        </Box>

        <Box flex={1} minWidth={0} padding="$6" maxWidth={900} marginHorizontal="auto">
          <DocsBreadcrumb currentPath={currentPath} />
          {children}
        </Box>
      </HStack>
    </VStack>
  );
}
