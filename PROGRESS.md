# `@superstyling/*` — Progress Tracker

**Current phase:** Pre–Phase 0 (planning complete, audit not started)
**Last updated:** 2026-04-16

Phase definitions and decisions live in [`PLAN.md`](./PLAN.md). This file tracks execution only.

---

## Phase 0 — Prior art audit (~1 week)

Status: **Claude's source-reading pass complete; awaiting Nate's hands-on DX pass**

- [x] Read Tamagui's `@tamagui/*` components (docs pass; portal source still open)
- [x] Read Chakra UI v2 source (docs pass)
- [x] Read Chakra UI v3 source (docs pass; migration URL 404)
- [x] Read Gluestack UI v2 (docs pass)
- [x] Read Radix UI primitives (docs pass)
- [x] Read Zag.js + Ark UI — ⚠️ material finding: Zag is web-only, Q25 needs revisit
- [x] Read NativeBase (historical reference, deprecated)
- [x] Read NativeWind (rejected approach)
- [x] Read Dripsy + Restyle (smaller RN styling libs)
- [x] Draft `docs/prior-art/libraries.md` — all 9 libraries written
- [x] Build `docs/prior-art/component-matrix.md` — Tamagui + Chakra v2/v3 + Gluestack (Button/Modal) populated; remaining columns pending during implementation
- [x] Compile `docs/prior-art/gotchas.md` — 40+ entries across all libraries
- [x] Write `docs/prior-art/README.md` with top-10 synthesis insights
- [ ] **Nate: hands-on Gluestack v2 use, add DX notes**
- [ ] **Nate: hands-on Chakra v3 use, add DX notes**
- [ ] **Escalation: review Insight 1 (Zag web-only) and decide Q25 revision** before Phase 1
- [x] **Follow-up for Claude:** read `@tamagui/portal` source on GitHub to close Tamagui portal open question — **done 2026-04-16**, Portal architecture section added to libraries.md, 3 new entries in gotchas.md, PLAN.md §3.12 refined

Timebox: 5 working days. Hard stop: 7.

### Decision-log entries from Phase 0

- **2026-04-16 — Q25 revisit flagged.** Zag audit revealed no React Native support. Proposed revision in `docs/prior-art/README.md` Insight 1: keep Zag on web only; on native use Tamagui primitives + either per-component custom state or a future Zag-RN adapter. Awaiting Nate's decision before Phase 1.
- **2026-04-16 — Q25 revision DECIDED: option (a), hand-rolled per-component native state with mandatory guardrails.** Nate picked hand-rolled state management over the Zag-RN adapter or scoping back. Final guardrail set: 10 mandatory gates (state-machine tests, cross-platform parity suite, a11y snapshots, keyboard/gesture contract tests, Maestro E2E, real-device smoke, state module isolation, central native-prop registry, Mermaid state-transition diagrams, per-component HAND_ROLLED.md). Two original guardrails trimmed at Nate's request: screen-reader video/transcript evidence and 48-hour PR cooling-off. Full spec in PLAN.md §3.9.1. Estimated added cost: ~2 days per component; ~7 weeks total for the v0.1+v0.2 native gap set.
- **2026-04-16 — Native `Select` decision deferred to Phase 5.** Tamagui has no native-picker path; choice between Adapt+Sheet, `@react-native-picker/picker` wrapper, or both is postponed.
- **2026-04-16 — Babel plugin for compile-time prop translation deferred to v0.2.** Tamagui compiler has no public extension API; v0.1 accepts runtime fallback for Chakra-shaped props.
- **2026-04-16 — Q28 overlay registry scope narrowed after reading `@tamagui/portal` source.** Tamagui ships `useStackedZIndex` + `ZIndexHardcodedContext` for visual stacking. We reuse these; our overlay registry only adds stack-aware dismiss ordering, outside-click propagation rules, programmatic-dismiss API, and focus-trap coordination. Estimate: ~50–100 LOC instead of a full rebuild. PLAN.md §3.12 updated.
- **2026-04-16 — New action item for `@superstyling/expo`:** must ensure teleport host is registered at native app root so the Gorhom silent-context-loss fallback never fires. Documented as gotcha #9 in docs/prior-art/gotchas.md.

---

## Phase 1 — Scaffolding (~1 week)

Status: **Milestone 1 complete; Milestones 2–3 pending**

### Milestone 1 — Foundation + release tooling ✅ (2026-04-16)

- [x] Yarn v4.13.0 + `nodeLinker: node-modules`, corepack-managed via `packageManager` field
- [x] Turborepo 2.9.6 with `build`, `typecheck`, `test`, `lint`, `dev` pipelines
- [x] 7 workspaces created (`packages/{core,icons,next,expo,vite}`, `apps/{docs,playground}`)
- [x] Oxlint 1.60.0 configured with react/react-perf/typescript/unicorn/import/jsx-a11y plugins
- [x] Oxfmt 0.45.0 installed (pre-1.0 but usable)
- [x] lefthook 2.1.6 pre-commit hooks wired (lint + format on staged files)
- [x] Changesets 2.30.0 configured with fixed versioning + apps ignored
- [x] MIT `LICENSE` (© 2026 Nathan Irikefe)
- [x] Contributor Covenant v2.1 `CODE_OF_CONDUCT.md` (fetched from official source, contact set)
- [x] `CONTRIBUTING.md` (concise v0.1)
- [x] 4 issue templates (bug / feature / docs / question) + `config.yml` (blank issues disabled)
- [x] **Exit check green:** `yarn install` 7s · `yarn typecheck` 7/7 pass in 2s · `yarn lint` 0 errors · `yarn build` stubs 7/7 pass

