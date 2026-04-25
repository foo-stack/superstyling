# @superstyling/codemod

Migrate a Chakra UI v2 codebase to [Superstyling](https://superstyling.dev) — a cross-platform UI library that pairs Chakra's developer experience with Tamagui's web + iOS + Android engine.

## Install + run

```bash
yarn dlx @superstyling/codemod ./src --dry   # preview
yarn dlx @superstyling/codemod ./src         # apply
```

The CLI walks the target directory (skipping `node_modules`, `.git`, `dist`, `build`, `.turbo`, `.next`, `.expo`), applies three passes per `.ts` / `.tsx` / `.js` / `.jsx` file, and prints a migration report at the end. Any value the codemod can't safely rewrite is annotated with a `TODO(superstyling)` comment plus a corresponding entry in the report.

## What it rewrites

### Pass 1 — imports

```tsx
// before
import { Button, useDisclosure } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

// after
import { Button, useDisclosure } from "@superstyling/core";
import { CloseIcon } from "@superstyling/icons";
```

Mapped sources: `@chakra-ui/react`, `@chakra-ui/core`, `@chakra-ui/icons`.

Unmapped Chakra subpackages — `@chakra-ui/theme-tools`, `@chakra-ui/styled-system`, `@chakra-ui/anatomy`, `@chakra-ui/cli` — are flagged with a `TODO(superstyling)` comment at the import statement.

### Pass 2 — provider

```tsx
// before
<ChakraProvider theme={theme}>…</ChakraProvider>

// after
<SuperStylingProvider system={theme}>…</SuperStylingProvider>
```

Both the import specifier and the JSX element are renamed. The `theme` prop becomes `system`. `ChakraBaseProvider` (the trimmed variant) is also renamed and additionally flagged for review since it implies a non-default provider stack.

### Pass 3 — theme construction

```tsx
// before
import { extendTheme } from "@chakra-ui/react";
const theme = extendTheme({ colors: {…}, components: {…} });

// after
import { createSystem, adaptChakraTheme } from "@superstyling/core";
const theme = createSystem(adaptChakraTheme({ colors: {…}, components: {…} }).theme);
```

Multi-arg `extendTheme(a, b, c)` is preserved via `Object.assign({}, a, b, c)`.

`extendBaseTheme`, `withDefaultColorScheme`, `withDefaultSize`, `withDefaultVariant` have no direct equivalent and are flagged for manual review.

## What it cannot automate

`adaptChakraTheme` will warn at runtime when the theme uses surfaces that don't have a Superstyling equivalent:

- `styles.global` — apply via a regular CSS file imported at app entry
- `layerStyles` / `textStyles` — flatten into `components.<Name>.variants`
- Function-valued `baseStyle` / `sizes` / `variants` (`StyleFunctionProps`) — convert to static objects, or use `semanticTokens` for per-mode values
- `cssVar(...)` and `mode(light, dark)` — replace with `semanticTokens: { colors: { name: { default: 'gray.800', _dark: 'gray.100' } } }`

See the full migration guide at <https://superstyling.dev/migration/from-chakra-v2> for side-by-side examples.

## Migration report

Every CLI run prints a report at the end:

```
Superstyling migration report
============================
Files touched: 14
Rewrites: 47  TODOs: 6  Skipped: 0

Open TODOs:
  src/App.tsx:8 — [provider] Renamed `theme` prop to `system`. If the value is still a Chakra theme object, wrap with `createSystem(adaptChakraTheme(theme).theme)`.
  src/theme.ts:3 — [theme] Review adaptChakraTheme warnings at runtime — `styles.global`, `layerStyles`, `textStyles`, and function-valued style configs are dropped.
  …
```

## License

MIT — Nathan Irikefe
