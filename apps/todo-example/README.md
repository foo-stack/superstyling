# Superstyling — TODO dogfood sample

A small TODO-with-auth app built from only `@superstyling/*` primitives. Used during Phase 8 hardening to surface rough edges that only show up when a library is used the way a real consumer would use it.

## Run

```bash
cd apps/todo-example
yarn dev
```

Sign-in is client-only:

- Email must contain `@`.
- Password must be `todo` (any other value shows the error alert).

## What it exercises

- **Forms:** `FormControl`, `Input` (text + email + password), `Checkbox`, `Radio`/`RadioGroup`, `Switch`
- **Interactive:** `Button` (variants, `leftIcon`, `isLoading`, `isDisabled`), `IconButton`
- **Feedback:** `Alert` (error + info variants), `Badge`
- **Media:** `Avatar` with `Avatar.Fallback`
- **Overlay:** `Modal` (size `md` + `sm`, two separate instances on one screen)
- **Layout:** `Box`, `HStack`, `VStack`, `Divider`
- **State:** `useColorMode` + toggle
- **Icons:** `PlusIcon`, `CloseIcon`, `SunIcon`, `MoonIcon` from `@superstyling/icons`
- **Integration:** `@superstyling/vite`'s `superstylingVitePlugin` in `vite.config.ts`

## Rough edges found during dogfooding (Phase 8)

These are real issues a fresh consumer hit following our published Getting Started paths. Each is a candidate GitHub issue.

### 1. `declare module "tamagui" { … }` in the Getting Started guide breaks type safety

Our [`/getting-started/vite`](../docs/pages/getting-started/vite.mdx) guide and `tamagui.config.ts` template tell users to add:

```ts
declare module "tamagui" {
  interface TamaguiCustomConfig extends typeof system.config {}
}
```

Copy-pasting that verbatim into this app triggered 30+ strict-type errors across `@superstyling/core` (`Alert`, `Avatar`, `Badge`, `Heading`, …). Examples:

- `Alert.tsx:77` — `ref: never` rejected once `TamaguiElement` becomes concrete.
- `Badge.tsx:64` — computed `paddingHorizontal: any` not assignable to `SpaceTokens`.
- `Avatar.tsx:23` — root-level spread rejects augmented prop bag.

Root cause: Tamagui v2 RC41's inferred types loosen when `TamaguiCustomConfig` is empty (the default) and tighten to actual constraints once you augment. Our components have latent strict-mode gaps that the loose default masks.

Workaround in this app: skip the `declare module` block — the `tamagui.config.ts` file here is only augmentation-free to let the app build.

Fix direction (follow-up): either tighten every component in `@superstyling/core` to pass under strict augmentation, or ship an internal escape-hatch type we export for consumer configs (`SuperstylingConfig` that doesn't trigger the re-check).

### 2. `react-native` must be aliased to `react-native-web` in the consumer's Vite config

Not documented in the Vite Getting Started guide. Our components do `import { Platform } from "react-native"` (for Platform.OS branches in `Heading` and `FormControl`), which Vite's bundler can't parse because `react-native/index.js` is Flow-typed. `@superstyling/vite`'s plugin adds the alias, but the host app also needs `react-native-web` installed as a dependency.

**Fix:** document the `react-native-web` dep install in the Vite Getting Started guide, or move `react-native-web` from peer to dep in `@superstyling/vite` with `peerDependenciesMeta: { optional: false }` so it's installed transitively.

### 3. Settings-modal Switch `defaultIsChecked` doesn't visually reflect initial state on SSR hydration

`<Switch defaultIsChecked>` inside the settings modal renders "off" for the first frame before switching to "on". Not tested on native. Likely the uncontrolled Tamagui Switch doesn't commit `defaultChecked` before its initial paint.

**Fix direction:** prefer controlled `isChecked` + `useState` default inside the component.

## Not exercised

Deferred to future dogfood rounds:

- `Select` (`<Select.Option>` live preview — used on `/components/select` docs page but not here yet)
- `Textarea` (multi-line input)
- `Text` responsive `fontSize` breakpoints
- `Spinner` standalone (only used inside `Button isLoading`)
- `Link` (`isExternal` vs internal)