### Milestone 2 — Testing + CI ✅ (2026-04-16)

- [x] Vitest 4.1.4 with two projects: `logic` (Node) + `web-component` (happy-dom); `vitest.config.ts` + `vitest.setup.web.ts`
- [x] Jest 30.3.0 + `jest-expo` 55.0.16 + `@react-native/jest-preset` 0.85.1 (RN 0.85 moved preset to its own package — fixed); `jest.config.cjs`
- [x] Playwright 1.59.1 configured with `playwright.config.ts`; placeholder `_smoke.playwright.test.ts` in `packages/core/src/` because Playwright has no `--passWithNoTests` (delete when real CT specs ship)
- [x] Maestro setup guide at `docs/maestro-setup.md` (CLI install via curl, iOS/Android prereqs, CI-aware)
- [x] GitHub Actions fast lane `.github/workflows/ci.yml` — lint, typecheck, build, Vitest, Jest native, Playwright, changeset-check. All on `ubuntu-latest` with Node from `.nvmrc`
- [x] GitHub Actions slow lane `.github/workflows/ci-e2e.yml` — Maestro iOS on `macos-14` + Maestro Android on Ubuntu via `reactivecircus/android-emulator-runner`. Advisory (does not block merge)
- [x] GitHub Actions nightly `.github/workflows/nightly.yml` — Node 20/22 × Linux/macOS matrix + full Playwright browser matrix. Cron 0600 UTC + `workflow_dispatch`
- [x] Concurrency cancel-in-progress on PRs (all workflows except release)
- [x] `@changesets/action` release workflow `.github/workflows/release.yml` — opens "chore: version packages" PR on main, runs `yarn release` on merge
- [x] Root `test:vitest` / `test:jest` / `test:playwright` scripts; `yarn test` chains all three
- [x] React 19.2.5 + react-dom + react-native 0.85.1 installed as devDeps (peer-dep sources for testing)
- [x] **Exit check green:** `yarn test` passes all three runners with zero real tests · `yarn typecheck` 7/7 · `yarn lint` 0 errors · all 4 workflow YAMLs parse valid

### Milestone 3 — Package stubs + verify ✅ (2026-04-18)

- [~] `@tamagui/build` wired into each `packages/*` — **deferred**. Uses `tsc` for now (`main`/`types` point at `src/index.ts`). Switch to `@tamagui/build` when real native/web-split files land in Phase 2.
- [x] `packages/core`: `createSystem()` skeleton, `<SuperStylingProvider>` (wraps `TamaguiProvider` + `PortalProvider`), base Tamagui config using `@tamagui/config/v4` default; re-exports `YStack`/`XStack`/`Text`/`H1-H6` from Tamagui v2
- [x] `packages/icons`: `<Icon>` skeleton with prop shape (`aria-label`, `size`, `color`, children)
- [x] `packages/next`: skeleton with planned-surface documentation
- [x] `packages/expo`: skeleton with teleport-host registration noted in doc comment
- [x] `packages/vite`: skeleton with planned-surface documentation
- [x] `apps/docs`: One `app/_layout.tsx` wraps `<SuperStylingProvider>` around `<Slot />`; `app/index.tsx` is "Hello from One on the web" page; Vite config with `one()` plugin in SSG mode. **MDX + Sandpack + Pagefind deferred to Phase 7 (docs content).**
- [x] `apps/playground`: Expo + Expo Router; `app/_layout.tsx` wraps provider; `app/index.tsx` is "Hello from Expo Router" with `<H1>` + `<Text>`; babel.config.js with `react-native-worklets/plugin`; metro.config.js with workspace resolution
- [x] **Exit check green:**
  - `yarn typecheck` → 8/8 tasks pass
  - `yarn lint` → 0 warnings, 0 errors
  - `yarn test` → Vitest + Jest + Playwright all pass
  - `yarn one dev` (apps/docs) → Vite dev server on :8081 ✓
  - `yarn expo start --web` (apps/playground) → Metro bundled 1262 modules ✓

### Downgrade decision (2026-04-18)

Per Q37a/docs framework blocker: One pins `react-native: 0.83.2` exactly. Chose option (B) downgrade across the repo:

- `expo@^54.0.9` (was 55.0.15)
- `jest-expo@^54.0.9` (was 55.0.16)
- `react-native@0.83.2` (was 0.85.1)
- Removed `@react-native/jest-preset` (bundled into RN 0.83.2)

Tamagui uses `2.0.0-rc.41` (the current `latest` tag — v2 ships as RC). Consistent with our pre-1.0-tool posture.

---

## Phase 2 — Foundation layer (~2–3 weeks)

Status: **All six sub-milestones complete ✅**

### P2.1 — Theme + createSystem foundation ✅ (2026-04-18)

- [x] Theme type definitions at `packages/core/src/theme/types.ts` (Theme, ThemeInput, ColorScale, AlphaScale, SemanticTokenValue, plus per-category types + `SuperStylingCustomTheme` empty interface for Q18 declaration merging)
- [x] Default Chakra theme at `theme/default.ts` — full 10-scale palette, space (px+0–96), sizes, fonts, fontSizes, fontWeights, lineHeights, letterSpacings, radii, shadows, zIndices, breakpoints (em-based), 6 semantic tokens with \_dark variants
- [x] Theme merger at `theme/merge.ts` — two-level shallow merge onto defaults
- [x] Token resolver at `theme/resolver.ts` — Chakra theme → Tamagui config shape (tokens, themes, media)
- [x] `createSystem(input)` at `createSystem.ts` — accepts ThemeInput, returns `{ config, theme }`; `defaultSystem` exported for zero-config use
- [x] 17 unit tests covering resolver and merger

