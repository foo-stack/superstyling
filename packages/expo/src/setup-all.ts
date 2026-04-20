/**
 * `@superstyling/expo/setup-all` — Side-effect import that includes the
 * required setup (from `@superstyling/expo/setup`) plus optional integrations
 * that activate when their peer dep is installed:
 *
 *   - `setup-expo-linear-gradient` — swaps in `expo-linear-gradient` native
 *     component when present.
 *   - `setup-burnt` — native toasts (requires `burnt` peer).
 *   - `setup-zeego` — context menus / dropdown menus (requires `zeego` peer).
 *
 * If those peers aren't installed the corresponding setup is a no-op
 * (Tamagui guards each with try/require).
 *
 * Import this in place of `@superstyling/expo/setup` when you want the full
 * native feature set:
 * ```ts
 * import "@superstyling/expo/setup-all";
 * ```
 */

/* oxlint-disable import/no-unassigned-import -- this file is the side-effect entry */
import "./setup";
import "@tamagui/native/setup-expo-linear-gradient";
import "@tamagui/native/setup-burnt";
import "@tamagui/native/setup-zeego";
