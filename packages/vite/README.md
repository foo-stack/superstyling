# @superstyling/vite

Vite integration for [Superstyling](https://github.com/natestack/superstyling). Wraps `@tamagui/vite-plugin`, composes the needed aliases and `optimizeDeps` hints, and ships a color-mode script snippet for FOUC-free first paint.

## Install

```sh
yarn add @superstyling/core @superstyling/vite
yarn add -D react-native-web
```

## Usage

`vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { superstylingVitePlugin } from "@superstyling/vite";

export default defineConfig({
  plugins: [
    react(),
    superstylingVitePlugin({
      config: "./tamagui.config.ts",
      components: ["@superstyling/core"],
    }),
  ],
});
```

`index.html` — prevent color-mode FOUC:

```html
<script>
  /* paste output of colorModeScriptSnippet() here at build time */
</script>
```

## Docs

See the [Vite getting-started guide](https://github.com/natestack/superstyling/blob/main/apps/docs/pages/getting-started/vite.mdx).

## License

MIT
