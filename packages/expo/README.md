# @superstyling/expo

Expo integration for [Superstyling](https://github.com/foo-stack/superstyling). Ships the required Tamagui native setup side-effects (teleport host, gesture handler, worklets, safe-area, keyboard), a Babel preset with the Tamagui compiler, a Metro config helper, and an Expo config plugin.

## Install

```sh
yarn add @superstyling/core @superstyling/expo
```

## Usage

`app/_layout.tsx` — run the Tamagui native setup side-effect once at the app root:

```ts
import "@superstyling/expo/setup";
```

`babel.config.js`:

```js
const { babelPreset } = require("@superstyling/expo/babel-plugin");

module.exports = {
  presets: [...babelPreset({ components: ["@superstyling/core"], config: "./tamagui.config.ts" })],
};
```

`metro.config.js`:

```js
const { getDefaultConfig } = require("expo/metro-config");
const { withSuperStylingMetro } = require("@superstyling/expo/metro-config");

module.exports = withSuperStylingMetro(getDefaultConfig(__dirname), {
  components: ["@superstyling/core"],
  config: "./tamagui.config.ts",
});
```

## Docs

See the [Expo getting-started guide](https://github.com/foo-stack/superstyling/blob/main/apps/docs/pages/getting-started/expo.mdx).

## License

MIT
