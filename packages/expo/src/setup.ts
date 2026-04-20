/**
 * `@superstyling/expo/setup` — Side-effect import that wires the required
 * Tamagui native modules. Import this once at app entry (before any
 * `SuperStylingProvider` renders):
 *
 * ```ts
 * // index.js or App.tsx
 * import "@superstyling/expo/setup";
 * ```
 *
 * Order matters. This module imports in the order Tamagui expects:
 *   1. `setup-teleport` — registers `react-native-teleport` so the native
 *      Portal uses teleport mode (context-preserving). Without this, Sheet /
 *      Modal / Dropdown portals lose React context on native (silent bug).
 *   2. `setup-gesture-handler` — wires `react-native-gesture-handler` for
 *      pan/swipe (required for Sheet drag-to-dismiss, pull-to-refresh, etc.).
 *   3. `setup-worklets` — registers `react-native-worklets` / worklets-core
 *      so Reanimated-backed animations work.
 *   4. `setup-safe-area` — wires `react-native-safe-area-context` insets.
 *   5. `setup-keyboard-controller` — keyboard-aware interactions.
 *
 * Each setup module is a try/catch around a dynamic require, so missing
 * optional peers never throw — they just leave that capability disabled.
 */

/* oxlint-disable import/no-unassigned-import -- this file is the side-effect entry */
import "@tamagui/native/setup-teleport";
import "@tamagui/native/setup-gesture-handler";
import "@tamagui/native/setup-worklets";
import "@tamagui/native/setup-safe-area";
import "@tamagui/native/setup-keyboard-controller";
