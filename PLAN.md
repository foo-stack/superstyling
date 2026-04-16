# `@superstyling/*` — Implementation Plan

## 1. Executive summary

A cross-platform UI library that delivers Chakra UI's developer experience on top of Tamagui's cross-platform engine. Target: React web (Vite + Next.js) + iOS + Android via Expo on day one; macOS/Windows/tvOS/visionOS/RSC later. Open-source, MIT-licensed, community-facing, published to npm.

Projected effort: **16–22 weeks (4–5.5 months) full-time** for v0.1.

---

## 2. Vision and scope

### What the library is

- A full component library implemented _on top of_ Tamagui. Tamagui is the styling + cross-platform engine; the component-facing API is Chakra-shaped.
- Competing tier: peer of Chakra, Gluestack, NativeBase, and Tamagui's own component set — distinguished by being the only one that's Chakra-faithful _and_ cross-platform-first _and_ Tamagui-powered.

### Platforms

- **Tier A, v0.1 must-work:** Web (Vite), Web (Next.js Pages Router), iOS (Expo), Android (Expo).
- **Tier B, v0.2:** Next.js App Router / RSC, bare React Native (non-Expo).
- **Tier C, v0.3+:** macOS (`react-native-macos`), Windows (`react-native-windows`), tvOS, visionOS, Remix/TanStack Start/etc.

### Audience

- OSS, npm-published, community-facing. Docs, contribution guide, and release process aimed at external contributors.

### Chakra traits kept

All of them: style props, color mode, `sx`, theme-driven tokens, `colorScheme`, a11y defaults, compound components, `asChild`-style composition.

### Dependency philosophy

Minimal runtime deps. Tamagui + a handful of audited utilities (primarily Zag machines). Every new runtime dep requires explicit justification.

---

## 3. Architecture decisions — full reference

### 3.1 Naming and packaging

- npm scope: `@superstyling/*`
- 7 packages in the monorepo:
  - `packages/core`
  - `packages/icons`
  - `packages/next`
  - `packages/expo`
  - `packages/vite`
  - `apps/docs`
  - `apps/playground`

### 3.2 Monorepo tooling

- **Yarn v4.13.0** as package manager.
- **Turborepo** for task orchestration, caching, and pipeline definition.
- Yarn `nodeLinker: node-modules` (not PnP) to avoid Metro resolver issues.

### 3.3 Component scope for v0.1

- **Tier 0 (foundations):** theme + tokens, `<SuperStylingProvider>`, `createSystem()`, color mode, style prop engine, `Box`, `Stack`/`HStack`/`VStack`, `Text`, `Heading`.
- **Tier 1 (v0.1 components):** `Button`, `IconButton`, `Input`, `Textarea`, `Checkbox`, `Radio`, `Switch`, `Select`, `FormControl.*`, `Link`, `Divider`, `Spinner`, `Avatar`, `Badge`, `Alert`, `Modal`.
- **Tier 2 (v0.2+):** Menu, Popover, Tooltip, Drawer, Toast, Tabs, Accordion, Progress, Slider, NumberInput, PinInput, Skeleton, Breadcrumb, Table.
- **Tier 3 (v0.3+):** Combobox, DatePicker, Calendar, CommandPalette, DataTable, Tree, virtualized lists, charts.

### 3.4 Style API

- **Token syntax:** Chakra-first (`p={4}`, `bg="blue.500"`), Tamagui syntax works as escape hatch. Translation layer in the library.
- **Shortcuts:** Chakra's full set (`p`, `px`, `py`, `pt`, …, `m`, …, `bg`, `w`, `h`, `minW`, `rounded`, `shadow`, etc.) registered via Tamagui's `shorthands` config — free at runtime, compile-time extractable.
- **Pseudo-props:** Cross-platform set guaranteed (`_hover`, `_focus`, `_active`, `_disabled`, `_checked`, `_invalid`, `_readOnly`, `_required`, `_first`, `_last`, `_dark`, `_light`). Web-only extras (`_before`, `_after`, `_placeholder`, `_selection`) typed and documented as web-only. `_groupHover`/`_peerFocus` deferred to v0.2+.
- **`sx` prop:** Restricted to flat style objects + supported pseudo-props. No CSS selector syntax. Cross-platform.
- **Responsive:** Object form only (`{{ base: 2, md: 4 }}`). No array form.
- **Breakpoints:** Chakra defaults — `base/sm/md/lg/xl/2xl` in `em` units, mobile-first only.

### 3.5 Polymorphism