### P2.2 — Style-props engine ✅ (2026-04-20)

- [x] `shortcuts.ts` — full Chakra v2 shortcut map registered into Tamagui `shorthands` via createSystem
- [x] `pseudoProps.ts` — cross-platform + web-only + ARIA-state pseudo maps combined into `pseudoPropMap`
- [x] `translateProps.ts` — runtime translator handling sx (spread), pseudo-props (recursive), responsive object expansion
- [x] 18 unit tests covering all three translation paths

### P2.3 — Color mode ✅ (2026-04-20)

- [x] `colorMode/types.ts` — shared types (ColorMode, ColorModeStorage, SystemSchemeWatcher)
- [x] `colorMode/storage.ts` (web) + `storage.native.ts` (AsyncStorage); platform-split via Metro resolution
- [x] `colorMode/systemScheme.ts` (matchMedia) + `systemScheme.native.ts` (RN Appearance)
- [x] `ColorModeProvider` — state + useMemo'd context + subscribes to system changes (conditional) + persists toggles; wraps children in Tamagui `<Theme>` for reactive mode swap
- [x] `useColorMode()` + `useColorModeValue(light, dark)` hooks
- [x] `ColorModeScript` — SSR FOUC-prevention script; exported `buildColorModeScript` for custom injection
- [x] 6 unit tests covering script generation
- [x] `@react-native-async-storage/async-storage` 3.0.2 added as a dep

### P2.4 — colorScheme themes ✅ (2026-04-20)

- [x] `buildColorSchemeThemes` in resolver — auto-generates per-scale themes (`blue`, `light_blue`, `dark_blue` for each of gray/red/orange/yellow/green/teal/blue/cyan/purple/pink)
- [x] Tamagui nested theme resolution picks `light_blue` / `dark_blue` automatically based on outer `<Theme name="dark">` context
- [x] Primary-token mapping: light uses shades 500/600/700/50/white/500 for primary/Hover/Active/Muted/Contrast/Border; dark uses 400/300/500/900/gray.900/400
- [x] 6 unit tests covering scheme theme generation
- [x] Wired into `resolveTheme` so createSystem ships these themes

### P2.5 — Primitive components + overlay registry ✅ (2026-04-20)

- [x] `overlay/OverlayRegistry.tsx` — context + stack with `register`/`isTopmost`/`getTopmost`/`dismissTopmost`/`size`. Sits on top of Tamagui's `@tamagui/z-index-stack` (visual stacking); adds dismiss-order policy only
- [x] 4 unit tests for register/unregister/stacking/dismiss propagation
- [x] `components/Box.tsx` — wraps Tamagui YStack, runs translateProps; accepts all pseudos + sx
- [x] `components/Stack.tsx` — polymorphic YStack/XStack with `direction` prop (`row`/`column`/`-reverse`); Omit<YStackProps, "direction"> to avoid Tamagui's ltr/rtl clash. Plus `HStack` + `VStack` specializations
- [x] `components/Text.tsx` — wraps Tamagui Text with translation
- [x] `components/Heading.tsx` — `level={1..6}` prop maps to H1..H6 on web; on native emits `accessibilityRole="header"` + `aria-level={level}` for VoiceOver/TalkBack
- [x] `SuperStylingProvider` updated: now composes TamaguiProvider → ColorModeProvider → OverlayRegistryProvider → PortalProvider
- [x] Both apps (`apps/docs`, `apps/playground`) updated to dogfood Box/Heading/Text

### P2.6 — CLI init-types ✅ (2026-04-20)

- [x] `packages/core/cli.mjs` — ESM entry; `bin: { superstyling: "./cli.mjs" }` in package.json; uses Node's `parseArgs`; detects conventional system file paths (`./superstyling.config.ts`, `./system.ts`, `./src/system.ts`, `./app/system.ts`, etc.)
- [x] `packages/core/src/cli/generate.ts` — pure generator exposed for tests + programmatic use
- [x] 9 unit tests on the generator (default path, user system path, export-name variants, candidate-path ordering)
- [x] Verified `yarn superstyling --help` works from a workspace
- [x] Verified `yarn superstyling init-types` writes a correct `superstyling.d.ts` augmenting Tamagui's `TamaguiCustomConfig`

**Follow-up flagged:** the generated augmentation works but activating it in a consumer app surfaces a Tamagui v2 typing edge case — the augmented `TextProps` includes an index signature that JSX `children: string` doesn't satisfy. The CLI itself is correct; the consumer-side DX win (shorthand autocomplete via `p="$4"` instead of `padding="$4"`) requires more Tamagui-specific augmentation work. Deferred to a dedicated Tamagui-integration task; doesn't block Phase 2.

### Exit check as of 2026-04-20 (Phase 2 complete + cleanups)

- `yarn typecheck` → 8/8 tasks pass
- `yarn lint` → 0 warnings, 0 errors
- `yarn test` → 70/70 tests pass (17 resolver + 6 scheme + 18 translator + 6 colorMode + 4 overlay + 9 CLI + 10 bindComponent)
- Both apps (`apps/docs`, `apps/playground`) dogfood `Box`/`Heading`/`Text` from our wrappers

