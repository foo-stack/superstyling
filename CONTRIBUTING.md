# Contributing to Superstyling

Thanks for your interest. Superstyling is pre-v0.1 and in active scaffolding, so contribution surface is still narrowing. This guide is intentionally concise and will grow as the project matures.

## Ground rules

- Follow the [Code of Conduct](./CODE_OF_CONDUCT.md).
- Every non-trivial PR should reference an issue (open one first if needed).
- Every PR that changes `packages/*/src/**` must include a Changeset — CI will block without it (see below).

## Prerequisites

- **Node.js 20+** (see `.nvmrc`)
- **Corepack** enabled (ships with Node; run `corepack enable` once per machine)
- **Yarn 4.13.0** — auto-provisioned via Corepack from the `packageManager` field in `package.json`

## One-time setup

```bash
git clone https://github.com/foo-stack/superstyling.git
cd superstyling
corepack enable
yarn install
```

The first install also runs `lefthook install` via the `prepare` script, which wires pre-commit hooks for lint + format.

## Repository layout

```
packages/
  core/      → @superstyling/core — components, theme, style-prop engine
  icons/     → @superstyling/icons — icon set and <Icon> component
  next/      → @superstyling/next — Next.js integration
  expo/      → @superstyling/expo — Expo integration
  vite/      → @superstyling/vite — Vite integration
apps/
  docs/      → documentation site (One / Vite)
  playground/ → cross-platform dogfooding app (Expo)
docs/
  prior-art/ → Phase 0 audit notes
```

## Everyday commands

```bash
yarn dev          # Run all apps in dev mode (persistent)
yarn build        # Build all publishable packages via Turbo
yarn typecheck    # Type-check every workspace
yarn test         # Run all tests
yarn lint         # Oxlint across the repo
yarn format       # Oxfmt write
yarn format:check # Oxfmt check only (no writes)
```

## Adding a changeset

Any PR that modifies `packages/*/src/**` must include a Changeset describing the change:

```bash
yarn changeset
```

Follow the prompts. Pick the appropriate bump type (major / minor / patch). Commit the generated markdown file along with your changes.

Docs-only, test-only, and tooling-only PRs don't need a changeset. CI gives you a clear error if one is missing.

## Pull request flow

1. Fork, branch off `main` with a descriptive name (`feat/color-mode-script`, `fix/token-resolver-null`).
2. Make your changes. Add tests where applicable.
3. Run `yarn lint && yarn typecheck && yarn test` locally.
4. Open a PR against `main`. Reference the related issue.
5. CI fast-lane must be green before merge. Slow-lane (Maestro E2E) is advisory but reviewed before merge.

## Where to get help

- Open a GitHub Issue with the `question` template.
- Check the Phase 0 audit docs in `docs/prior-art/` — your question may be answered there.

## Project direction

`PLAN.md` is the source of truth for architectural decisions. If a decision looks wrong, open an issue rather than a PR — we'd rather discuss the design first.
