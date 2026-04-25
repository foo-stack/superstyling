"use client";

import { useColorMode, IconButton } from "@superstyling/core";
import { MoonIcon, SunIcon } from "@superstyling/icons";

/**
 * ColorModeToggle — single icon button that flips between `light` and
 * `dark`. We deliberately don't expose the `system` mode here because the
 * top-nav has only one slot for this; users who want OS-tracking can set
 * it once via `<SuperStylingProvider initialColorMode="system">`.
 */
export function ColorModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  return (
    <IconButton
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      icon={isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
      onPress={toggleColorMode}
      variant="ghost"
      size="sm"
    />
  );
}
