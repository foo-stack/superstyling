/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-new-array-as-prop, react-perf/jsx-no-jsx-as-prop -- docs page */
import { Alert, Heading, Text, VStack } from "@superstyling/core";
import { ComponentDemo } from "../../src/docs/ComponentDemo";
import { DocsPage, Section } from "../../src/docs/DocsLayout";

export default function NextGuide() {
  return (
    <DocsPage
      title="Getting Started — Next.js"
      description="Zero to <Button> on a fresh create-next-app. Works with both App Router and Pages Router via subpath imports."
    >
      <Section title="1. Install">
        <ComponentDemo
          code={`yarn add @superstyling/core @superstyling/next @superstyling/icons tamagui`}
          preview={
            <Text fontFamily="$mono">
              yarn add @superstyling/core @superstyling/next @superstyling/icons tamagui
            </Text>
          }
          defaultOpen
        />
        <Text fontSize="$3" color="$color10">
          Tamagui is a peer dep of <Text fontFamily="$mono">@superstyling/core</Text>; install the
          matching version (currently <Text fontFamily="$mono">2.0.0-rc.41</Text>).
        </Text>
      </Section>

      <Section title="2. Create tamagui.config.ts">
        <ComponentDemo
          code={`// tamagui.config.ts
import { createSystem } from "@superstyling/core";

export const system = createSystem({
  // your overrides go here; empty input = defaults
});

export default system.config;

declare module "tamagui" {
  interface TamaguiCustomConfig extends typeof system.config {}
}`}
          preview={<Text fontFamily="$mono">// tamagui.config.ts …</Text>}
          defaultOpen
        />
      </Section>

      <Section title="3. Wrap next.config.mjs">
        <ComponentDemo
          code={`// next.config.mjs
import { withSuperStyling } from "@superstyling/next";

export default withSuperStyling({
  config: "./tamagui.config.ts",
})({
  reactStrictMode: true,
});`}
          preview={<Text fontFamily="$mono">// next.config.mjs …</Text>}
          defaultOpen
        />
      </Section>

      <Section title="4a. App Router — add the ColorModeScript">
        <ComponentDemo
          code={`// app/layout.tsx
import { ColorModeScript } from "@superstyling/next/app";
import { SuperStylingProvider } from "@superstyling/core";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorModeScript initialMode="light" />
      </head>
      <body>
        <SuperStylingProvider>{children}</SuperStylingProvider>
      </body>
    </html>
  );
}`}
          preview={<Text fontFamily="$mono">// app/layout.tsx …</Text>}
          defaultOpen
        />
      </Section>

      <Section title="4b. Pages Router — use the drop-in Document">
        <ComponentDemo
          code={`// pages/_document.tsx
export { default } from "@superstyling/next/pages";

// pages/_app.tsx
import { SuperStylingProvider } from "@superstyling/core";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SuperStylingProvider>
      <Component {...pageProps} />
    </SuperStylingProvider>
  );
}`}
          preview={<Text fontFamily="$mono">// pages/_document.tsx + _app.tsx …</Text>}
          defaultOpen
        />
      </Section>

      <Section title="5. Render a Button">
        <ComponentDemo
          code={`import { Button } from "@superstyling/core";

export default function HomePage() {
  return <Button colorScheme="blue">Hello from Superstyling</Button>;
}`}
          preview={<Text fontFamily="$mono">import {"{ Button }"} from "@superstyling/core"…</Text>}
          defaultOpen
        />
      </Section>

      <Section title="Troubleshooting">
        <VStack gap="$3">
          <Alert status="info">
            <Alert.Icon />
            <Alert.Content>
              <Alert.Title>Hydration warnings on html</Alert.Title>
              <Alert.Description>
                The <Text fontFamily="$mono">suppressHydrationWarning</Text> prop on{" "}
                <Text fontFamily="$mono">&lt;html&gt;</Text> is intentional — the ColorModeScript
                mutates the class list before React hydrates. Without it, React complains every
                load.
              </Alert.Description>
            </Alert.Content>
          </Alert>
          <Alert status="warning">
            <Alert.Icon />
            <Alert.Content>
              <Alert.Title>Module not found: react-native</Alert.Title>
              <Alert.Description>
                You're probably missing a peer. Tamagui aliases{" "}
                <Text fontFamily="$mono">react-native</Text> to{" "}
                <Text fontFamily="$mono">react-native-web</Text> via the Next plugin — make sure the
                plugin is wrapping your config as shown above.
              </Alert.Description>
            </Alert.Content>
          </Alert>
        </VStack>
      </Section>

      <Section title="Next steps">
        <VStack gap="$2" alignItems="flex-start">
          <Heading level={3}>Explore components</Heading>
          <Text fontSize="$3">Every primitive has a dedicated docs page — see the sidebar.</Text>
        </VStack>
      </Section>
    </DocsPage>
  );
}