### Phase 2 cleanups — fixed 2026-04-20

**Tackled 4 of 6 carried-over items in a dedicated cleanup sprint:**

1. ✅ **Fonts derived from theme.** `packages/core/src/theme/fonts.ts` builds Tamagui `createFont` configs from `theme.fonts.{body,heading,mono}` + `theme.fontSizes` + `theme.fontWeights` + `theme.lineHeights` + `theme.letterSpacings`. Includes `remPxToNumber` for rem/em→px conversion at 16px base. Wired into `createSystem`.
2. ✅ **Breakpoint names from context.** New `packages/core/src/system/BreakpointContext.tsx` provides a `BreakpointProvider` + `useBreakpointNames` hook. `components/common.ts` converted from `translateComponentProps` function to a `useTranslatedProps` hook that reads context. `SuperStylingProvider` wires the provider from `system.theme.breakpoints` (excluding `base`).
3. ✅ **`theme.components.*` build-time expansion.** New `packages/core/src/components/bindComponent.tsx` wraps any base component with a `ComponentOverride` (`baseStyle`, `sizes[size]`, `variants[variant]`, `defaultProps`). Merge precedence: defaultProps < baseStyle < sizes < variants < user props. Returns base component by reference when override is undefined (no re-render perf hit). `System` now exposes bound `Box`/`Stack`/`HStack`/`VStack`/`Text`/`Heading`. Added `ThemeComponents` + `ComponentOverride` types. 10 unit tests with `@testing-library/react`.
4. ✅ **Ref-as-prop typing.** Components switched from ref-as-prop (React 19 style) to `React.forwardRef` — Tamagui v2-rc.41's prop types don't model `ref` as a prop. The Heading case needed a single `@ts-expect-error` directive at the JSX seam (documented) because Tamagui's H1–H6 types reject ref entirely. Kept `as unknown as` narrowing for the translated-prop spread.

### Still deferred (intentional)

3. **Cookie-based SSR mode persistence** — blocked on `@superstyling/next` integration harness (Phase 6). Premature to build without a Next.js SSR app to test against end-to-end.
4. **Tamagui-side shorthand typing via module augmentation** — the CLI (P2.6) generates a correct `.d.ts`; activating it surfaces an index-signature collision with JSX `children`. **Spike plan drafted:** see [`docs/spikes/shorthand-typing-plan.md`](./docs/spikes/shorthand-typing-plan.md) (phases A–E, 8–14 hr expected, 16 hr hard stop). Not scheduled yet.

- [ ] `createSystem(theme)` build-time component-override expansion
- [ ] Zero-config default re-export when no overrides passed
- [ ] `asChild` prop handling
- [ ] `tag` prop (web-only) for underlying element selection
- [ ] Overlay registry implementation (context + stack)
- [ ] Tamagui `PortalProvider` / `PortalItem` integration
- [ ] Declaration-merging type strategy (`Theme` interface augmentation)
- [ ] CLI command: `superstyling init-types` or similar to generate `.d.ts` boilerplate
- [ ] Component: `Box`
- [ ] Component: `Stack` / `HStack` / `VStack`
- [ ] Component: `Text`
- [ ] Component: `Heading` (with `level` prop → web `h1-h6` / native `accessibilityRole`+`aria-level`)
- [ ] Tests: token resolution
- [ ] Tests: shortcut/pseudo-prop translation
- [ ] Tests: responsive object expansion
- [ ] Tests: color mode toggle and SSR safety
- [ ] **Exit check:** `<Box p={4} bg="blue.500" _hover={{ bg: "blue.600" }}>` renders correctly on web + iOS + Android

---

## Phase 3 — Tier 1 primitives (~3–4 weeks)

Status: **All five sub-milestones complete ✅ (2026-04-20)**

### P3.0 — @superstyling/icons ✅

- [x] Web `<Icon>` (`Icon.tsx`) + Native `<Icon>` (`Icon.native.tsx`) — platform-split SVG container
- [x] `createIcon` factory (platform-split): web emits `<path>`, native emits `<Path>` from `react-native-svg`
- [x] 21-icon initial set: chevrons, arrows, close/check/plus/minus, status icons (info/success/warning/error), common UI (search/menu/settings/more/edit/trash/external-link/sun/moon)
- [x] Peer deps declared: `react` (required), `react-native-svg` (optional)
- [x] 14 unit tests (Icon rendering, createIcon factory, spot-checks on specific icons)

### P3.1 — Presentational primitives ✅

- [x] `Divider` — wraps Tamagui `Separator`; `orientation` prop
- [x] `Spinner` — wraps Tamagui `Spinner`
- [x] `Badge` — 3 variants (solid/subtle/outline) × 3 sizes × arbitrary colorScheme via `<Theme>`
- [x] `Avatar` — dot-namespaced with `Avatar.Image`, `Avatar.Fallback` (Tamagui compound preserved)
- [x] 7 unit tests (smoke + variant/size/colorScheme)

### P3.2 — Interactive primitives ✅

- [x] `Button` — 4 variants × 4 sizes × colorScheme, `leftIcon`/`rightIcon` slots, `isLoading` + `loadingText` + `spinnerPlacement`, `isDisabled`, `isActive`
- [x] `IconButton` — square Button, requires `icon` + `aria-label`
- [x] `Link` — wraps Tamagui `Anchor`, `isExternal` → `target="_blank"` + `rel="noopener noreferrer"`
- [x] 10 unit tests (onPress, variants, sizes, loading, disabled, external)

