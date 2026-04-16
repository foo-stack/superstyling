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

### Milestone 3 — Package stubs + verify (pending)

- [ ] `@tamagui/build` wired into each `packages/*`
- [ ] `packages/core`: `createSystem()`, `<SuperStylingProvider>`, base Tamagui config
- [ ] `packages/icons`: `<Icon>` skeleton
- [ ] `packages/next`: skeleton
- [ ] `packages/expo`: skeleton with teleport-host registration
- [ ] `packages/vite`: skeleton
- [ ] `apps/docs`: One + MDX + Sandpack + Pagefind "Hello" page
- [ ] `apps/playground`: Expo + Expo Router "Hello" screen
- [ ] **Exit check:** `yarn dev` boots both apps; typecheck + build + test all green

---

## Phase 2 — Foundation layer (~2–3 weeks)

Status: **not started**

- [ ] Theme token shape (Chakra top-level) + `semanticTokens` layer
- [ ] Token resolver: Chakra-style → Tamagui tokens translation
- [ ] Color mode: `useColorMode`, `useColorModeValue`, `<ColorModeScript/>`
- [ ] Color mode: system-preference following + persistence (AsyncStorage native, localStorage+cookie web)
- [ ] Color mode: Tamagui theme provider integration
- [ ] Register full Chakra shortcut set in Tamagui `shorthands`
- [ ] Pseudo-prop translation: cross-platform set (`_hover`, `_focus`, etc.)
- [ ] Pseudo-prop translation: web-only set, typed accordingly
- [ ] Restricted `sx` prop (flat style objects + pseudo-props, no CSS selectors)
- [ ] Responsive object-form expander with Chakra breakpoints (`base/sm/md/lg/xl/2xl`, `em`)
- [ ] `colorScheme` prop → nested `<Theme>` sugar
- [ ] Auto-register each `theme.colors.*` scale as a Tamagui theme
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

Status: **not started**

For each component: implement + docs page + playground entry + tests (web + native).

- [ ] `Button`
- [ ] `IconButton`
- [ ] `Link`
- [ ] `Divider`
- [ ] `Spinner`
- [ ] `Badge`
- [ ] `Alert`
- [ ] `Avatar`
- [ ] `@superstyling/icons` initial icon set (~30–50 icons)
- [ ] `<Icon>` component + SVG path children API
- [ ] **Exit check:** all 8 components pass on Tier A; each has a docs page with Sandpack

---

## Phase 4 — Modal (forcing function) (~2 weeks)

Status: **not started**

- [ ] Integrate Modal with overlay registry
- [ ] Focus trap (Zag dialog machine)
- [ ] Scroll lock (web)
- [ ] Native modal presentation (iOS + Android)
- [ ] CSS transition (web) + Moti spring (native)
- [ ] Keyboard dismissal + click-outside dismissal
- [ ] A11y announcements (ARIA on web, `accessibilityViewIsModal` on iOS, equivalent on Android)
- [ ] Verify no hydration errors on Next.js Pages
- [ ] Screen-reader testing (VoiceOver iOS, TalkBack Android, NVDA/JAWS web)
- [ ] **Exit check:** Modal works on every Tier A platform without jank or a11y regressions

---

## Phase 5 — Tier 1 form components (~3–4 weeks)

Status: **not started**

- [ ] `Input`
- [ ] `Textarea`
- [ ] `Checkbox`
- [ ] `Radio`
- [ ] `Switch`
- [ ] `Select` (native picker on iOS/Android, styled native-feel on web)
- [ ] `FormControl.Root` / `FormControl.Label` / `FormControl.HelperText` / `FormControl.ErrorMessage`
- [ ] Integrate Zag `field` machine
- [ ] Per-component screen-reader verification
- [ ] **Exit check:** login + settings screen in playground using only these components feels natural and a11y-correct

---

## Phase 6 — Integration packages (~2 weeks)

Status: **not started**

- [ ] `@superstyling/next`: `<SuperStylingDocument>`, `<ColorModeScript>` auto-injection, Next plugin wrapper, SSR helpers
- [ ] `@superstyling/expo`: Expo config plugin, Metro/Babel helper (including Reanimated), SDK compat
- [ ] `@superstyling/vite`: Vite plugin wrapper, `index.html` mode-script snippet, SSG helpers for Vike/One
- [ ] **Exit check:** fresh `create-next-app`, `create-expo-app`, `create-vite` each achieve working setup in <5 minutes

---

## Phase 7 — Docs, examples, polish (~2–3 weeks)

Status: **not started**

- [ ] Docs page per v0.1 component (16 pages, all with live Sandpack examples)
- [ ] Example app: login flow
- [ ] Example app: settings screen
- [ ] Example app: form with validation
- [ ] Example app: theming customization walkthrough
- [ ] Example app: color mode integration
- [ ] Getting Started — Next.js
- [ ] Getting Started — Expo
- [ ] Getting Started — Vite
- [ ] Pagefind index built and deployed
- [ ] (Optional) screen-recorded setup walkthroughs
- [ ] **Exit check:** new user goes from docs landing to running `<Button>` in <10 minutes

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

_(No revisions yet — planning complete 2026-04-16.)_
