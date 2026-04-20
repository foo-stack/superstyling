import { createTamagui } from "tamagui";
import { defaultConfig as v4Defaults } from "@tamagui/config/v4";
import type { Theme, ThemeInput } from "./theme/types";
import { mergeTheme } from "./theme/merge";
import { resolveTheme } from "./theme/resolver";
import { buildFonts } from "./theme/fonts";
import { chakraShortcuts } from "./shortcuts";
import { bindComponent } from "./components/bindComponent";
import { Box as BaseBox, type BoxProps } from "./components/Box";
import {
  Stack as BaseStack,
  HStack as BaseHStack,
  VStack as BaseVStack,
  type StackProps,
} from "./components/Stack";
import { Text as BaseText, type TextProps } from "./components/Text";
import { Heading as BaseHeading, type HeadingProps } from "./components/Heading";
import type { ComponentType } from "react";

/**
 * The system object produced by `createSystem()`.
 *
 * Contains:
 *   - `config`:  Tamagui config for `<SuperStylingProvider>`.
 *   - `theme`:   The fully-merged Chakra-shaped theme.
 *   - Bound primitive components (Box, Stack, HStack, VStack, Text, Heading).
 *     When `theme.components.<Name>` override exists, the bound version
 *     merges it into every instance; otherwise the base component is
 *     returned by reference unchanged.
 *
 * Users typically re-export these from their `system.ts`:
 *   ```ts
 *   export const system = createSystem({ components: {...} });
 *   export const { Box, Text, Heading } = system;
 *   ```
 */
export interface System {
  config: ReturnType<typeof createTamagui>;
  theme: Theme;
  Box: ComponentType<BoxProps>;
  Stack: ComponentType<StackProps>;
  HStack: ComponentType<Omit<StackProps, "direction">>;
  VStack: ComponentType<Omit<StackProps, "direction">>;
  Text: ComponentType<TextProps>;
  Heading: ComponentType<HeadingProps>;
}

/**
 * Build a typed system from a Chakra-shaped theme input.
 *
 * Passing nothing returns the default system (Chakra-default palette, spacing,
 * and semantic tokens). Any field in `input` replaces/extends the default.
 *
 * Per Q23 (PLAN.md §3.7), this is the intended build-time expansion surface:
 * every style prop, every component variant, every `colorScheme` resolution
 * will eventually be expanded here so the runtime sees pre-computed Tamagui
 * variants.
 */
export function createSystem(input: ThemeInput = {}): System {
  const theme = mergeTheme(input);
  const resolved = resolveTheme(theme);

  const config = createTamagui({
    // Inherit animations from @tamagui/config/v4. `shorthands`, `fonts`,
    // `tokens`, `themes`, and `media` are all derived from the user's Chakra-
    // shaped theme — no inheritance from v4 on those axes.
    ...v4Defaults,
    shorthands: chakraShortcuts,
    fonts: buildFonts(theme),
    tokens: {
      ...v4Defaults.tokens,
      color: resolved.tokens.color,
      space: resolved.tokens.space,
      size: resolved.tokens.size,
      radius: resolved.tokens.radius,
      // Keep v4's default numeric zIndex tokens — Tamagui v2 requires zIndex
      // keys to be a subset of size keys. Our semantic zIndices (modal,
      // tooltip, etc.) live on `theme.zIndices` for direct consumer use and
      // are wired into the OverlayRegistry; they are intentionally not a
      // Tamagui style-prop surface.
    },
    themes: resolved.themes,
    media: resolved.media,
    settings: {
      ...v4Defaults.settings,
      defaultFont: resolved.settings.defaultFont,
    },
  });

  return {
    config,
    theme,
    Box: bindComponent(BaseBox, theme.components.Box) as unknown as ComponentType<BoxProps>,
    Stack: bindComponent(BaseStack, theme.components.Stack) as unknown as ComponentType<StackProps>,
    HStack: bindComponent(BaseHStack, theme.components.HStack) as unknown as ComponentType<
      Omit<StackProps, "direction">
    >,
    VStack: bindComponent(BaseVStack, theme.components.VStack) as unknown as ComponentType<
      Omit<StackProps, "direction">
    >,
    Text: bindComponent(BaseText, theme.components.Text) as unknown as ComponentType<TextProps>,
    Heading: bindComponent(
      BaseHeading,
      theme.components.Heading,
    ) as unknown as ComponentType<HeadingProps>,
  };
}

/** The zero-config default system (Chakra-default theme, no overrides). */
export const defaultSystem: System = createSystem();
