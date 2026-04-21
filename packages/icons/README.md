# @superstyling/icons

Default icon set and `<Icon>` component for [Superstyling](https://github.com/natestack/superstyling). Ships 21 commonly used icons (chevrons, arrows, status, common UI) and a `createIcon` factory for custom glyphs.

## Install

```sh
yarn add @superstyling/icons
```

On native, additionally install `react-native-svg` — it's an optional peer dep used for the native icon primitive.

## Usage

```tsx
import { SearchIcon } from "@superstyling/icons";

<SearchIcon aria-label="Search" size={20} />;
```

Or build your own:

```tsx
import { createIcon } from "@superstyling/icons";

export const HeartIcon = createIcon({
  displayName: "HeartIcon",
  paths: ["M12 21s-7-4.35-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.65-7 10-7 10z"],
});
```

## Docs

See the [docs site source](https://github.com/natestack/superstyling/tree/main/apps/docs) for the full icon catalog and `<Icon>` / `createIcon` API.

## License

MIT