### P3.3 — Alert (composite) ✅

- [x] Dot-namespaced: `Alert` root + `Alert.Icon` + `Alert.Title` + `Alert.Description` + `Alert.Content`
- [x] 5 statuses: info / success / warning / error / loading (each auto-picks icon + colorScheme)
- [x] 4 variants: subtle / solid / left-accent / top-accent
- [x] `@superstyling/icons` added as workspace dep of `@superstyling/core` for status icons
- [x] User-override via `<Alert.Icon>{custom}</Alert.Icon>`
- [x] Context-gated subcomponents throw if rendered outside `<Alert>`
- [x] 5 unit tests (status × variant × custom icon × context enforcement)

### P3.4 — Showcase pages ✅

- [x] `apps/docs/app/components.tsx` — single showcase page rendering every primitive (typography, layout, feedback, media, interactive sections)
- [x] `apps/playground/app/components.tsx` — native mirror with `ScrollView` wrapping
- [x] Home pages in both apps link to `/components`
- [x] Per-component docs pages with Sandpack are deferred to Phase 7 (content polish) — the one-page showcase is sufficient for dogfooding Tier 1 primitives

### Phase 3 exit check (2026-04-20)

- `yarn typecheck` → 9/9 tasks pass (added `@superstyling/icons` workspace)
- `yarn lint` → 0 warnings, 0 errors
- `yarn test` → 102/102 tests pass (was 70 after Phase 2; +32 for icons + primitives + interactive + Alert)
- Both apps boot and render the full showcase

---

## Phase 4 — Modal (forcing function) (~2 weeks)

Status: **Complete ✅ (2026-04-20)**

### P4.0 — Modal implementation ✅

