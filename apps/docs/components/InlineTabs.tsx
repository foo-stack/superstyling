"use client";

import { useState, type ReactNode } from "react";
import { VStack, HStack, Button, Box } from "@superstyling/core";

export interface InlineTabsProps {
  tabs: { value: string; label: string; content: ReactNode }[];
  defaultValue?: string;
}

/**
 * Simple tab switcher for MDX pages (install-command variants, code
 * variants). Client component — only the active tab's content is visible.
 *
 * Simpler than tamagui.dev's InlineTabs (no URL sync, no mobile swipe)
 * but matches the shape needed for Getting Started pages.
 */
export function InlineTabs({ tabs, defaultValue }: InlineTabsProps) {
  const [active, setActive] = useState(defaultValue ?? tabs[0]?.value ?? "");
  const current = tabs.find((t) => t.value === active);

  return (
    <VStack gap="$3">
      <HStack gap="$2" borderBottomWidth={1} borderBottomColor="$borderColor" paddingBottom="$2">
        {tabs.map((tab) => (
          <Button
            key={tab.value}
            size="sm"
            variant={tab.value === active ? "solid" : "ghost"}
            onPress={() => setActive(tab.value)}
          >
            {tab.label}
          </Button>
        ))}
      </HStack>
      <Box>{current?.content}</Box>
    </VStack>
  );
}
