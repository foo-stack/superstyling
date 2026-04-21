# @superstyling/core

Components, theme, and style-prop engine for [Superstyling](https://github.com/natestack/superstyling) — a cross-platform UI library that brings Chakra UI's developer experience to Tamagui's cross-platform engine. Web + iOS + Android from a single API.

## Install

```sh
yarn add @superstyling/core react react-dom react-native-web
```

On native, additionally install `react-native` and the Tamagui native peer deps — see the [Expo getting-started guide](https://github.com/natestack/superstyling/blob/main/apps/docs/pages/getting-started/expo.mdx).

## Usage

```tsx
import { SuperStylingProvider, Button, defaultSystem } from "@superstyling/core";

export default function App() {
  return (
    <SuperStylingProvider system={defaultSystem}>
      <Button colorScheme="blue">Hello</Button>
    </SuperStylingProvider>
  );
}
```

Pair this package with one of the framework integrations:

- [`@superstyling/next`](https://github.com/natestack/superstyling/tree/main/packages/next) — Next.js
- [`@superstyling/expo`](https://github.com/natestack/superstyling/tree/main/packages/expo) — Expo
- [`@superstyling/vite`](https://github.com/natestack/superstyling/tree/main/packages/vite) — Vite (web)

## Docs

See the [docs site source](https://github.com/natestack/superstyling/tree/main/apps/docs) for every component, example, and getting-started guide.

## License

MIT
