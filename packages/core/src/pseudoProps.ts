/**
 * Pseudo-prop translation: Chakra `_hover`/`_focus`/... → Tamagui's style props.
 *
 * Per PLAN.md §3.4 / Q14, we ship:
 *   - A cross-platform set that is guaranteed to work on web + iOS + Android
 *   - A web-only set that is typed as such and silently no-ops on native
 *
 * The translation happens at runtime in `translateProps()` (one call per
 * component render). A compiler plugin that does this at build time is
 * flagged in PLAN.md §9 as a v0.2+ optimization.
 */

/**
 * Cross-platform pseudo-props. Every key here has a direct Tamagui analogue
 * that works on both web and native.
 */
export const crossPlatformPseudoPropMap = {
  _hover: "hoverStyle",
  _focus: "focusStyle",
  _focusVisible: "focusVisibleStyle",
  _focusWithin: "focusWithinStyle",
  _active: "pressStyle",
  _pressed: "pressStyle",
  _disabled: "disabledStyle",
} as const satisfies Record<string, string>;

/**
 * Pseudo-props that rely on CSS features unavailable on React Native. These
 * pass through to the same Tamagui prop on web (where Tamagui maps them to
 * the appropriate selector), but silently no-op on native.
 */
export const webOnlyPseudoPropMap = {
  _before: "beforeStyle",
  _after: "afterStyle",
  _placeholder: "placeholderStyle",
  _selection: "selectionStyle",
  _groupHover: "groupHoverStyle",
  _groupFocus: "groupFocusStyle",
  _peerHover: "peerHoverStyle",
  _peerFocus: "peerFocusStyle",
  _rtl: "rtlStyle",
  _ltr: "ltrStyle",
} as const satisfies Record<string, string>;

/**
 * ARIA-state pseudo-props. These attach to the same `<data-X>`/`aria-X`
 * attribute convention we saw across Radix + Gluestack + Chakra v2 in the
 * Phase 0 audit. v0.1 skeleton maps the ones Tamagui has direct support for;
 * others are listed and deferred to the style-engine extension in P2 followups.
 */
export const ariaStatePseudoPropMap = {
  _checked: "checkedStyle",
  _invalid: "invalidStyle",
  _readOnly: "readOnlyStyle",
  _required: "requiredStyle",
  _selected: "selectedStyle",
  _expanded: "expandedStyle",
  _first: "firstStyle",
  _last: "lastStyle",
  _dark: "darkStyle",
  _light: "lightStyle",
} as const satisfies Record<string, string>;

/** The full translation map used by `translateProps()`. */
export const pseudoPropMap: Readonly<Record<string, string>> = {
  ...crossPlatformPseudoPropMap,
  ...webOnlyPseudoPropMap,
  ...ariaStatePseudoPropMap,
};

export type PseudoPropName = keyof typeof pseudoPropMap;
