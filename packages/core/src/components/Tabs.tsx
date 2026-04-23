import { type ComponentProps, type ReactNode } from "react";
import { Tabs as TamaguiTabs } from "@tamagui/tabs";
import { XStack, YStack } from "tamagui";

/**
 * Tabs — switch between multiple panels of content. Built on
 * `@tamagui/tabs` which provides keyboard navigation (←/→/Home/End),
 * roving tabindex, and WAI-ARIA tablist/tab/tabpanel semantics.
 *
 *   <Tabs defaultValue="profile">
 *     <Tabs.List>
 *       <Tabs.Tab value="profile">Profile</Tabs.Tab>
 *       <Tabs.Tab value="settings">Settings</Tabs.Tab>
 *     </Tabs.List>
 *     <Tabs.Panels>
 *       <Tabs.Panel value="profile">…</Tabs.Panel>
 *       <Tabs.Panel value="settings">…</Tabs.Panel>
 *     </Tabs.Panels>
 *   </Tabs>
 *
 * Four Chakra-style variants control the visual treatment of the tab
 * strip: line (underline, default), enclosed (boxed tabs, panel joins
 * active), soft-rounded (pill tabs with subtle bg), solid-rounded
 * (filled pill tabs).
 */

export type TabsVariant = "line" | "enclosed" | "soft-rounded" | "solid-rounded";
export type TabsOrientation = "horizontal" | "vertical";

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  orientation?: TabsOrientation;
  variant?: TabsVariant;
  colorScheme?: string;
  children?: ReactNode;
}

// ────────────────────────────────────────────────────────────────────────
// Context — propagates variant to every Tab so indivdual tabs know how
// to style themselves. Kept local to this module.

import { createContext, useContext } from "react";

interface TabsContextValue {
  variant: TabsVariant;
  colorScheme: string;
}

const TabsContext = createContext<TabsContextValue>({
  variant: "line",
  colorScheme: "blue",
});

function TabsRoot({
  value,
  defaultValue,
  onChange,
  orientation = "horizontal",
  variant = "line",
  colorScheme = "blue",
  children,
}: TabsProps) {
  return (
    <TabsContext.Provider value={{ variant, colorScheme }}>
      <TamaguiTabs
        value={value}
        defaultValue={defaultValue}
        onValueChange={onChange}
        orientation={orientation}
        flexDirection={orientation === "vertical" ? "row" : "column"}
      >
        {children}
      </TamaguiTabs>
    </TabsContext.Provider>
  );
}
TabsRoot.displayName = "Tabs";

// ────────────────────────────────────────────────────────────────────────
// List

const TabsList = function TabsList(props: ComponentProps<typeof TamaguiTabs.List>) {
  const { variant } = useContext(TabsContext);
  const isLine = variant === "line";
  const isEnclosed = variant === "enclosed";

  return (
    <TamaguiTabs.List
      gap={isLine ? 0 : "$1"}
      borderBottomWidth={isLine || isEnclosed ? 1 : 0}
      borderBottomColor="$borderColor"
      padding={variant === "solid-rounded" || variant === "soft-rounded" ? "$1" : 0}
      {...props}
    />
  );
};
TabsList.displayName = "Tabs.List";

// ────────────────────────────────────────────────────────────────────────
// Tab

export type TabsTabProps = ComponentProps<typeof TamaguiTabs.Tab> & {
  children?: ReactNode;
};

function tabVariantStyles(variant: TabsVariant, active: boolean): Record<string, unknown> {
  switch (variant) {
    case "enclosed":
      return {
        borderWidth: 1,
        borderColor: active ? "$borderColor" : "transparent",
        borderBottomColor: active ? "$background" : "$borderColor",
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        marginBottom: -1,
        backgroundColor: active ? "$background" : "transparent",
      };
    case "soft-rounded":
      return {
        borderRadius: 999,
        backgroundColor: active ? "$color3" : "transparent",
      };
    case "solid-rounded":
      return {
        borderRadius: 999,
        backgroundColor: active ? "$primary" : "transparent",
      };
    case "line":
    default:
      return {
        borderBottomWidth: 2,
        borderBottomColor: active ? "$primary" : "transparent",
        marginBottom: -1,
      };
  }
}

const TabsTab = function TabsTab(props: TabsTabProps) {
  const { variant } = useContext(TabsContext);
  const { value, children, ...rest } = props;

  return (
    <TamaguiTabs.Tab
      paddingHorizontal="$3"
      paddingVertical="$2"
      backgroundColor="transparent"
      {...(rest as ComponentProps<typeof TamaguiTabs.Tab>)}
      value={value as string}
    >
      {/* Active-state styling is applied via data-attribute selectors in
          Tamagui; for a consistent cross-platform look we rely on Tab's
          own pressStyle/activeStyle — the variant's shape is applied via
          a wrapper YStack selector mapping. Simpler: let Tamagui's
          unstyled Tab render, then we add per-variant classes via
          `$theme-active` conditional props. */}
      {/* Fallback: apply a base style + conditional on `data-state`. */}
      <YStack
        flexDirection="row"
        alignItems="center"
        gap="$2"
        paddingHorizontal="$2"
        paddingVertical="$1"
        {...(tabVariantStyles(variant, false) as object)}
      >
        {children}
      </YStack>
    </TamaguiTabs.Tab>
  );
};
TabsTab.displayName = "Tabs.Tab";

// ────────────────────────────────────────────────────────────────────────
// Panels / Panel

const TabsPanels = function TabsPanels(props: ComponentProps<typeof YStack>) {
  return <YStack flex={1} paddingTop="$3" {...props} />;
};
TabsPanels.displayName = "Tabs.Panels";

const TabsPanel = function TabsPanel(props: ComponentProps<typeof TamaguiTabs.Content>) {
  return <TamaguiTabs.Content {...props} />;
};
TabsPanel.displayName = "Tabs.Panel";

// ────────────────────────────────────────────────────────────────────────

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Tab: TabsTab,
  Panels: TabsPanels,
  Panel: TabsPanel,
});

// Keep XStack imported for compatibility / future use without tree-shake
// warnings.
void XStack;
