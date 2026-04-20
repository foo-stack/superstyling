# Spike plan: Tamagui-side shorthand typing via module augmentation

**Status:** not started · **Drafted:** 2026-04-20 · **Triggering deferral:** P2.6 follow-up flag

## Context

P2.6 shipped a CLI (`superstyling init-types`) that generates a `superstyling.d.ts` augmenting Tamagui's `TamaguiCustomConfig` with our system's config. The file is correct; activating it in a consumer app reveals a TypeScript collision:

> `Type '{ children: string; }' is not assignable to type '... (WithThemeShorthandsAndPseudos<…> & { "$platform-native"?: … }) | undefined'.`

Tamagui's augmented `TextProps` includes an index signature that captures `children` and demands it satisfy `StyleValue`, which `string | ReactNode` doesn't. Until this is resolved, users must write long-form props (`padding="$4"`) rather than shortcuts (`p="$4"`).

This spike does not block further work — long-form props are fully functional. It's a DX win worth pursuing in a dedicated timeboxed session.

## Goal

Make `yarn superstyling init-types` produce a `.d.ts` that, when included in a consumer app, lets users write Chakra shortcuts (`<Box p="$4" bg="$primary">Hello</Box>`) **without breaking JSX `children` typing**.

## Success criteria

1. Generated `superstyling.d.ts` added to `tsconfig.include` in `apps/playground`
2. `<Box p="$4">Hello</Box>` typechecks with autocomplete on `p` (token names) and `children` still accepts `string | ReactNode`
3. `yarn typecheck` green on the full repo
4. All existing tests (70+ at time of drafting) still pass
5. No new `any` casts introduced at component boundaries

---

## Phase A — Diagnosis (timebox: **3 hrs**)

**A1.** Reproduce minimally in isolation (outside monorepo): 3-file project with `tamagui@2.0.0-rc.41`, a trivial `createTamagui({ shorthands: { p: "padding" } })`, and a component that accepts `children: string`. Confirm the `children` vs index-signature collision occurs independently of our code.

**A2.** Read `@tamagui/web/types/types.d.ts` to understand how `TextProps` / `StackProps` are constructed when `TamaguiCustomConfig` is augmented. Specifically identify where the index signature comes from — is it `WithShorthands`? `WithPseudoProps`? Something else?

**A3.** Search:

- `github.com/tamagui/tamagui/issues` for "children", "index signature", "augmentation", "TamaguiCustomConfig"
- Tamagui Discord / GitHub Discussions for the same
- Any prior art: how do `@tamagui/button`, `@tamagui/sheet` etc. handle this? They accept children, so they must have solved it.

**A4.** Write a short `docs/spikes/shorthand-typing-diagnosis.md` (~1 page) with root cause + 2–3 candidate fixes and confidence level for each.

**Exit criteria for Phase A:** can explain in one paragraph why the error happens and list at least two concrete approaches with reasoning for each.

---

## Phase B — Strategy pick (timebox: **1 hr**)

Candidate strategies (will be narrowed by A4):

- **B.i — Narrower augmentation.** Emit a `.d.ts` that augments only `tokens` and `themes`, not `shorthands`. Shortcut keys still typed via Tamagui's built-in shorthand inference. Lower DX ambition; likely lower risk.
- **B.ii — Explicit shape augmentation.** Augment `TamaguiCustomConfig` with field-by-field assignments (`shorthands: Shorthands, tokens: Tokens`) instead of `extends`. May prevent the over-strict index signature from propagating. Medium risk.
- **B.iii — Our own prop type layer.** Don't augment Tamagui at all. Ship `BoxProps`, `TextProps`, `HeadingProps` with explicit Chakra shortcut keys typed against our `SuperStylingCustomTheme`. Widest freedom but most surface area we own.
- **B.iv — Prototype patch upstream.** If root cause is a genuine Tamagui bug, patch locally via `.yarn/patches`, file issue, use patched version until fixed upstream. Highest-leverage if viable.