- [x] Wrap Tamagui v2's `Dialog` with Chakra-style dot-namespaced API
- [x] Root `<Modal isOpen onClose>` + `Modal.Overlay` / `Modal.Content` / `Modal.Header` / `Modal.Body` / `Modal.Footer` / `Modal.Title` / `Modal.Description` / `Modal.CloseButton`
- [x] 11 sizes (`xs` through `6xl` + `full`), 6 motion presets (`scale`, `slideInBottom`, `slideInTop`, `slideInLeft`, `slideInRight`, `none`)
- [x] Full Chakra v2 API surface: `closeOnOverlayClick`, `closeOnEsc`, `blockScrollOnMount`, `trapFocus`, `initialFocusRef`, `finalFocusRef`, `returnFocusOnClose` (honored independently per Chakra v2 audit gotcha #1 — no silent override), `useInert`, `scrollBehavior` (inside/outside), `keepChildrenMounted`, `role` (dialog/alertdialog)
- [x] OverlayRegistry integration on mount (registers with id + onDismiss)
- [x] Focus trap: inherited from Tamagui's `Dialog.FocusScope`
- [x] Scroll lock: inherited from Tamagui (`disableRemoveScroll` inverse of `blockScrollOnMount`)
- [x] Native modal presentation: inherited from Tamagui's platform-split Dialog
- [x] Animation: CSS on web, Moti on native (inherited from Tamagui's animation drivers + `enterStyle`/`exitStyle`)
- [x] Keyboard + click-outside dismissal: inherited from Tamagui's Dialog
- [x] A11y: inherits ARIA on web, `accessibilityViewIsModal` on iOS from Tamagui's Dialog; `role="dialog"`/`"alertdialog"` per user choice

### P4.1 — Modal tests ✅

- [x] 7 unit tests: render when open, close-state smoke, Modal.CloseButton wiring, context enforcement on subcomponents, scrollBehavior plumb, all sizes × all motion presets

### P4.2 — Modal showcase integration ✅

- [x] `apps/docs/app/components.tsx` — interactive Modal demos (sizes + motion presets) with `useState`
- [x] `apps/playground/app/components.tsx` — native Modal demo

### Deferred (v0.2+ or dedicated tasks)

- [ ] Screen-reader testing on VoiceOver / TalkBack / NVDA / JAWS — deferred to Phase 8 hardening
- [ ] Next.js Pages hydration verification — deferred to Phase 6 (@superstyling/next integration)
- [ ] Stack-aware Escape handling (topmost-only dismiss when modals are nested) — foundation in OverlayRegistry, activation when we have real nested-overlay use cases

### Phase 4 exit check (2026-04-20)

- `yarn typecheck` → 9/9 tasks pass
- `yarn lint` → 0 warnings, 0 errors
- `yarn test` → 109/109 tests (was 102; +7 for Modal)
- Modal renders and dogfoods on both apps via interactive showcase

---

## Phase 5 — Tier 1 form components (~3–4 weeks)

Status: **complete**

- [x] `Input` (4 variants × 4 sizes; type=password → secureTextEntry on native)
- [x] `Textarea` (same variants, rows prop)
- [x] `Checkbox` (3 sizes, colorScheme, label slot)
- [x] `Radio` + `RadioGroup` (size context, invalid state propagates to items)
- [x] `Switch` (3 sizes, colorScheme, label slot)
- [x] `Select` via Tamagui Select + Adapt+Sheet on `maxMd` (mobile), `Select.Option` compound
- [x] `FormControl` with `.Label` / `.HelperText` / `.ErrorMessage` — auto-wires `id`, `aria-invalid`, `aria-required`, `aria-readonly`, `aria-describedby`, `aria-labelledby`, `disabled`, `readOnly`, `required` via `useFormControlProps`
- [x] Added `@tamagui/{input,checkbox,switch,radio-group,select,adapt,sheet,label}@2.0.0-rc.41` as explicit core deps
- [x] 12 new web tests (form.web.test.tsx) — `yarn test:vitest` → 121/121
- [x] Login/settings-style `FormDemo` dogfooded on both docs and playground showcases
- [ ] ~~Integrate Zag `field` machine~~ (deferred — Zag is web-only, Q25 revised to hand-rolled; FormControl context covers v0.1 needs)
- [ ] Per-component screen-reader verification (deferred to Phase 8 manual walkthrough)

**Exit check:** ✅ login + settings form renders naturally on both apps with full ARIA wiring via FormControl.

---

## Phase 6 — Integration packages (~2 weeks)

Status: **complete** (order shipped: vite → next → expo)

- [x] `@superstyling/vite`: full wrapper around `@tamagui/vite-plugin@2.0.0-rc.41` — `superstylingVitePlugin()` composes alias plugin + dev-deps `optimizeDeps` hints + the Tamagui plugin; re-exports `superstylingAliases` for manual ordering; `colorModeScriptSnippet({storageKey, initialMode})` returns FOUC-prevention `<script>` for `index.html`. 9 new tests in `packages/vite/src/index.test.ts`.
- [x] `@superstyling/next`: dual-router support via subpath exports. Main entry exposes `withSuperStyling()` (lazy-requires `@tamagui/next-plugin` so the module loads outside a webpack toolchain) + `buildColorModeScript()`. `@superstyling/next/app` ships a React `ColorModeScript` server component. `@superstyling/next/pages` ships `SuperStylingDocument` (drop-in `_document.tsx`) plus a `ColorModeScript` component. 10 new tests (logic + SSR renderToStaticMarkup parity between routers).
- [x] `@superstyling/expo`: six subpath exports — `/setup` (required Tamagui native setup-teleport/gesture-handler/worklets/safe-area/keyboard), `/setup-all` (adds linear-gradient, burnt, zeego), `/babel-plugin` (`babelPreset()` with `@tamagui/babel-plugin` + worklets-last ordering), `/metro-config` (`withSuperStylingMetro()` sets symlink/package-exports/requireContext flags AND composes `@tamagui/metro-plugin`'s `withTamagui` for CSS/extractor wiring), `/app-plugin` (Expo config plugin via `createRunOncePlugin`, shell today), main barrel re-exports non-side-effect helpers. 10 new tests in `packages/expo/src/index.test.ts` (incl. tamagui metro-composition path). Playground dogfoods `@superstyling/expo/setup` at app entry. Deps: `@tamagui/native`, `@tamagui/babel-plugin`, `@tamagui/metro-plugin`.
- [ ] **Exit check:** fresh `create-next-app`, `create-expo-app`, `create-vite` each achieve working setup in <5 minutes (validated in Phase 7/8 fixture apps)

---

## Phase 7 — Docs, examples, polish (~2–3 weeks)

Status: **complete**

- [x] **P7.1 docs infrastructure + component pages.** `ComponentDemo` (live preview + toggleable code block with copy button — Sandpack upgrade deferred to v0.2 per Q7), `DocsLayout` shell with sidebar nav built from `DOCS_NAV` tree, `PropsTable` building block. 16 component pages under `/components/*`: box, stack, divider, text, heading, spinner, badge, avatar, alert, button, icon-button, link, modal, form-control, input (+ textarea), checkbox, radio (+ radio-group), switch, select. Home landing page rebuilt on the docs shell.
- [x] **P7.2 example apps** _(shipped as in-docs pages, not standalone apps — see deferred note)_. 5 pages under `/examples/*`: login (email+password validation, loading state, error surfacing), settings (profile/notifications/appearance/danger-zone grouped with Divider), form-validation (touched-on-blur + field-level errors + submit gating), theming (createSystem walkthrough with colors/space/radii/components overrides), color-mode (live useColorMode toggle + ColorModeProvider options + FOUC-prevention snippets for Next/Vite).
  - **Deferred:** PLAN.md originally called for standalone example _apps_ (clonable starters with their own package.json, config, dev/build scripts). Current implementation is in-docs interactive pages. Standalone apps deferred to Phase 8 or a follow-up milestone; scope decisions (one-app-per-example vs combined workspace, web-only vs cross-platform) to be made at that time.
- [x] **P7.3 Getting Started guides.** Three pages under `/getting-started/*`: next (step-by-step install + tamagui.config + next.config + App Router ColorModeScript + Pages Router Document + render Button + troubleshooting), expo (SDK-54 flow with babel-plugin, metro-config, setup import, config-plugin registration), vite (create-vite + superstylingVitePlugin + FOUC script + One/Vike note).
- [x] **P7.4 Pagefind search + docs polish.** Added `pagefind@^1.5.2` as docs devDep; `build:search` script runs `pagefind --site dist` after `one build`. `Search` component in the top bar lazy-loads `/pagefind/pagefind.js`, gracefully degrades to a disabled input with hint text when the index isn't built. Sidebar now highlights the active nav link (primary colour + 600 weight) driven by `window.location.pathname`.
- [x] **Exit check:** new user lands on home, follows a Getting Started guide, has a `<Button>` rendering in well under 10 minutes. Every component has its own page with props table + live examples. Search works once the index is built.

### Post-commit bug fixes (surfaced running the docs dev server)

- [x] **`createTamagui()` missing `$true` token.** Tamagui v2 requires `true` keys on `space`, `size`, and `radius` tokens (used as scaling baselines). `packages/core/src/theme/resolver.ts` now injects `true` matching the Chakra default (`$4` for space/1rem, `$md` for size/28rem, `md` for radius/0.375rem). Regression test added in `resolver.test.ts`.
- [x] **`createTamagui()` invalid `tokens.zIndex`.** Tamagui v2 requires zIndex keys to be a subset of size keys. Our semantic Chakra z-indices (`modal`, `tooltip`, etc.) broke this. `createSystem.ts` now inherits v4's default numeric zIndex tokens from `@tamagui/config`; our semantic z-indices stay on `theme.zIndices` for the OverlayRegistry and direct consumer use, not as a Tamagui style-prop surface.
- [x] **Double `PortalProvider` wrap crashing SSR.** Tamagui v2's `TamaguiProvider` already includes a `PortalProvider`; our `SuperStylingProvider` wrapped another one inside it, causing a null-context error during Tamagui's Gorhom fallback path. Removed the explicit `@tamagui/portal` wrapper.

### Deferred (Phase 8 follow-up)

- [x] **One + Tamagui SSG dual-React crash — resolved by migrating off One.** See Phase 7.5. Pre-migration workaround was `defaultRenderMode: "spa"`; Phase 7.5 replaces One with Vocs, which eliminates the problem.

---

## Phase 7.5 — Migrate docs from One to Vocs (~3–5 days)

Status: **complete**

### Motivation

The Phase 7 docs site (built on One + vxrn) has an unresolvable dual-React-instance crash with Tamagui during SSR (`useRef is null` inside `@tamagui/web/src/views/Theme.tsx`). The workaround — switching to `defaultRenderMode: "spa"` — gives up SEO, first-paint performance, Pagefind indexing, and proper `<Button>`-in-<10-min onboarding (the Phase 7 exit check). Root cause lives in vxrn's vendored React pipeline, not in our library; it is not fixable from our side without a deep integration inside vxrn.

**Vocs** (vocs.dev, by wevm — authors of wagmi/viem) is a React + Vite SSG built specifically for technical documentation. Verified on npm at `vocs@1.4.1`. Ships:

- MDX pages + Shiki syntax highlighting
- Built-in `Callout`, `Steps`, `Tabs`, `CodeGroup`, `Button`, `Sponsors`, `HomePage` components
- Local search (no Pagefind dep needed)
- Standard `react` + `react-dom` runtime — no vendored React, no dual-instance risk

Migrating removes ~500 lines of our hand-rolled `DocsLayout.tsx` / `Search.tsx` / `nav.ts` / Pagefind wiring in exchange for a config file.

### Open decisions (resolve at kickoff)

- **Q10 — Directory layout.** Keep the workspace name `apps/docs` with Vocs's `rootDir` pointing at `apps/docs/docs/`, or flatten to a top-level `docs/` per Vocs's default? (Keeping `apps/docs` preserves monorepo symmetry with `apps/playground`.)
- **Q11 — URL schema.** Preserve the current `/components/button`, `/examples/login`, `/getting-started/next` routes, or adopt Vocs's default `/docs/...` prefix? (Preserving keeps inbound links in existing commits + any exploratory shares stable.)
- **Q12 — Live previews.** Render live Superstyling components inside MDX pages (requires wrapping Vocs's `layout.tsx` in `<SuperStylingProvider>`) vs static screenshots. Live previews are a much better DX; cost is one extra provider wrap and verifying Tamagui + Vocs SSR compat.
- **Q13 — Code display.** Let Vocs's Shiki handle every example without our show/hide toggle, or keep a Vocs-idiomatic version of our `ComponentDemo` show/hide UI on top of Vocs's `<CodeBlock>`?

### Sub-tasks

- [x] **P7.5.1 — Install + configure Vocs.** `apps/docs/package.json` swapped from One (+ Pagefind) to `vocs@^1.4.1`. `vocs.config.ts` at workspace root with `rootDir: "."` (Q10 = keep `apps/docs` workspace, pages at top-level), full sidebar tree, brand accent `#3182CE`, GitHub social link, editLink. Scripts: `vocs dev` / `vocs build` / `vocs preview`.
- [x] **P7.5.2 — Layout + providers.** `apps/docs/layout.tsx` wraps every page in `<SuperStylingProvider>`. Smoke page renders live Tamagui `<Button>` variants in SSG output — no `useRef` crash, no vendored-React issue. Standard-React SSR path confirmed working with Tamagui.
- [x] **P7.5.3 — Port `ComponentDemo` primitive.** `apps/docs/components/ComponentDemo.tsx` reimplemented for Vocs. Preview in a framed Box + show/hide toggle (Q13 = keep) + copy button + language label. Uses inline `<pre>` for code display since the prop-passed string can't round-trip through Vocs's MDX Shiki pipeline; fenced markdown blocks elsewhere still get Shiki highlighting. `PropsTable.tsx` also ported.
- [x] **P7.5.4 — Port 16 component pages to `.mdx`.** box, stack, divider, text, heading, spinner, badge, avatar, alert, button, icon-button, link, modal, form-control, input (+ textarea), checkbox, radio (+ radio-group), switch, select. Every page: MDX imports at top, lead paragraph, fenced-code Import section (Shiki-highlighted), multiple `<ComponentDemo>` sections for variants, `<PropsTable>` for API. Q11 = preserve URLs (`/components/button`, not `/docs/...`). Vocs `:::tip` / `:::info` / `:::warning` blocks replace Alert JSX for a11y notes.
- [x] **P7.5.5 — Port 5 example pages + 3 Getting Started guides to `.mdx`.** `/examples/{login, settings, form-validation, theming, color-mode}` — interactive demos via exported MDX sub-components that hold state with `useState`. `/getting-started/{next, expo, vite}` — pure MDX with Shiki-highlighted install/config snippets.
- [x] **P7.5.6 — Port landing page to Vocs `<HomePage>`.** `pages/index.mdx` uses `HomePage.Root`, `HomePage.Tagline`, `HomePage.Description`, `HomePage.InstallPackage`, `HomePage.Buttons` for the Vocs-idiomatic landing feel. Why/Getting-started/Components sections follow.
- [x] **P7.5.7 — Remove legacy docs scaffolding.** Deleted `apps/docs/app/` (24 .tsx route pages), `apps/docs/src/` (DocsLayout, Search, nav.ts, old ComponentDemo), `apps/docs/vite.config.ts`, `apps/docs/dist/`. `apps/docs/package.json` no longer references `one`, `vxrn`, or `pagefind`.
- [x] **P7.5.8 — Active-path highlighting.** Free from Vocs's sidebar — no code needed.
- [x] **P7.5.9 — Verify.** `yarn dev` → 28/28 routes return 200, no SSR errors, live Superstyling components render in MDX. `yarn build` → 28 prerendered static HTML files under `dist/`, plus `llms.txt` + `llms-full.txt` generated for free. Build warnings are benign Tamagui-forwarding-RN-props-to-DOM messages (`nativeID`, `accessibilityRole`, `pressTheme`); not blockers but worth a prop-filter pass in Phase 8.

### Known risks / unknowns

- **Tamagui + Vocs SSR compat.** Vocs uses standard `react-dom/server`, not vendored React. Standard-React Tamagui SSR is a supported path (Next integration uses it). Expect it to work; smoke-test in P7.5.2 before committing to full migration.
- **`useInsertionEffect` during SSG.** If Tamagui emits `useInsertionEffect` calls during static rendering, Vocs may warn. Mitigation: mark the affected components as client-only via dynamic import.
- **Sidebar expressiveness.** Vocs sidebars support groups + collapsibles. Our current 9-section nav should port 1-to-1.

### Exit check

- `yarn dev` in `apps/docs` boots, serves every page without SSR errors (no more SPA workaround).
- `yarn build` produces a `dist/` of static HTML, each page pre-rendered.
- Superstyling components render live inside MDX pages.
- Search finds results from every page.
- `apps/docs/package.json` no longer depends on `one`, `vxrn`, `pagefind`.

---

## Phase 8 — Pre-release hardening (~1–2 weeks)

Status: **not started**

- [ ] Manual walkthrough: every component on web (Vite + Next.js)
- [ ] Manual walkthrough: every component on iOS (Expo)
- [ ] Manual walkthrough: every component on Android (Expo)
- [ ] Maestro flow: Modal open/close
- [ ] Maestro flow: form submit
- [ ] Maestro flow: color mode toggle
- [ ] Dogfood app: build a real sample (TODO with auth, or similar) from scratch using only the library
- [ ] File every rough edge discovered during dogfooding as a GitHub issue
- [ ] Fix blocker-tier issues before release
- [ ] Write `CHANGELOG.md` aggregating all Changesets
- [ ] **Exit check:** Nate would use v0.1 in his own production project without caveats

---

## Phase 9 — Publish v0.1.0 (~1 day)

Status: **not started**

- [ ] Merge the Changesets "Version Packages" PR
- [ ] Verify publish workflow succeeds for all 5 npm packages
- [ ] Tag `v0.1.0` on main
- [ ] Announce: blog post
- [ ] Announce: X / social
- [ ] Announce: relevant Discord / subreddit
- [ ] Announce: Tamagui community channels

---

## Decision log

All architectural decisions from the planning session (Q1–Q42a) live in [`PLAN.md`](./PLAN.md). When a decision is revisited or reversed during implementation, record it here with a date and the reason.

### 2026-04-20 — Docs framework: One → Vocs

Original decision (§5.1): docs site runs on **One** so it can dogfood Superstyling on web + iOS + Android from one codebase.

Reversed to: docs site runs on **Vocs** (vocs.dev). `apps/playground` remains on Expo Router for native dogfooding.

**Reason:** One's vxrn bundler pre-bundles Tamagui into `.vite/deps_ssr/tamagui.js` but loads `@tamagui/web` transitives from source at SSR time with a different React context than vxrn's vendored React. Result: `useRef is null` inside `@tamagui/web/src/views/Theme.tsx` on every page render. The crash surfaces through `TamaguiProvider`'s internal `<Theme>` component; it is not triggered by any of our code and not fixable from our side without patching vxrn or Tamagui internals. Shipped Phase 7 with `defaultRenderMode: "spa"` as a workaround, but SPA-only gives up SEO, first-paint perf, static indexability, and the Phase 7 exit check (`<Button>` in under 10 minutes from a cold visitor).

Vocs is a React + Vite SSG framework from wevm (wagmi/viem), using standard `react-dom/server` — no vendored React, no dual-instance class of bug. Migration plan lives in Phase 7.5.

Native cross-platform dogfooding (the original motivation for One) has been happening on `apps/playground` all along and continues there. No loss of coverage.
