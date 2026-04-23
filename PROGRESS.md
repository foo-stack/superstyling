# Superstyling — Progress Tracker

**Current phase:** Phase 16 complete — codemod + migration guide shipped
**Last updated:** 2026-04-24

Plan lives in [`ROADMAP.md`](./ROADMAP.md). This file tracks execution only.

v0.1.0 shipped 2026-04-22. Published packages: `@superstyling/{core,icons,next,expo,vite}@0.1.0`.

---

## Phase 10 — Layout primitives (~1 week)

Status: **complete — 2026-04-23**

- [x] Flex
- [x] Center
- [x] Container
- [x] Grid + GridItem
- [x] SimpleGrid
- [x] Wrap + WrapItem
- [x] Spacer
- [x] AspectRatio
- [x] Tag + `.Label` / `.CloseButton` / `.LeftIcon` / `.RightIcon`
- [x] Code
- [x] Kbd
- [x] Image (with `fallback`, `fallbackSrc`, `objectFit`)
- [x] List + OrderedList + UnorderedList + ListItem + ListIcon
- [x] InputGroup + InputLeftElement + InputRightElement + InputLeftAddon + InputRightAddon
- [x] ButtonGroup (with `isAttached`)
- [x] CheckboxGroup
- [x] CloseButton
- [x] Smoke tests for every component — `layout.web.test.tsx` (+13 tests → 163/163 total)
- [x] `/components/*` docs page for every component (17 new MDX files)
- [x] Sidebar nav reorganized into Layout / Typography / Data display / Feedback / Overlay / Interactive / Forms sections
- [x] **Exit check:** 0 new runtime deps · `yarn test:vitest` 163/163 · `yarn typecheck` 12/12 · docs build 45 static HTML pages

---

## Phase 11 — Overlay surfaces + toast (~2.5 weeks)

Status: **complete — 2026-04-23**