- **`asChild`** as primary API (Radix/Chakra v3 pattern).
- **`tag` prop** on web-supporting components for changing the underlying HTML element; no-op on native.
- **No polymorphic `as` prop** (avoids the Chakra v2 TypeScript-perf trap).
- Heading semantic levels: `<Heading level={1|2|3|4|5|6}>` maps to `<h1>`…`<h6>` on web via internal `tag` usage, and to `accessibilityRole="header"` + `aria-level` on native.

### 3.6 TypeScript

- **Declaration merging** — users augment a `Theme` interface in a project-level `.d.ts` file to narrow token types.
- Shipped CLI command generates the boilerplate `superstyling.d.ts`.
- No deep generics in public component types. Prioritize TS-perf over inference cleverness.

### 3.7 Theme shape and color mode

- **Theme structure:** Chakra-shaped top level (`colors`, `space`, `sizes`, `fontSizes`, `radii`, `shadows`, `zIndices`, `breakpoints`, `components`, `config`), _plus_ a `semanticTokens` layer that resolves per mode.
- **Color mode:** Chakra-style API (`useColorMode`, `useColorModeValue`, `<ColorModeScript/>`, `initialColorMode` in config), implemented on top of Tamagui's theme provider for performance. Follows system preference by default, persists manual override. SSR-safe. Arbitrary mode names supported beyond `light/dark`.
- **`colorScheme` prop:** sugar for wrapping component internals in Tamagui's nested `<Theme name={colorScheme}>`. Every color scheme auto-registered as a Tamagui theme at `createSystem()` time. Components author styles against semantic tokens (`$primary`, `$primaryForeground`, etc.), not hardcoded color names.
- **Component-level theme overrides:** build-time expansion via `createSystem(theme)`. Users import components from their generated system file, not directly from `@superstyling/core`. Zero-config default for users who don't customize.
- **Breakpoint set:** Chakra defaults.

### 3.8 Compound components

- **Dot-namespaced pattern** throughout: `Menu.Root`, `Menu.Trigger`, `Menu.Content`, `Menu.Item`; `FormControl.Root`, `FormControl.Label`, `FormControl.HelperText`, `FormControl.ErrorMessage`; etc.
- Aligns with Radix / Chakra v3 / Ark / Kobalte conventions.

### 3.9 Accessibility and state machines

**Revised 2026-04-16 based on Phase 0 Zag audit finding (see `docs/prior-art/README.md` Insight 1).** Zag is web-only; no RN adapter exists.

