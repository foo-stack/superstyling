# Changesets

This directory is managed by [changesets](https://github.com/changesets/changesets). Don't edit files here by hand (except `config.json`).

## Adding a changeset

Run `yarn changeset` at the repo root. It'll prompt you for the changed packages, bump type, and a short description, then write a markdown file to this directory.

Commit the generated file alongside your code changes.

## Versioning policy

- **Fixed versioning:** all `@superstyling/*` packages share the same version number. A minor bump to `core` bumps `icons`, `next`, `expo`, `vite` to the same version.
- **Strict semver, even pre-1.0.** Breaking changes bump the `y` in `0.y.z`; features bump minor; fixes bump patch.
- Apps (`docs`, `playground`) are never published and are ignored by changesets.

## Release flow

1. PRs merge to `main` with their changesets.
2. The Changesets GitHub Action opens a "Version Packages" PR aggregating all pending changesets.
3. Merging that PR triggers the publish workflow.
