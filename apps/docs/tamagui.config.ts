import { createSystem } from "@superstyling/core";

/**
 * Docs-specific system. Overrides the default font stack with Google Fonts
 * (Inter + JetBrains Mono) loaded via `<link>` in `app/_layout.tsx`. The CSS
 * fallback chain matches the default in case the network blocks the request.
 */
export const docsSystem = createSystem({
  fonts: {
    body: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    heading: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  },
});

export default docsSystem.config;