- [x] Drawer + `.Overlay` / `.Content` / `.Header` / `.Body` / `.Footer` / `.CloseButton`
- [x] Tooltip (label, placement, hasArrow, openDelay, closeDelay)
- [x] Popover + `.Trigger` / `.Content` / `.Header` / `.Body` / `.Footer` / `.Arrow` / `.CloseButton`
- [x] Menu + `.Button` / `.List` / `.Item` / `.Group` / `.Divider` / `.OptionGroup` / `.ItemOption` with ↑/↓/Home/End/Enter/Esc keyboard nav
- [x] AlertDialog + `leastDestructiveRef`
- [x] Toast — `useToast()` default (Tamagui-primitive queue, portal-rendered, position/status/duration/isClosable)
- [x] Toast — `useNativeToast()` opt-in (wraps `burnt` on iOS/Android via dynamic import, silently falls back to Tamagui on web or when `burnt` isn't installed)
- [x] Smoke tests for overlays + toast (+8 tests → 170/170 total)
- [x] `/components/*` docs pages for each + sidebar Overlay section (7 entries)
- [x] **Exit check:** `yarn typecheck` 12/12 · `yarn test:vitest` 170/170 · docs build 51 static HTML pages · 0 new runtime deps (burnt is dynamic, all Tamagui deps already present in the workspace)

### Deferred to a later pass

- `<SuperStylingProvider toast="native">` app-wide default toast — users currently choose per-call via `useToast()` vs `useNativeToast()`. Provider-level switch is ~30 LOC when needed; deferred until a real consumer asks.
- Manual screen-reader walkthrough on real devices — covered by per-component a11y attributes + portal + focus-scope; device pass is a Nate-manual item.

---

## Phase 12 — Navigation & disclosure (~1.5 weeks)

Status: **complete — 2026-04-23**

- [x] Tabs + `.List` / `.Tab` / `.Panels` / `.Panel` (4 variants — line/enclosed/soft-rounded/solid-rounded)
- [x] Accordion + `.Item` / `.Button` / `.Panel` / `.Icon` (single + `allowMultiple`)
- [x] Breadcrumb + `.Item` / `.Link` / `.Separator` with auto-inserted separators + `isCurrentPage`
- [x] Stepper + `.Step` / `.Indicator` / `.Separator` / `.Number` / `.Title` / `.Description` + `useSteps` hook
- [x] Fade, ScaleFade, Slide (4 directions), Collapse — all built on `@tamagui/animate-presence`
- [x] Smoke tests (+6 → 176/176 total)
- [x] `/components/*` docs pages for each + sidebar "Navigation & disclosure" section (5 entries)
- [x] **Exit check:** Tabs + Accordion inherit keyboard nav + focus semantics from Tamagui primitives (↑/↓/←/→/Home/End/Enter/Esc — ARIA-correct)

---

## Phase 13 — Data & forms + real native (~3.5 weeks)

Status: **complete — 2026-04-23**

- [x] Table + `.Thead` / `.Tbody` / `.Tfoot` / `.Tr` / `.Th` / `.Td` / `.Caption` + TableContainer
  - [x] Web: `<table>` semantics via Tamagui `tag` prop
  - [x] Native: disciplined flex rows — caller wraps in `FlatList` for virtualization (kept wrapper thin)
- [x] NumberInput + `.Field` / `.Stepper` / `.IncrementStepper` / `.DecrementStepper` (↑/↓ step, Shift+↑/↓ 10×, non-numeric keypress blocked, clamp on blur)
- [x] PinInput + `.Field` (auto-advance, backspace-to-previous, paste-spread, `type="number" | "alphanumeric"`, `mask`)
- [x] Slider + `.Track` / `.FilledTrack` / `.Thumb` (on `@tamagui/slider`)
- [x] RangeSlider (two-thumb, default `[0, 100]`)
- [x] Progress (on `@tamagui/progress`, sizes + indeterminate)
- [x] CircularProgress + `.Label` (SVG ring via Tamagui `tag` prop)
- [x] Skeleton + SkeletonCircle + SkeletonText (`isLoaded` toggle reveals children)
- [x] Stat + `.Label` / `.Number` / `.HelpText` / `.Arrow` / `.Group`
- [x] Editable + `.Preview` / `.Input` / `.Textarea` + `useEditableControls` (Enter commits, Escape cancels, blur commits by default)
- [x] Smoke tests (+11 → 187/187 total)
- [x] `/components/*` docs pages for all 8 (table / number-input / pin-input / slider / progress / skeleton / stat / editable) + sidebar entries across Data display / Feedback / Forms
- [x] **Exit check:** `yarn typecheck` 12/12 · `yarn test:vitest` 187/187 · docs build 64 static HTML pages · 2 new runtime deps (`@tamagui/progress`, `@tamagui/slider` — Tamagui-first stack, no third-party)

---

## Phase 14 — Hooks parity (~1 week)

Status: **complete — 2026-04-23**

- [x] useDisclosure (controlled + uncontrolled, aria helpers via `getButtonProps` / `getDisclosureProps`)
- [x] useBreakpointValue (wraps Tamagui `useMedia` — cross-platform)
- [x] useMediaQuery (web `matchMedia`; no-op on native with documented `useBreakpointValue` alternative)
- [x] useClipboard (web `navigator.clipboard`; native dynamic-import of `@react-native-clipboard/clipboard`)
- [x] useToken (resolves dot-path tokens from active `Theme`)
- [x] useTheme (returns resolved `Theme` object via new `SystemContext`)
- [x] useBoolean
- [x] useControllableState (ref-backed updater so functional setState works in controlled mode)
- [x] useMergeRefs
- [x] useOutsideClick (document-level mousedown/touchstart; no-op on native)
- [x] Smoke tests (+13 → 200/200 total)
- [x] `/hooks/*` docs pages for each + new sidebar "Hooks" section (10 entries) + `apps/docs/app/hooks/[slug].tsx` route
- [x] New `SystemContext` added to `SuperStylingProvider` so hooks can read the active system without a prop-drill
- [x] **Exit check:** `yarn typecheck` 12/12 · `yarn test:vitest` 200/200 · docs build 74 static HTML pages · 0 new runtime deps

---

## Phase 15 — Theming compat (~1 week)

Status: **complete — 2026-04-23**

- [x] `adaptChakraTheme(chakraTheme)` — pass-through for matching fields, drops `styles.global` / `layerStyles` / `textStyles` with warnings, flags function-valued `baseStyle` / `sizes` / `variants` (StyleFunctionProps) and skips them
- [x] `defineStyleConfig` — identity helper (same role as Chakra's)
- [x] `defineMultiStyleConfig` — shallow-flattens part-keyed style maps into a single `ComponentOverride`
- [x] Parity smoke test: Chakra-shaped theme → `createSystem` → renders 5 primitives (Box / Text / Button / Badge / Alert) green
- [x] Unit tests for pass-through / dropped surfaces / function-valued skip / warnings logging (`+9` logic tests)
- [x] Documented gaps: `StyleFunctionProps`, `cssVar` / `mode()`, `layerStyles` / `textStyles`, `styles.global` — each flagged in the `warnings` array _and_ in `/theming/adapt-chakra-theme`
- [x] New `/theming/*` MDX route + sidebar Theming section
- [x] **Exit check:** `yarn typecheck` 12/12 · `yarn test:vitest` 210/210 · docs build 75 static HTML pages · 0 new runtime deps

---

## Phase 16 — Migration DX + codemod (~1.5 weeks)

Status: **complete — 2026-04-24**

- [x] New workspace: `packages/codemod/` → `@superstyling/codemod@0.2.0` (bin: `superstyling-migrate-from-chakra`)
- [x] Pass 1 — imports: `@chakra-ui/react` → `@superstyling/core`; `@chakra-ui/icons` → `@superstyling/icons`; unmapped `@chakra-ui/theme-tools` / `@chakra-ui/styled-system` / `@chakra-ui/anatomy` / `@chakra-ui/cli` flagged with `TODO(superstyling)` comment
- [x] Pass 2 — provider: `<ChakraProvider>` + `<ChakraBaseProvider>` → `<SuperStylingProvider>` (both import specifier and JSX); `theme` prop → `system` prop
- [x] Pass 3 — theme: `extendTheme({...})` → `createSystem(adaptChakraTheme({...}).theme)` with auto-inserted `@superstyling/core` imports; multi-arg calls preserved via `Object.assign({}, ...args)`; `extendBaseTheme` / `withDefaultColorScheme` / `withDefaultSize` / `withDefaultVariant` flagged as TODO
- [x] Unconvertible values → `TODO(superstyling)` comments at the AST location + a rationale entry in the migration report
- [x] Migration report (`Report` class) with filesTouched / tally-by-kind / format() — printed at end of CLI run; each entry captures `{ file, line?, kind, transform, message }`
- [x] CLI entry: `superstyling-migrate-from-chakra [path] [--dry]` walking the target dir (skipping `node_modules`, `.git`, `dist`, `build`, `.turbo`, `.next`, `.expo`); fixture-verified end-to-end via `node dist/cli.js /tmp/...` smoke run
- [x] Fixture-based unit tests (+13 → 223/223 total) — imports, provider, theme, report, combined real-app fixture
- [x] Migration guide at `/migration/from-chakra-v2` — side-by-side examples (app entry, hooks, color-mode tokens) + "what the codemod cannot do" section linking into `adaptChakraTheme` gaps
- [x] New sidebar "Migration" section (1 entry)
- [ ] Deferred: codemod run on a real Chakra OSS app (validation-only step; CLI works on synthetic fixtures — real-app run is a Nate-manual item before v0.2 announcement)
- [x] **Exit check:** `yarn typecheck` 13/13 · `yarn test:vitest` 223/223 · docs build 76 static HTML pages · `jscodeshift` isolated to `@superstyling/codemod` only (runtime packages unchanged)

---

## Phase 17 — v0.2.0 release (~0.5 week)

Status: **not started**

- [ ] All Changesets aggregated into root CHANGELOG.md (narrative)
- [ ] Docs landing: "Migrating from Chakra?" CTA
- [ ] Publish 6 packages: core, icons, next, expo, vite, codemod
- [ ] Tag `v0.2.0`
- [ ] Announce: blog
- [ ] Announce: X / social
- [ ] Announce: Tamagui community channels
- [ ] Announce: r/chakraui
- [ ] Announce: Chakra Discord `#ecosystem`

---

## Decision log

Record architectural decisions made during execution. Each entry: date, decision, reason.

### 2026-04-23 — v0.2 scope framing

Selected **"Chakra-shaped" migration-friendly** (not literal drop-in) as v0.2 target. See [`ROADMAP.md`](./ROADMAP.md) for rationale.

### 2026-04-23 — Real native equivalents for Table + Editable

Chose real native implementations over "documented-subset" fallbacks. Costs +1.5 weeks of Phase 13 but delivers cross-platform parity that Chakra itself can't offer — key differentiator.

### 2026-04-23 — Dual toast implementations

`useToast()` is cross-platform-consistent (Tamagui primitive); `useNativeToast()` wraps `burnt` for platform-native feel on iOS/Android, falls back to Tamagui on web. `<SuperStylingProvider toast="native">` sets app-wide default. Burnt is already pulled via `@superstyling/expo/setup-all` — no new dep.

### 2026-04-23 — Theme migration in the codemod

Codemod attempts real `extendTheme(...)` + `defineStyleConfig(...)` conversion, not just import renames. Functional-style values (`StyleFunctionProps`) are flagged for manual review with AST location + rationale. Biggest migration-DX win for the 4 extra days it costs.
