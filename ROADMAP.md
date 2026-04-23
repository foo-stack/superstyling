# Superstyling — v0.2 Roadmap

**Target:** Chakra-v2 migration-friendly. 80% of Chakra's common surface, documented migration guide for the rest. Not a literal drop-in; users run a codemod + skim a migration guide.

**Timebox:** ~12.5 focused weeks from Phase 10 kickoff. Phases 10–15 are largely independent and can interleave; 16 + 17 gate on the rest.

**Status:** plan locked 2026-04-23, execution tracked in [`PROGRESS.md`](./PROGRESS.md).

---

## Why this target, not "literal drop-in"

Literal `yarn remove @chakra-ui/react && yarn add @superstyling/core` parity means matching ~60 components, ~30 hooks, and the full `extendTheme` surface — including edge cases like `StyleFunctionProps`-based runtime-computed styles. Realistic ceiling for a solo maintainer: 6–12 months of pure parity grind, most of it ferreting out behavioral edge cases rather than building new capability.

"Migration-friendly" gets us to 80% of the value at ~2.5 months: a codemod + migration guide bridge the remaining gap, users trade small adjustments for native-platform support Chakra can never offer.

---

## Scope decisions (made 2026-04-23)

Three fork-in-the-road calls that shape the phases below:

1. **Real native equivalents for historically web-only components.** `Table` and `Editable` get full native implementations (FlatList-grid + RN `TextInput`-swap), not documented subsets. Costs ~1.5 weeks but delivers the cross-platform promise Chakra can't match.
2. **Dual toast implementations.** `useToast()` is a consistent cross-platform Tamagui primitive; `useNativeToast()` wraps `burnt` for platform-native feel on iOS/Android. Users choose per app or per call-site. Burnt is already pulled via `@superstyling/expo/setup-all` — no new dep.
3. **Theme migration in the codemod.** Import renames are the easy half; the codemod also parses `extendTheme(...)` + `defineStyleConfig(...)` calls and rewrites them into our `createSystem` / `ComponentOverride` shape. Functional-style values (`StyleFunctionProps`-based) are flagged for manual review with AST location + rationale.

---

## Phases

### Phase 10 — Layout primitives (1 week)

Composition-heavy, fast. No new deps.

- **Flex**, **Center**, **Container**, **Grid**, **GridItem**, **SimpleGrid**, **Wrap**, **WrapItem**, **Spacer**, **AspectRatio**
- **Tag** + `.Label` / `.CloseButton` / `.LeftIcon` / `.RightIcon`
- **Code**, **Kbd**
- **Image** with `fallback` / `fallbackSrc` / `objectFit`
- **List** + **OrderedList**, **UnorderedList**, **ListItem**, **ListIcon**
- **InputGroup** + **InputLeftElement**, **InputRightElement**, **InputLeftAddon**, **InputRightAddon**
- **ButtonGroup** with `isAttached` mode
- **CheckboxGroup** with shared value context
- **CloseButton**

**Exit check:** 17 new component/compounds; smoke tests; `/components/*` docs page each; 0 new runtime deps.

### Phase 11 — Overlay surfaces + toast (2.5 weeks)

Highest-impact category. Built on existing Tamagui overlay primitives; no new deps.

- **Drawer** + `.Overlay` / `.Content` / `.Header` / `.Body` / `.Footer` / `.CloseButton` — Modal internals + `placement` prop + edge-slide motion
- **Tooltip** with `label`, `placement`, `hasArrow`, `openDelay`, `closeDelay`
- **Popover** + `.Trigger` / `.Content` / `.Header` / `.Body` / `.Footer` / `.Arrow` / `.CloseButton`
- **Menu** + `.Button` / `.List` / `.Item` / `.Group` / `.Divider` / `.OptionGroup` / `.ItemOption` — keyboard nav (↑/↓/Enter/Esc)
- **AlertDialog** — Modal + `role="alertdialog"` + `leastDestructiveRef`
- **Toast** — dual implementation:
  - `useToast()` — default, cross-platform consistent (Tamagui primitive)
  - `useNativeToast()` — opt-in, native feel via `burnt` on iOS/Android, falls back to Tamagui on web
  - `<SuperStylingProvider toast="native">` — app-wide default

**Exit check:** every component keyboard-navigates correctly; `useDisclosure` controlled mode works; playground dogfoods a manual screen-reader pass.

### Phase 12 — Navigation & disclosure (1.5 weeks)

- **Tabs** + `.List` / `.Tab` / `.Panels` / `.Panel` — 4 variants (line, enclosed, soft-rounded, solid-rounded)
- **Accordion** + `.Item` / `.Button` / `.Panel` / `.Icon`
- **Breadcrumb** + `.Item` / `.Link` / `.Separator`
- **Stepper** + `.Step` / `.Indicator` / `.Separator` / `.Number` / `.Title` / `.Description`
- **Collapse**, **Fade**, **ScaleFade**, **Slide** — animation wrappers using Tamagui `AnimatePresence`

**Exit check:** focus management + keyboard semantics correct for Tabs + Accordion.

### Phase 13 — Data & forms + native equivalents (3.5 weeks)

