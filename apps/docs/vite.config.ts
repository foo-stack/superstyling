import { resolve as pathResolve } from "node:path";
import { tamaguiPlugin } from "@tamagui/vite-plugin";
import { one } from "one/vite";
import type { UserConfig } from "vite";

/**
 * Minimal vite.config for the One+Tamagui docs rebuild spike.
 *
 * Structure copied from tamagui/tamagui @ code/tamagui.dev/vite.config.ts
 * (verified 2026-04-21). The config prevents the dual-React SSR crash that
 * killed our Phase 7 One attempt via:
 *
 *   - optimizeDeps.include with the core tamagui/rn/react packages, forcing
 *     Vite to pre-bundle them together so only one copy is loaded
 *   - resolve.dedupe with the same list, keeping the single copy wired up
 *     through resolution
 *   - ssr.noExternal: true, forcing every import through Vite's transform
 *     pipeline instead of Node's require()
 *   - One-level ssr.dedupeSymlinkedModules + autoDepsOptimization to carry
 *     the dedupe discipline across workspace symlinks
 */

const include = [
  // core tamagui packages must be pre-bundled together to avoid duplicate instances
  "tamagui",
  "@tamagui/core",
  "@tamagui/web",
  // react + rn pinning
  "react-native",
  "react-dom",
  // superstyling itself — must be in the pre-bundled set so its TamaguiProvider
  // resolves to the same tamagui instance as direct tamagui imports
  "@superstyling/core",
  "@superstyling/icons",
];

export default {
  resolve: {
    preserveSymlinks: false,
    alias: {
      "~": pathResolve(import.meta.dirname, "."),
    },
    dedupe: ["react", "react-dom", "react-native", "react-native-web", ...include],
  },

  optimizeDeps: {
    include,
  },

  ssr: {
    // mdx-bundler/client IS bundled into the SSR graph so its
    // `require("react")` dedupes with the page's React instance — missing
    // this gives dual-React + useState null. Its CJS-isms (top-level
    // `require` calls) are rewritten to ESM imports via optimizeDeps below.
    //
    // `esbuild` uses native bindings + a child process and explicitly
    // refuses to be bundled — externalize it alone. Same for a few other
    // pure-Node deps that don't play nice with ESM bundling.
    external: ["esbuild", "chokidar", "fsevents"],
    noExternal: true,
    // Force Vite to pre-bundle mdx-bundler/client (pure CJS) into ESM so
    // the dev SSR module runner can evaluate it. Without this, top-level
    // `require("./react")` throws `require is not defined` in dev.
    optimizeDeps: {
      include: ["mdx-bundler/client"],
    },
  },

  define: {
    // mdx-bundler/dist/index.js references CJS primitives at top-level; ESM
    // doesn't provide them. Empty-string / noop stubs are safe here because
    // bundleMDX only uses `__dirname` for a default cwd we always override.
    __dirname: JSON.stringify(""),
    __filename: JSON.stringify(""),
  },

  plugins: [
    tamaguiPlugin({
      config: "./tamagui.config.ts",
      components: ["@superstyling/core", "tamagui"],
      // Dev mode skips static extraction — same pattern as tamagui.dev's
      // vite.config. Keeps the dev server fast and avoids the piscina
      // extractor-worker class of crashes.
      disable: process.env.NODE_ENV !== "production",
    }),

    one({
      ssr: {
        dedupeSymlinkedModules: true,
        autoDepsOptimization: {
          include: /.*/,
        },
      },
    }),
  ],
} satisfies UserConfig;
