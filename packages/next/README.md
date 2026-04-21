# @superstyling/next

Next.js integration for [Superstyling](https://github.com/natestack/superstyling). Wraps `@tamagui/next-plugin` and ships a color-mode script for FOUC-free SSR — plus ready-made `_document.tsx` helpers for the Pages Router and a `ColorModeScript` server component for the App Router.

## Install

```sh
yarn add @superstyling/core @superstyling/next
```

## Usage

`next.config.mjs`:

```js
import { withSuperStyling } from "@superstyling/next";

export default withSuperStyling({
  config: "./tamagui.config.ts",
  components: ["@superstyling/core"],
})({
  // your next config
});
```

App Router — in `app/layout.tsx`:

```tsx
import { ColorModeScript } from "@superstyling/next/app";

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <ColorModeScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

Pages Router — drop `SuperStylingDocument` into `pages/_document.tsx`.

## Docs

See the [Next.js getting-started guide](https://github.com/natestack/superstyling/blob/main/apps/docs/pages/getting-started/next.mdx).

## License

MIT
