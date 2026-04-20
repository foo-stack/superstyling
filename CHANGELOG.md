# Changelog

Narrative release notes for the `@superstyling/*` monorepo. Per-package
`CHANGELOG.md` files are generated automatically by the Changesets bot on the
"Version Packages" release PR.

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
