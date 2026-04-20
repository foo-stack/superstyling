/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-new-array-as-prop, react-perf/jsx-no-jsx-as-prop -- docs page */
import { Alert, Text, VStack } from "@superstyling/core";
import { ComponentDemo } from "../../src/docs/ComponentDemo";
import { DocsPage, Section } from "../../src/docs/DocsLayout";

export default function ExpoGuide() {
  return (
    <DocsPage
      title="Getting Started — Expo"
      description="Zero to <Button> on a fresh Expo SDK 54+ project with Expo Router."
    >
      <Section title="1. Install">
        <ComponentDemo
          code={`yarn add @superstyling/core @superstyling/expo @superstyling/icons tamagui
yarn add react-native-gesture-handler react-native-safe-area-context react-native-teleport react-native-worklets`}
          preview={
            <Text fontFamily="$mono">
              yarn add @superstyling/core @superstyling/expo … (plus native peers)
            </Text>
          }
          defaultOpen
        />
        <Text fontSize="$3" color="$color10">
          The native peers are optional — each enables a feature (gesture-handler powers Sheet/Modal
          drag, teleport powers the native Portal host). Install only what you use.
        </Text>
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

      <Section title="3. Wire the Babel plugin">
        <ComponentDemo
          code={`// babel.config.js
const { babelPreset } = require("@superstyling/expo/babel-plugin");

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: babelPreset({ config: "./tamagui.config.ts" }),
  };
};`}
          preview={<Text fontFamily="$mono">// babel.config.js …</Text>}
          defaultOpen
        />
      </Section>

      <Section title="4. Wire Metro">
        <ComponentDemo
          code={`// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withSuperStylingMetro } = require("@superstyling/expo/metro-config");

const config = getDefaultConfig(__dirname, { isCSSEnabled: true });
module.exports = withSuperStylingMetro(config, {
  projectRoot: __dirname,
  config: "./tamagui.config.ts",
});`}
          preview={<Text fontFamily="$mono">// metro.config.js …</Text>}
          defaultOpen
        />
      </Section>

      <Section title="5. Register the native setup">
        <ComponentDemo
          code={`// app/_layout.tsx (Expo Router)
import "@superstyling/expo/setup";
import { Slot } from "expo-router";
import { SuperStylingProvider } from "@superstyling/core";

export default function RootLayout() {
  return (
    <SuperStylingProvider>
      <Slot />
    </SuperStylingProvider>
  );
}`}
          preview={<Text fontFamily="$mono">// app/_layout.tsx …</Text>}
          defaultOpen
        />
        <Text fontSize="$3" color="$color10">
          The <Text fontFamily="$mono">import "@superstyling/expo/setup"</Text> must be the{" "}
          <Text fontWeight="700">first</Text> import — it wires Tamagui's native portal, gesture
          handler, worklets, safe-area, and keyboard controller in the required order.
        </Text>
      </Section>

      <Section title="6. Register the config plugin (optional)">
        <ComponentDemo
          code={`// app.json
{
  "expo": {
    "plugins": ["@superstyling/expo"]
  }
}`}
          preview={
            <Text fontFamily="$mono">{`{ "expo": { "plugins": ["@superstyling/expo"] } }`}</Text>
          }
          defaultOpen
        />
      </Section>

      <Section title="7. Render a Button">
        <ComponentDemo
          code={`// app/index.tsx
import { Button } from "@superstyling/core";

export default function Home() {
  return <Button colorScheme="blue">Hello from Superstyling</Button>;
}`}
          preview={<Text fontFamily="$mono">import {"{ Button }"} from "@superstyling/core"…</Text>}
          defaultOpen
        />
      </Section>

      <Section title="Troubleshooting">
        <VStack gap="$3">
          <Alert status="warning">
            <Alert.Icon />
            <Alert.Content>
              <Alert.Title>Portal not working on native</Alert.Title>
              <Alert.Description>
                Make sure <Text fontFamily="$mono">@superstyling/expo/setup</Text> is the first
                import in your entry file and that{" "}
                <Text fontFamily="$mono">react-native-teleport</Text> is installed. Without both,
                Tamagui silently falls back to a JS portal that drops React context.
              </Alert.Description>
            </Alert.Content>
          </Alert>
          <Alert status="info">
            <Alert.Icon />
            <Alert.Content>
              <Alert.Title>Optional integrations</Alert.Title>
              <Alert.Description>
                Swap <Text fontFamily="$mono">@superstyling/expo/setup</Text> for{" "}
                <Text fontFamily="$mono">/setup-all</Text> to enable{" "}
                <Text fontFamily="$mono">expo-linear-gradient</Text>,{" "}
                <Text fontFamily="$mono">burnt</Text> toasts, and{" "}
                <Text fontFamily="$mono">zeego</Text> menus when those peers are installed.
              </Alert.Description>
            </Alert.Content>
          </Alert>
        </VStack>
      </Section>
    </DocsPage>
  );
}
