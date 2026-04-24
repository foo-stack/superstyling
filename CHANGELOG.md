# Changelog

Narrative release notes for the `@superstyling/*` monorepo. Per-package
`CHANGELOG.md` files are generated automatically by the Changesets bot on the
"Version Packages" release PR.

## v0.2.0 — unreleased

Chakra-shaped migration target. v0.2 closes the gap between "Chakra-like"
and "I can move a real Chakra app over in an afternoon": 21 new components,
10 new hooks, a Chakra theme adapter, and a codemod that rewrites imports,
providers, and `extendTheme(...)` call sites automatically.

### Packages

- `@superstyling/core` 0.1.0 → 0.2.0
- `@superstyling/icons` 0.1.0 → 0.2.0
- `@superstyling/next` 0.1.0 → 0.2.0
- `@superstyling/expo` 0.1.0 → 0.2.0
- `@superstyling/vite` 0.1.0 → 0.2.0
- `@superstyling/codemod` **new** — published at 0.2.0

### New components (21)

| Group            | Components                                                                                                                                                                                                                                                                                                                                                              |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Layout           | `Flex`, `Center`, `Container`, `Spacer`, `AspectRatio`, `Grid` · `GridItem`, `SimpleGrid`, `Wrap` · `WrapItem`                                                                                                                                                                                                                                                          |
| Typography       | `Code`, `Kbd`                                                                                                                                                                                                                                                                                                                                                           |
| Data display     | `Tag` (root · `.Label` · `.CloseButton` · `.LeftIcon` · `.RightIcon`), `Image` (`fallback`, `fallbackSrc`, `objectFit`), `List` · `OrderedList` · `UnorderedList` · `ListItem` · `ListIcon`, `Table` (root · `.Thead` · `.Tbody` · `.Tfoot` · `.Tr` · `.Th` · `.Td` · `.Caption` + `TableContainer`), `Stat` (`.Label` · `.Number` · `.HelpText` · `.Arrow` · `.Group`) |
| Feedback         | `Progress`, `CircularProgress` (+ `.Label`), `Skeleton` · `SkeletonCircle` · `SkeletonText`                                                                                                                                                                                                                                                                             |
| Overlay          | `Drawer`, `Tooltip`, `Popover`, `Menu` (↑/↓/Home/End/Enter/Esc keyboard nav), `AlertDialog` (+ `leastDestructiveRef`)                                                                                                                                                                                                                                                   |
| Navigation       | `Tabs` (4 variants · horizontal/vertical), `Accordion` (+ `allowMultiple`), `Breadcrumb` (auto-separators + `isCurrentPage`), `Stepper` (+ `useSteps` hook)                                                                                                                                                                                                             |
| Transitions      | `Fade`, `ScaleFade`, `Slide` (4 directions), `Collapse`                                                                                                                                                                                                                                                                                                                 |
| Forms — advanced | `NumberInput` (↑/↓ step · Shift+↑/↓ 10×), `PinInput` (auto-advance + paste-spread · `number` / `alphanumeric` / `mask`), `Slider` · `RangeSlider`, `Editable` (+ `useEditableControls`)                                                                                                                                                                                 |
| Interactive      | `InputGroup` (+ Left/Right Element · Addon), `ButtonGroup` (+ `isAttached`), `CheckboxGroup`, `CloseButton`                                                                                                                                                                                                                                                             |
| Toast            | `useToast()` (cross-platform Tamagui queue, portal-rendered), `useNativeToast()` (dynamic-imports `burnt` on iOS/Android, falls back to Tamagui on web)                                                                                                                                                                                                                 |

### Hooks — Chakra parity (10)

`useDisclosure`, `useBoolean`, `useControllableState`, `useMergeRefs`,
`useMediaQuery` (web), `useBreakpointValue` (cross-platform via Tamagui
`useMedia`), `useClipboard` (web `navigator.clipboard` / native dynamic
import `@react-native-clipboard/clipboard`), `useTheme`, `useToken`,
`useOutsideClick`.

### Theme migration helpers