- **Web strategy:** Tamagui primitives first (Dialog, Popover, Tooltip, Select, Checkbox, Switch, RadioGroup, Progress, Tabs, Accordion, Sheet). Zag/Ark for the gaps (Menu, Combobox, DatePicker, Toast, Field).
- **Native strategy:** Tamagui primitives first (same coverage). For gaps (Menu, Combobox, DatePicker, FormControl-native, Toast-native):
  - **Hand-rolled per-component state management**, not a Zag-RN adapter and not a deferral.
  - Each component models its behavior as an internal reducer/state-machine pattern (same mental model as Zag, even though we don't share code).
  - **Guardrails required before any native gap component ships** (see §3.9.1).
- **Toast:** `@zag-js/toast` engine on web. On native, hand-rolled state on top of Tamagui's Toast primitive where it covers us; own reducer for anything else. Both platforms expose the same `useToast()` hook + `toaster` singleton (Q29 unchanged at the API level).
- **Forms:** `@zag-js/field` on web. On native, hand-rolled `FormControl` context that emits the same prop shape (`aria-invalid` / `accessibilityState.invalid`, shared ID strategy) as Zag's field machine. `FormControl.*` compound API is identical across platforms.

### 3.9.1 Guardrails for hand-rolled native state components

**Principle:** If we're hand-rolling state machines on native instead of inheriting Zag's tested behavior, every hand-rolled component must pass a mandatory correctness checklist before merging. Nothing is shippable-by-intuition.

**Per-component mandatory gates (merge-blocking):**

1. **State-machine unit tests.** Every documented state transition covered. Every event (user input, programmatic setOpen, focus, blur, keyboard key) tested from every starting state. Target 100% branch coverage on the state module. Vitest (web) + Jest (native) in parallel — same test inputs, equivalent assertions.

2. **Cross-platform behavior parity suite.** Per component, one test file that asserts behavior contracts (e.g., "pressing Escape closes and returns focus to the trigger"). The file runs twice — once against the web implementation (Zag-driven), once against the native implementation (hand-rolled). Both must pass identically. Divergence is a merge-blocker.

3. **Accessibility snapshot tests.** Per component, render every documented state (`open`, `closed`, `disabled`, `invalid`, `checked`, etc.) and assert the a11y tree via `@testing-library/react-native` a11y queries + native `AccessibilityInfo` probing. No `getByRole` that fails. No missing `accessibilityLabel` on interactive elements.

4. **Keyboard & gesture contract tests.** For every interactive component, a documented contract file lists every supported keyboard/gesture input and expected outcome (e.g., Menu: ArrowUp/Down moves focus, Enter selects, Escape closes, typeahead selects). Tests cover every row of the contract. Any missing row = failing test.

5. **Mandatory Maestro E2E flow.** Each native gap component gets at least one Maestro flow that exercises its happy path on real iOS Simulator + Android Emulator. Slow-lane CI (won't block merge during dev) but must be green before a release is cut.

6. **Real-device smoke test before release.** Before any release that includes a hand-rolled native state component, maintainer runs the component manually on at least one real iOS device and one real Android device. Signed off in the release PR.

**Architecture-level gates (repo-wide, enforced by CI):**

7. **State module isolation.** Every hand-rolled component's state lives in its own `state.ts` file with a typed reducer signature. No state logic in the React component body. Enforced by a lint rule (custom Oxlint rule or a codegen check) that flags `useState`/`useReducer` calls outside the designated file.

8. **No silent ARIA-to-RN prop translation.** Every native prop set by our state logic must be explicitly declared in a `nativeProps` helper with types. No stringly-typed `accessibilityRole` strings sprinkled in JSX — central registry.

9. **State-transition diagram per component.** `docs/components/<name>.md` must include a Mermaid state diagram showing every state and transition. Docs build fails if the diagram is absent for a hand-rolled component.

10. **`HAND_ROLLED.md` log per component.** Every hand-rolled native state component gets a `src/components/<Name>/HAND_ROLLED.md` file listing: (a) why Tamagui + Zag can't cover this, (b) the state-machine contract, (c) known edge cases, (d) planned migration path if Zag ever ships RN support. Makes the divergence auditable.

**Dropped guardrails (original #6 and #12) with rationale noted:**

- _(Original #6) Screen-reader sign-off checklist with video/transcript evidence:_ trimmed as too friction-heavy for a solo-maintainer workflow. Screen-reader testing still happens informally via guardrail #6 (real-device smoke) and guardrail #3 (a11y snapshot tests), just without mandatory video evidence per PR.
- _(Original #12) 48-hour PR cooling-off period:_ trimmed as unnecessary ceremony for a solo maintainer. Revisit when maintainer #2 joins.

**Total estimated cost added by these guardrails per component:** ~2 days beyond the base ~1-week component implementation (was ~2–3 days with the dropped guardrails). That brings per-component cost to ~1.4 weeks in practice. For the v0.1 + v0.2 native gap set (~5 components), that's ~7 weeks of guardrail+implementation time total — weight accordingly in phase planning.

### 3.10 Icons

- Ship `@superstyling/icons` as its own package with ~30–50 common icons + an `<Icon>` component accepting SVG path children.
- Library components use the built-in set internally; every icon-bearing prop accepts an override.
- `react-native-svg` as a peer dep on native (unavoidable).

### 3.11 Animation

- **CSS** on web (`@tamagui/animations-css`).
- **Moti + Reanimated** on native (`@tamagui/animations-moti`).
- `react-native-reanimated` and `moti` as peer deps. Playground and docs configured for Reanimated from day one (Babel plugin, Metro config).

### 3.12 Portals and overlay stacking

**Refined 2026-04-16 after reading `@tamagui/portal` source.**

- Tamagui's `<Portal>` / `<PortalItem>` for cross-platform mount mechanics. Web uses `createPortal` → `document.body` wrapped in `<TamaguiRoot>` for theme context preservation. Native uses teleport mode (preferred) with Gorhom-JS fallback.
- Tamagui's `@tamagui/z-index-stack` provides `useStackedZIndex` + `ZIndexHardcodedContext` for stack-aware z-index — we **reuse this** for visual stacking and do not reimplement.
- Our own **overlay registry** on top adds only what Tamagui doesn't: stack-aware Escape handling (topmost dismisses first), outside-click propagation rules, central programmatic-dismiss API, focus-trap coordination between nested overlays. Scope: ~50–100 LOC, not the full "build our own overlay system."
- Web mount target: `<TamaguiRoot>`-wrapped div in `document.body` (Tamagui's default).
- Native mount target: teleport host registered at `"root"` name; `@superstyling/expo` ensures this is wired so users never hit the Gorhom silent-context-loss fallback path.
- Scoped portals via `container` prop on each overlay (for iframes, shadow DOM, nested scroll cases).
- `passThrough` prop on every overlay (Tamagui pattern) — renders inline without portaling, useful for testing and edge cases.
- Z-index scale: Chakra's (`hide/auto/base/docked/dropdown/sticky/banner/overlay/modal/popover/skipLink/toast/tooltip`) exposed as semantic tokens.

### 3.13 SSR strategy

- Integration packages (`@superstyling/next`, `@superstyling/expo`, `@superstyling/vite`) ship in v0.1.
- Responsive props: render `base` value on server, swap to breakpoint-matched values after hydration.
- Portals: defer mounting until after hydration via internal `useIsMounted`.
- RSC readiness: `core` components are client components (`"use client"` directive). RSC-server-safe split deferred to v0.2 but not blocked architecturally.

---

## 4. Development infrastructure

### 4.1 Library build

- **`@tamagui/build`** — purpose-built for Tamagui-based libraries, handles `.native.ts` / `.web.ts` resolution correctly.
- ESM primary; dual-build as `@tamagui/build` decides — we follow its conventions rather than fighting them.
- `sideEffects: false` in each package's `package.json`.
- JSX: automatic runtime (React 17+).

### 4.2 Testing

- **Vitest** — logic tests (Node) and web component tests (happy-dom).
- **Jest + `@testing-library/react-native` + `jest-expo`** — native component tests.
- **Playwright component tests** — real-browser web tests.
- **Maestro** — native E2E on iOS Simulator + Android Emulator, pointed at `apps/playground`.
- **No visual regression in v0.1** — add Chromatic + Storybook in v0.2.
- **No snapshot tests** — prefer role/label-based assertions.

### 4.3 Linting, formatting, git hooks

- **Oxlint** as linter.
- **Oxfmt** as formatter. Flag: if Oxfmt isn't stable at project start, use Prettier as temporary bridge and swap when Oxfmt hits 1.0.
- **lefthook** for pre-commit hooks.

### 4.4 CI

- **GitHub Actions** with tiered gating:
  - **Fast lane (merge-blocking):** lint, typecheck, build, Vitest, Jest native (no device), Playwright web. Linux, 5–10 min.
  - **Slow lane (advisory):** Maestro iOS (macOS-14), Maestro Android (Ubuntu). 15–25 min.
  - **Nightly:** full matrix across Node 20/22, multiple iOS Simulator versions, multiple Android API levels.
- Concurrency: cancel in-progress runs on new pushes.
- Upload Playwright traces and Maestro videos on failure.
- Node 20 LTS primary.

---

## 5. Docs and playground

### 5.1 Docs site

- **Custom Vite-based app** in `apps/docs`.
- **One (onestack.dev)** as the universal React framework — dogfoods our library on web + iOS + Android from a single codebase.
- MDX for content, Sandpack for live code (web), Expo Snack embeds for native previews (fallback where One-native isn't ideal), Pagefind for search.
- Pre-1.0 risk accepted; fallback plan if One proves unworkable is to swap to Vike or Astro Starlight.

### 5.2 Playground

- **Expo + Expo Router** in `apps/playground`, kept intentionally conventional (not using One) so it remains a stable fallback if One has issues.
- One route per component exercising every variant × size × colorScheme × state.
- Not shipped to npm. Target for Maestro E2E flows in CI.

---

## 6. Release, versioning, and community

### 6.1 Versioning

- **Changesets** + **fixed versioning** + **strict semver even pre-1.0** (breaking changes bump the `y` in `0.y.z`).
- `@changesets/action` blocks PRs that modify `packages/*/src/**` without a changeset.
- Release PR workflow: Changesets bot opens "Version Packages" PR with bumps + aggregated changelog; merging triggers publish.
- Pre-release track: `next` / `canary` for previews.
- npm public registry.

### 6.2 Community

- **License:** MIT.
- **No CLA.**
- **Code of Conduct:** Contributor Covenant v2.1.
- **CONTRIBUTING.md:** concise v0.1, expanded as community grows.
- **No formal RFC process** initially; GitHub Issues + Discussions until the process breaks down.
- **Issue templates:** Bug Report, Feature Request, Documentation, Question/Support.
- **Governance:** solo maintainer (benevolent-dictator) for now; formalize when maintainer #2 is imminent.

---

## 7. Dependency ledger (committed runtime + peer deps)

**Direct runtime deps (our library's `dependencies`):**

- Tamagui core packages (`tamagui`, `@tamagui/core`, `@tamagui/web`, etc. — specific list nailed down in Phase 1).
- `@tamagui/animations-css` + `@tamagui/animations-moti` drivers.
- Small set of `@zag-js/*` machines (field, toast, and whichever component machines we use as v0.1 grows; each is small, all from one vendor).

**Peer deps (users install):**

- `react`, `react-dom`, `react-native`.
- `react-native-svg` (native icons).
- `react-native-reanimated`, `moti` (native animations).
- `expo` (for the Expo integration package).
- `next` (for the Next integration package).
- `vite` (for the Vite integration package).

**Dev deps (our monorepo only, not shipped):**

- `typescript`, `@tamagui/build`, Yarn v4, Turborepo.
- Vitest, Jest + jest-expo + `@testing-library/*`, Playwright, Maestro.
- Oxlint, Oxfmt, lefthook, Changesets + `@changesets/action`.
- One, MDX plumbing, Sandpack, Pagefind (in `apps/docs` only).

Direct runtime dep count stays small; peer deps are platform-appropriate and mostly unavoidable.

---

## 8. Phased roadmap

### Phase 0 — Prior art audit (~1 week)

- Read sources of the 8 libraries: Tamagui's own components, Gluestack v2, Chakra v3, Radix, Zag + Ark, NativeBase, NativeWind, Dripsy/Restyle.
- Produce `docs/prior-art/`:
  - `README.md` — intro + navigation
  - `libraries.md` — per-library notes (~1 page each)
  - `component-matrix.md` — rows = v0.1/v0.2 components, columns = each library, cells = "how does this lib implement this component?"
  - `gotchas.md` — footguns and lessons learned
- 5-day timebox, hard stop at 7.
- **Division of labor:** Claude reads source and drafts docs; Nate hands-on-uses Gluestack and Chakra v3 to add firsthand DX notes.
- **Exit:** we can answer portal, focus-trap, keyboard-nav, color-mode, and theme-override questions for each library from memory.

### Phase 1 — Scaffolding (~1 week)

- Initialize Yarn v4.13.0 + Turborepo monorepo with 7 packages.
- Configure `@tamagui/build` for `core`, `icons`, `next`, `expo`, `vite`.
- Set up Oxlint + Oxfmt + lefthook + Changesets + `@changesets/action`.
- Configure Vitest (two configs: logic + web-component), Jest + jest-expo (native), Playwright component, Maestro.
- Tiered GitHub Actions CI with concurrency, artifact upload, fast/slow/nightly lanes.
- Write MIT LICENSE, CoC, CONTRIBUTING.md, 4 issue templates.
- Stub `createSystem()`, `<SuperStylingProvider>`, base Tamagui config.
- Stub `apps/docs` (One + MDX + Sandpack + Pagefind, "Hello world" page).
- Stub `apps/playground` (Expo + Expo Router, "Hello world" screen).
- **Exit:** `yarn dev` starts docs + playground with `<Box>Hi</Box>`. All CI scripts green.

### Phase 2 — Foundation layer (~2–3 weeks)

- Theme + token system (Chakra shape + `semanticTokens`).
- Color mode (`useColorMode`, `useColorModeValue`, `<ColorModeScript/>`, system preference following, persistence).
- Style prop engine (full shortcut set via Tamagui `shorthands`).
- Pseudo-props (cross-platform set + typed web-only extras).
- Restricted `sx` prop.
- Object-form responsive props with Chakra breakpoints.
- `colorScheme` implemented via nested `<Theme>`.
- `createSystem()` build-time expansion.
- `asChild` + `tag` prop.
- Overlay registry + Tamagui portal wiring.
- Declaration-merging types + CLI boilerplate generator.
- Components: `Box`, `Stack`, `HStack`, `VStack`, `Text`, `Heading` (with `level` prop).
- **Exit:** `<Box p={4} bg="blue.500" _hover={{ bg: "blue.600" }}>` works on web + iOS + Android. Color mode toggles. Tests cover token resolution, shortcut/pseudo-prop translation, responsive expansion.

### Phase 3 — Tier 1 primitives (~3–4 weeks)

- `Button`, `IconButton`, `Link`, `Divider`, `Spinner`, `Badge`, `Alert`, `Avatar`.
- `@superstyling/icons`: initial icon set + `<Icon>` component.
- Per component: implement + docs page + playground entry + tests.
- **Exit:** all 8 pass on Tier A platforms; each has a docs page with Sandpack.

### Phase 4 — Modal (the forcing function) (~2 weeks)

- Portal integration + overlay registry participation.
- Focus trap via Zag's dialog machine.
- Scroll lock on web, native modal presentation on iOS/Android.
- Animation: CSS transition on web, Moti spring on native.
- Keyboard dismissal, click-outside dismissal, a11y announcements.
- **Exit:** Modal works on web + iOS + Android with no hydration errors on Next.js Pages, no jank on native, passes screen-reader testing.

### Phase 5 — Tier 1 form components (~3–4 weeks)

- `Input`, `Textarea`, `Checkbox`, `Radio`, `Switch`, `Select` (native picker), `FormControl.*` (on Zag's field machine).
- Screen-reader verification per component.
- **Exit:** a login + settings screen in the playground composed only of these components feels natural and a11y-correct.

### Phase 6 — Integration packages (~2 weeks)

- `@superstyling/next`: `<SuperStylingDocument>`, `<ColorModeScript>` auto-injection, Next plugin wrapper, SSR helpers.
- `@superstyling/expo`: Expo config plugin, Metro/Babel config helper (including Reanimated), SDK compatibility.
- `@superstyling/vite`: Vite plugin wrapper, `index.html` mode-script snippet, SSG helpers for Vike/One setups.
- **Exit:** fresh `create-next-app`, `create-expo-app`, and `create-vite` projects each achieve a working setup in under 5 minutes.

### Phase 7 — Docs, examples, polish (~2–3 weeks)

- Docs page per v0.1 component with live examples.
- 3–5 full example apps (login flow, settings screen, validated form, theming customization, color mode).
- Getting Started guides per platform (Next, Expo, Vite).
- Pagefind index built.
- Optional: screen-recorded setup walkthroughs.
- **Exit:** a new user lands on the docs and has `<Button>` running in under 10 minutes.

### Phase 8 — Pre-release hardening (~1–2 weeks)

- Manual walkthrough: every component on every Tier A platform.
- Maestro flows for critical paths (Modal open/close, form submit, color mode toggle).
- Dogfood: build a real sample app (e.g., TODO with auth) using only the library. Every rough edge is a bug to file and fix.
- Write CHANGELOG (aggregated via Changesets).
- **Exit:** you'd use v0.1 in your own production project.

### Phase 9 — Publish v0.1.0 (~1 day)

- Cut release via Changesets.
- Publish all 5 `packages/*` to npm.
- Announcement: blog post, X, relevant Discord/subreddit, Tamagui community.

**Total: ~16–22 weeks (4–5.5 months) full-time.**

---

## 9. Risks and open questions

- **One (docs framework) is pre-1.0.** Mitigation: fallback plan to Vike or Astro Starlight if blocking issues emerge. Budget 1 week of slack in Phase 1 to evaluate and pivot if needed.
- **Oxfmt may not be stable** at project start. Mitigation: use Prettier as temporary bridge, swap later.
- **`@zag-js/*` React Native support** is uneven — some machines are better tested on RN than others. Mitigation: per-component evaluation during audit (Phase 0) and implementation phases.
- **Reanimated bare-RN setup complexity** for Tier B. Mitigation: deferred to v0.2; bare RN users can follow Tamagui's existing Reanimated setup instructions in the interim.
- **Native E2E flakiness.** Mitigation: slow-lane CI (doesn't block merges), retries on known flaky flows, video artifacts on failure.
- **TypeScript perf at scale** (the Chakra v2 trap). Mitigation: declaration-merging strategy, no deep generics, monitor with `--generateTrace` during Phase 2.
- **Tamagui compiler interaction with our translation layer** — some Chakra-shaped props may not extract at compile time through our translation without a custom compiler plugin. Mitigation: v0.1 accepts runtime fallback for translated props; a compiler plugin is a v0.2 optimization target.

---

## 10. v0.1 success criteria

v0.1 ships when:

1. All 16 Tier 0 + Tier 1 components work on all Tier A platforms.
2. CI is green on fast lane + slow lane.
3. Docs site has a page per component with live examples.
4. Getting Started guides work end-to-end for Next.js, Expo, and Vite from a fresh install.
5. A sample app ("dogfood target") is buildable using only the library.
6. CHANGELOG is written and ready.
7. Nate would use v0.1 in his own production project without caveats.