**Decision:** pick one based on A4 findings + effort vs reward. Document decision in PLAN.md (new §3.6.1 or similar).

---

## Phase C — Implementation (timebox: **4–8 hrs** depending on strategy)

**C1.** Apply the chosen strategy:

- If **B.i**: rewrite `cli.mjs` + `src/cli/generate.ts` to emit the narrower augmentation.
- If **B.ii**: rewrite the generator to emit field-by-field augmentation.
- If **B.iii**: write `packages/core/src/components/props.ts` with hand-authored `BoxProps`/`TextProps`/`HeadingProps`/`StackProps`; swap our primitives' prop types to use these; the CLI becomes a no-op or optional since we don't need augmentation.
- If **B.iv**: add the Tamagui patch via `yarn patch`, commit `.yarn/patches/*` to the repo.

**C2.** Regenerate `superstyling.d.ts` in `apps/playground`, add to `tsconfig.include`, switch the playground app's `index.tsx` to use shortcuts (`p="$4"`, `mt="$4"`). Verify `yarn typecheck` on playground.

**C3.** Update generator tests in `packages/core/src/cli/generate.test.ts` to cover the new emitted shape.

**C4.** Run full exit check: `yarn typecheck && yarn lint && yarn test`. All must stay green.

---

## Phase D — Fail-safe (triggered if **A+B+C exceed 16 hrs total**)

If no strategy works cleanly:

- Roll back any in-progress changes
- Document the limitation in PLAN.md §9 risk with the diagnosis + why each strategy failed
- Update `CONTRIBUTING.md` and the CLI `--help` to explicitly tell users to use long-form props (`padding` not `p`) until the typing issue is resolved
- File a Tamagui GitHub issue with the minimal reproduction from A1
- Add to PROGRESS.md decision log: "spike completed — no fix landed in v0.1"
- **Hard stop.** Move on.

This fail-safe is important — without it, the task can easily eat a full week chasing TS-puzzle edge cases.

---

## Phase E — Wrap-up (30 min regardless of outcome)

- Update PLAN.md: if fix landed, record the chosen strategy and any design consequences; if not, mark as v0.2 carry-over.
- Update PROGRESS.md: either remove the #5 deferred item or move it with updated context.
- Update `@superstyling/core` README with the typed-props usage example (if a fix landed).

---

## Timebox & risk summary

- **Expected total:** 8–14 hrs of focused work
- **Hard stop:** 16 hrs → fail-safe exit
- **Confidence in landing a fix:** moderate (~60%). Uncertainty is driven by whether Tamagui v2-rc's prop-type architecture allows any augmentation pattern that preserves `children`.

---

## Open questions to resolve when kicking off

1. **Priority vs Phase 3?** Does this need to land before starting Tier 1 primitives (Button, Input, etc.) in Phase 3, or can it defer? Default position: can defer — nothing in Phase 3 requires shorthand typing; long-form props work.
2. **Strategy preference upfront?** If there's a strong prior on B.i / B.ii / B.iii / B.iv, pick accordingly and skip parts of Phase A. Default: let Phase A findings drive.
3. **Should the spike happen before the v0.1 release?** If yes, budget in the v0.1 timeline. If no, defer to v0.2.

---

## Prerequisites / dependencies

- Tamagui v2-rc.41 (current pin). If Tamagui publishes v2 stable or a newer RC before this spike starts, rerun Phase A to see if the problem still reproduces — a newer RC may have fixed this upstream.
- P2.6 CLI (`superstyling init-types`) — completed and working. This spike modifies what the CLI emits.

---

## Related

- `PLAN.md` §9 risk register (update on completion)
- `PROGRESS.md` Phase 2 "Still deferred" section, item #5
- `packages/core/cli.mjs` + `packages/core/src/cli/generate.ts` (likely touch targets)
- `packages/core/src/components/{Box,Stack,Text,Heading}.tsx` (may need prop-type changes depending on strategy)