- `adaptChakraTheme(chakraTheme)` — pass-through for matching fields;
  drops `styles.global`, `layerStyles`, `textStyles` with warnings;
  flags function-valued `baseStyle` / `sizes` / `variants`
  (StyleFunctionProps) and skips them rather than silently misbehaving.
- `defineStyleConfig` — identity helper matching Chakra's API.
- `defineMultiStyleConfig` — shallow-flattens part-keyed style maps into a
  single `ComponentOverride` (per-part targeting deferred).

### `@superstyling/codemod`

```bash
yarn dlx @superstyling/codemod ./src --dry
yarn dlx @superstyling/codemod ./src
```

Three passes per file:

1. **imports** — `@chakra-ui/react` → `@superstyling/core`; `@chakra-ui/icons`
   → `@superstyling/icons`; unmapped `@chakra-ui/theme-tools`,
   `@chakra-ui/styled-system`, `@chakra-ui/anatomy`, `@chakra-ui/cli`
   flagged with `TODO(superstyling)` comments.
2. **provider** — `<ChakraProvider>` / `<ChakraBaseProvider>` →
   `<SuperStylingProvider>` (both import specifier and JSX element);
   `theme` prop → `system` prop.
3. **theme** — `extendTheme({...})` →
   `createSystem(adaptChakraTheme({...}).theme)` with auto-inserted
   `@superstyling/core` imports. Multi-arg calls preserved via
   `Object.assign({}, ...args)`. `extendBaseTheme`,
   `withDefaultColorScheme`, `withDefaultSize`, `withDefaultVariant`
   flagged as manual-convert.

Every file's changes go through a `Report` object; the CLI prints a
summary at the end (`Rewrites: N · TODOs: N · Files touched: N`) plus a
line-by-line TODO list. `jscodeshift` is contained to this workspace —
no runtime-package weight.

### New infrastructure

- `SystemContext` added to `<SuperStylingProvider>` so `useTheme()` /
  `useToken()` read the active system without prop-drilling.
- New docs surfaces: `/hooks/*`, `/theming/*`, `/migration/*` routes.

### Quality gates shipped

- **Tests:** 223 passing across 25 suites (up from 150 in v0.1.0).
- **Docs:** 76 static HTML pages (up from 28 at v0.1.0 launch).
- **Typecheck:** 13 workspaces (was 12 — new `@superstyling/codemod`).
- **New runtime deps:** `@tamagui/progress` + `@tamagui/slider` (both from
  the existing Tamagui stack — no third-party additions).

### Migration guide

See `/migration/from-chakra-v2` for side-by-side examples and the complete
list of what the codemod cannot automate.

## v0.1.0 — unreleased

First public release. Fixed versioning: all `@superstyling/*` packages are
bumped together.

### What's in v0.1.0

**A cross-platform React component library that borrows Chakra UI's
developer experience and renders through Tamagui v2.** One component tree
runs on web (react-native-web + atomic CSS), iOS, and Android; style props
compile to flat StyleSheet on native; theme tokens are typed end-to-end.

### Packages

- `@superstyling/core` — 20 components, theme system, style-prop translator,
  color mode, overlay registry, `createSystem()`, `SuperStylingProvider`.
- `@superstyling/icons` — 21 icons (chevrons, arrows, close, check, plus,
  minus, info, warning, error, search, menu, settings, more, edit, trash,
  external-link, sun, moon, checkcircle), plus `createIcon()` factory.
- `@superstyling/next` — Next.js 14/15 integration with App Router and Pages
  Router entry points. `withSuperStyling(config)(nextConfig)` wraps
  `@tamagui/next-plugin`. `<ColorModeScript>` for FOUC-free mode init on both
  routers; `SuperStylingDocument` drop-in for Pages Router.
- `@superstyling/expo` — Expo SDK 54+ integration. Six subpath entries:
  `/setup` (required native setup-teleport/gesture-handler/worklets/safe-area/
  keyboard), `/setup-all` (adds linear-gradient/burnt/zeego), `/babel-plugin`
  (with `@tamagui/babel-plugin` + worklets-last ordering), `/metro-config`
  (flags + `@tamagui/metro-plugin`), `/app-plugin` (Expo config-plugin shell).