Biggest phase. Table and Editable get real native builds.

- **Table** + `.Thead` / `.Tbody` / `.Tr` / `.Th` / `.Td` / `.Caption` / **TableContainer**
  - Web: real `<table>` semantics
  - Native: `FlatList`-based grid with sticky header + horizontal scroll + column-width control
- **NumberInput** + `.Field` / `.Stepper` / `.IncrementStepper` / `.DecrementStepper`
- **PinInput** + `.Field` — auto-advance, paste-spread
- **Slider** + `.Track` / `.FilledTrack` / `.Thumb` + **RangeSlider**
- **Progress** + **CircularProgress** with `Label`
- **Skeleton** + **SkeletonCircle**, **SkeletonText**
- **Stat** + `.Label` / `.Number` / `.HelpText` / `.Arrow` / `.Group`
- **Editable** + `.Preview` / `.Input`
  - Web: click-to-edit
  - Native: `TextInput` swap, commits on blur/Enter, discards on Escape or Android back

**Exit check:** Table handles 10k rows no-lag (virtual on native, native `<table>` on web); NumberInput blocks invalid input; Slider works under keyboard + touch.

### Phase 14 — Hooks parity (1 week)

- **useDisclosure**
- **useBreakpointValue**
- **useMediaQuery**
- **useClipboard**
- **useToken**, **useTheme**
- **useBoolean**
- **useControllableState**
- **useMergeRefs**
- **useOutsideClick**

**Exit check:** every hook has a unit test; docs page per hook with Chakra-equivalent signature diff.

### Phase 15 — Theming compat (1 week)

Adapter so Chakra theme objects load into Superstyling without rewrites.

- **`adaptChakraTheme(chakraTheme)`** — accepts Chakra `extendTheme` output, returns our `ThemeInput`. Handles flat token categories, `semanticTokens` (incl. `_dark` variants), `components` (→ `ComponentOverride`), `breakpoints`, `config.initialColorMode`
- **`defineStyleConfig`** + **`defineMultiStyleConfig`** — re-exports of identity functions so Chakra theme files only need specifier renames
- **Documented gaps** — what we don't support (e.g., `StyleFunctionProps`, `cssVar`, some CSSMap patterns)

**Exit check:** `adaptChakraTheme(realChakraTheme)` renders visually-identical output for 5 component types; no type-explosion in consumer apps.

### Phase 16 — Migration DX + codemod (1.5 weeks)

New package `@superstyling/codemod` (devDep-only, never in runtime graph).

- **Pass 1 — mechanical:** import renames (`@chakra-ui/react` → `@superstyling/core`), `ChakraProvider` → `SuperStylingProvider`, identified per-component prop renames
- **Pass 2 — theme:** detects `extendTheme(...)` + `defineStyleConfig(...)` calls, rewrites what's mechanically convertible, emits `TODO: manual migration needed` comments with AST location + one-line rationale for what isn't
- **Report:** end-of-run summary — files migrated, manual-review count, per-component diff categories
- **CLI entry:** `yarn superstyling migrate-from-chakra ./src`
- **Migration guide** at `/migration/from-chakra-v2` — side-by-side examples, categorized by diff type: identical / rename / behavior-change / unsupported
- **Dogfood:** run the codemod on a real Chakra OSS app end-to-end before release

**New dep:** `jscodeshift` (devDep of `@superstyling/codemod` only).

### Phase 17 — v0.2.0 release (0.5 week)

- Changesets aggregated → root `CHANGELOG.md` with narrative release notes
- Migration guide linked from docs landing ("Migrating from Chakra?" CTA)
- Publish all 6 packages: core, icons, next, expo, vite, codemod
- Tag `v0.2.0`
- Announcements: blog / X / Discord / Tamagui / `r/chakraui` / Chakra Discord `#ecosystem`

---

## Running order

```
Phase 10 (layout)          ─┐
Phase 11 (overlay + toast) ─┼─► Phase 12 (nav/disclosure) ─┐
Phase 13 (data + native)   ─┘                              ├─► Phase 16 (migration DX)
Phase 14 (hooks)           ──────────────────────────────► │
Phase 15 (theming compat)  ──────────────────────────────► │
                                                           └─► Phase 17 (release)
```

Phases 10–15 can run in any order; 16 + 17 gate on 10–15.

---

## Explicitly out of scope for v0.2

Tell migrators upfront. Each is v0.3+ candidate or "maybe never":

- **`as` prop polymorphism.** Tamagui models polymorphism differently. Alternative: `tag` prop (web only) + explicit composition.
- **Chakra's multi-part `anatomy` helper.** Our `ComponentOverride` shape is close but not identical. Documented in migration guide.
- **`createRecipe` / `sva`** (Chakra v3-only). v2 target doesn't need it.
- **`ChakraProvider`'s `resetCSS`.** Tamagui handles reset differently.
- **`StyleFunctionProps`-based dynamic styles.** Static token objects only. Functional styles are flagged by the codemod with a migration recipe.
- **DatePicker.** Not in Chakra v2 — out of scope for v0.2 parity. Possible v0.3 add.
