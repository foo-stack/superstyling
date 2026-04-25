"use client";

import { Breadcrumb, Text } from "@superstyling/core";
import { usePathname } from "one";
import { NAV } from "./nav";

/**
 * DocsBreadcrumb — `Section > Page` trail derived from the static NAV tree
 * and the current path. Renders nothing on `/` (no useful trail).
 *
 * Matching strategy: scan every section's items for an exact href match.
 * If none, the page isn't in nav — render nothing rather than a broken
 * trail.
 */
export function DocsBreadcrumb({ currentPath }: { currentPath?: string }) {
  const livePath = usePathname();
  const path = livePath ?? currentPath;

  if (!path || path === "/") return null;

  let sectionLabel: string | undefined;
  let pageLabel: string | undefined;
  for (const section of NAV) {
    const hit = section.items.find((it) => it.href === path);
    if (hit) {
      sectionLabel = section.label;
      pageLabel = hit.label;
      break;
    }
  }

  if (!sectionLabel || !pageLabel) return null;

  return (
    <Breadcrumb {...({ marginBottom: "$2" } as object)}>
      <Breadcrumb.Item>
        <Text fontSize={13} color="$color10">
          {sectionLabel}
        </Text>
      </Breadcrumb.Item>
      <Breadcrumb.Item isCurrentPage>
        <Text fontSize={13} color="$color" fontWeight="500">
          {pageLabel}
        </Text>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
}
