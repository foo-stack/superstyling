# Superstyling

Cross-platform UI library combining Chakra UI's developer experience with Tamagui's cross-platform engine. Web + iOS + Android from a single API.

**Status: v0.1.0 shipped** · [npm](https://www.npmjs.com/package/@superstyling/core)

## Documentation

- [`docs/prior-art/`](./docs/prior-art/) — audit of existing Tamagui/Chakra/Zag/Radix/etc. libraries
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — how to set up the repo and contribute
- [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) — community standards
- [Changelogs](./packages/core/CHANGELOG.md) — per-package release notes

## Packages

| Package               | Purpose                                               |
| --------------------- | ----------------------------------------------------- |
| `@superstyling/core`  | Components, theme, style-prop engine                  |
| `@superstyling/icons` | Default icon set and `<Icon>` component               |
| `@superstyling/next`  | Next.js integration (SSR, color mode, plugin wrapper) |
| `@superstyling/expo`  | Expo integration (Metro, Babel, teleport host)        |
| `@superstyling/vite`  | Vite integration (plugin, SSG helpers)                |

## Getting started

```sh
yarn add @superstyling/core @superstyling/vite react-native-web
```

Framework-specific guides: [Next.js](https://github.com/foo-stack/superstyling/blob/main/apps/docs/data/docs/getting-started/next.mdx), [Expo](https://github.com/foo-stack/superstyling/blob/main/apps/docs/data/docs/getting-started/expo.mdx), [Vite](https://github.com/foo-stack/superstyling/blob/main/apps/docs/data/docs/getting-started/vite.mdx).

## License

MIT — see [`LICENSE`](./LICENSE).