- `@superstyling/vite` — Vite integration. `superstylingVitePlugin()` wraps
  `@tamagui/vite-plugin` with dev-deps hints and RNW aliasing;
  `superstylingAliases()` for manual alias ordering; `colorModeScriptSnippet()`
  for FOUC-free mode init.

### Components (20)

| Group       | Components                                                                                                                                                          |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Layout      | `Box`, `Stack` · `HStack` · `VStack`, `Divider`                                                                                                                     |
| Typography  | `Text`, `Heading` (levels 1–6)                                                                                                                                      |
| Feedback    | `Spinner`, `Badge`, `Alert` (5 statuses × 4 variants)                                                                                                               |
| Media       | `Avatar` (root, `.Image`, `.Fallback`)                                                                                                                              |
| Interactive | `Button` (4 variants × 4 sizes × colorScheme × icons × loading), `IconButton`, `Link`                                                                               |
| Overlay     | `Modal` (root, `.Overlay`, `.Content`, `.Header`, `.Title`, `.CloseButton`, `.Body`, `.Footer`; 11 sizes × 6 motion presets)                                        |
| Forms       | `FormControl` (root, `.Label`, `.HelperText`, `.ErrorMessage`), `Input`, `Textarea`, `Checkbox`, `Radio` · `RadioGroup`, `Switch`, `Select` (Adapt+Sheet on mobile) |

### Style API

- Chakra-style style props on every primitive (`padding="$4"`,
  `backgroundColor="$primary"`, `borderRadius={8}`).
- Pseudo props (`_hover`, `_focus`, `_focusVisible`, `_active`, `_pressed`,
  `_disabled`).
- `sx` escape hatch that wins over inline props.
- Responsive object form — `padding={{ base: "$2", md: "$6" }}`.
- Chakra shortcut map (`bg` → `backgroundColor`, `m` → `margin`, etc.).

### Theme system

- `createSystem(input)` builds a fully-typed theme + Tamagui config.
- Chakra-default palette (10 color scales × 11 shades each), spacing,
  breakpoints, semantic tokens, component overrides.
- Light/dark mode with `useColorMode()` + `useColorModeValue()`, persisted via
  `localStorage` (web) / `AsyncStorage` (native) / cookie (SSR).
- `ColorModeScript` blocking-init helpers in `@superstyling/next` and
  `@superstyling/vite` to eliminate FOUC.
- Overlay registry on top of Tamagui's `useStackedZIndex` for dismiss-order
  control.

### Quality gates shipped

- **Tests:** 150 Vitest tests across 16 suites (component web tests, theme
  resolver, style-prop translator, color-mode script, CLI generator, Tamagui
  integration smoke tests).
- **Docs:** Vocs-based docs site at `apps/docs` with 16 component pages, 5
  worked examples (login, settings, form validation, theming, color mode), 3
  Getting Started guides (Next, Expo, Vite), landing page via Vocs's
  `HomePage` components. SSG build produces 28 prerendered HTML files.
- **Playground:** `apps/playground` (Expo + Expo Router) with every primitive
  exercised on every variant × size × color scheme × state.
- **Dogfood:** `apps/todo-example` — full TODO-with-auth app built from only
  Superstyling primitives. Captured 3 rough-edge findings in its README.
- **E2E:** 3 Maestro flow files for Modal open/close, form submit validation,
  color-mode toggle.
- **CI:** fast lane (lint, typecheck, build, Vitest, Jest native, Playwright,
  changeset-check) + slow lane (Maestro iOS + Android) + nightly matrix.

### Deferred to v0.2

- Standalone example apps (login, settings, etc. as clonable starters — the
  Phase 7 `/examples/*` docs pages are interactive showcases, not standalone
  projects).
- Live code editing via Sandpack (v0.1 ships static code blocks + live
  previews).
- Screen-reader verification sweep across every component.
- Tamagui-v2 strict-type augmentation compat (dogfood finding #1 in
  `apps/todo-example/README.md`).
- `react-native-web` documented as a hard dep in the Vite Getting Started
  guide (dogfood finding #2).

### Breaking-change policy

This is a pre-1.0 release. Every breaking API change during the `0.y.z`
series will bump the minor (`y`). Breaking changes are allowed; silent
behavior changes are not.
