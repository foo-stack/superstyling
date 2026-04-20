/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-new-array-as-prop, react-perf/jsx-no-jsx-as-prop -- docs page */
import { Alert, Text } from "@superstyling/core";
import { ComponentDemo } from "../../src/docs/ComponentDemo";
import { DocsPage, Section } from "../../src/docs/DocsLayout";

export default function ViteGuide() {
  return (
    <DocsPage
      title="Getting Started — Vite"
      description="Zero to <Button> on a fresh create-vite React project. Works with plain Vite, Vike (for SSR/SSG), or One."
    >
      <Section title="1. Install">
        <ComponentDemo
          code={`yarn add @superstyling/core @superstyling/vite @superstyling/icons tamagui react-native-web`}
          preview={
            <Text fontFamily="$mono">
              yarn add @superstyling/core @superstyling/vite @superstyling/icons tamagui
              react-native-web
            </Text>
          }
          defaultOpen
        />
      </Section>

      <Section title="2. Create tamagui.config.ts">
        <ComponentDemo
          code={`// tamagui.config.ts
import { createSystem } from "@superstyling/core";
export const system = createSystem({});
export default system.config;
declare module "tamagui" {
  interface TamaguiCustomConfig extends typeof system.config {}
}`}
          preview={<Text fontFamily="$mono">// tamagui.config.ts …</Text>}
          defaultOpen
        />
      </Section>

      <Section title="3. Wire the Vite plugin">
        <ComponentDemo
          code={`// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { superstylingVitePlugin } from "@superstyling/vite";

export default defineConfig({
  plugins: [
    react(),
    ...superstylingVitePlugin({
      config: "./tamagui.config.ts",
    }),
  ],
});`}
          preview={<Text fontFamily="$mono">// vite.config.ts …</Text>}
          defaultOpen
        />
        <Text fontSize="$3" color="$color10">
          <Text fontFamily="$mono">superstylingVitePlugin</Text> returns an array of three plugins
          (aliases, dev-deps hints, Tamagui's own plugin). Spread it into your{" "}
          <Text fontFamily="$mono">plugins</Text> array.
        </Text>
      </Section>

      <Section title="4. Add the FOUC-prevention script to index.html">
        <ComponentDemo
          code={`<!-- index.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>My App</title>
    <!--SUPERSTYLING-COLOR-MODE-SCRIPT-->
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`}
          preview={<Text fontFamily="$mono">// index.html …</Text>}
          defaultOpen
        />
        <Text fontSize="$3" color="$color10">
          Replace the marker at build time via a Vite{" "}
          <Text fontFamily="$mono">transformIndexHtml</Text> hook, or paste the output of{" "}
          <Text fontFamily="$mono">colorModeScriptSnippet()</Text> statically.
        </Text>
      </Section>

      <Section title="5. Wrap your root and render">
        <ComponentDemo
          code={`// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SuperStylingProvider, Button } from "@superstyling/core";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SuperStylingProvider>
      <Button colorScheme="blue">Hello from Superstyling</Button>
    </SuperStylingProvider>
  </StrictMode>
);`}
          preview={<Text fontFamily="$mono">// src/main.tsx …</Text>}
          defaultOpen
        />
      </Section>

      <Section title="Using One or Vike?">
        <Alert status="info">
          <Alert.Icon />
          <Alert.Content>
            <Alert.Title>One already bundles Tamagui</Alert.Title>
            <Alert.Description>
              If you're on One (onestack.dev), its own <Text fontFamily="$mono">one()</Text> Vite
              plugin already includes Tamagui integration — don't add{" "}
              <Text fontFamily="$mono">superstylingVitePlugin</Text> on top. Point One at your{" "}
              <Text fontFamily="$mono">tamagui.config.ts</Text> and use the rest of this library
              as-is.
            </Alert.Description>
          </Alert.Content>
        </Alert>
      </Section>
    </DocsPage>
  );
}
