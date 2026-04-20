/**
 * Chakra-style shortcut props, mapped to their full property names.
 *
 * These are registered in Tamagui's `shorthands` config at `createSystem()`
 * time (per PLAN.md §3.4 / Q13). Registration is free at runtime and
 * compile-time extractable — the Tamagui compiler sees `p={4}` exactly as if
 * the user had written `padding={4}`.
 *
 * The full Chakra v2 shortcut surface is recreated here, including:
 *   - Directional + logical (RTL-aware) margins/padding: `me/ms/pe/ps`
 *   - Standard margin/padding + horizontal/vertical composites
 *   - Size shortcuts: `w/h/minW/maxW/minH/maxH`
 *   - Color + background shortcuts
 *   - Border shortcuts
 *   - Layout + positioning
 *
 * Web-only shortcuts (e.g., `bgGradient`) are marked in comments. They pass
 * through to Tamagui but have no effect on native.
 *
 * Cross-reference: the Chakra v2 style-props audit in our prior-art notes
 * documents this full list with the long-form names.
 */
export const chakraShortcuts = {
  // Margin
  m: "margin",
  mt: "marginTop",
  mr: "marginRight",
  mb: "marginBottom",
  ml: "marginLeft",
  ms: "marginStart",
  me: "marginEnd",
  mx: "marginHorizontal",
  my: "marginVertical",

  // Padding
  p: "padding",
  pt: "paddingTop",
  pr: "paddingRight",
  pb: "paddingBottom",
  pl: "paddingLeft",
  ps: "paddingStart",
  pe: "paddingEnd",
  px: "paddingHorizontal",
  py: "paddingVertical",

  // Size
  w: "width",
  h: "height",
  minW: "minWidth",
  maxW: "maxWidth",
  minH: "minHeight",
  maxH: "maxHeight",

  // Color + background
  bg: "backgroundColor",
  bgColor: "backgroundColor",

  // Border
  borderStart: "borderStartColor",
  borderEnd: "borderEndColor",
  rounded: "borderRadius",
  roundedTop: "borderTopStartRadius",
  roundedBottom: "borderBottomStartRadius",
  roundedLeft: "borderTopLeftRadius",
  roundedRight: "borderTopRightRadius",
  roundedTopLeft: "borderTopLeftRadius",
  roundedTopRight: "borderTopRightRadius",
  roundedBottomLeft: "borderBottomLeftRadius",
  roundedBottomRight: "borderBottomRightRadius",
  roundedTopStart: "borderTopStartRadius",
  roundedTopEnd: "borderTopEndRadius",
  roundedBottomStart: "borderBottomStartRadius",
  roundedBottomEnd: "borderBottomEndRadius",

  // Shadow
  shadow: "boxShadow",
  textShadow: "textShadow",

  // Position
  pos: "position",

  // Flexbox shortcuts
  flexDir: "flexDirection",

  // Typography (Chakra has no shortcuts here — long names already short)
  // Grid (Chakra shortcut: gap aliases)
  // Note: `gap` exists natively in RN 0.71+ so no shorthand needed.
} as const satisfies Record<string, string>;

export type ChakraShortcutName = keyof typeof chakraShortcuts;
export type ChakraShortcutMap = typeof chakraShortcuts;
