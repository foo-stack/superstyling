/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-new-array-as-prop, react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-function-as-prop -- docs page */
import { Alert, Box, Button, HStack, Text, VStack, useColorMode } from "@superstyling/core";
import { MoonIcon, SunIcon } from "@superstyling/icons";
import { ComponentDemo } from "../../src/docs/ComponentDemo";
import { DocsPage, Section } from "../../src/docs/DocsLayout";

const TOGGLE_SOURCE = `import { useColorMode } from "@superstyling/core";
import { MoonIcon, SunIcon } from "@superstyling/icons";

export function ColorModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button
      variant="ghost"
      onPress={toggleColorMode}
      leftIcon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
    >
      {colorMode === "dark" ? "Light mode" : "Dark mode"}
    </Button>
  );
}`;

const PROVIDER_SOURCE = `// Somewhere near your root, ColorModeProvider reads the persisted
// mode and syncs it to the <html class>. SuperStylingProvider already
// embeds it — you only need the pieces below if you customize behaviour.

import { ColorModeProvider } from "@superstyling/core";

<ColorModeProvider
  initialColorMode="system"     // "light" | "dark" | "system"
  useSystemColorMode              // follow OS setting
  storageKey="@my-app/color-mode" // override localStorage key
>
  {children}
</ColorModeProvider>`;

const FOUC_SOURCE = `// Next (App Router): app/layout.tsx
import { ColorModeScript } from "@superstyling/next/app";
// In <head>:
<ColorModeScript initialMode="light" />

// Vite: index.html
// Inject the output of colorModeScriptSnippet() into <head>.
import { colorModeScriptSnippet } from "@superstyling/vite";`;

export default function ColorModeExample() {
  return (
    <DocsPage
      title="Example — Color mode integration"
      description="Every SuperStylingProvider ships a working light/dark mode. Toggle it with useColorMode; persist it with localStorage or a cookie; avoid FOUC with the platform-specific color-mode script."
    >
      <Section title="Live toggle">
        <ComponentDemo code={TOGGLE_SOURCE} preview={<LiveToggle />} />
      </Section>

      <Section title="Customizing the provider">
        <ComponentDemo
          code={PROVIDER_SOURCE}
          preview={<Text fontFamily="$mono">// ColorModeProvider options …</Text>}
          defaultOpen
        />
      </Section>

      <Section title="Preventing FOUC on SSR">
        <Alert status="info">
          <Alert.Icon />
          <Alert.Content>
            <Alert.Title>Blocking script before hydration</Alert.Title>
            <Alert.Description>
              On SSR'd platforms (Next, Vite+SSR), a small blocking script reads the persisted mode
              and sets a class on <Text fontFamily="$mono">&lt;html&gt;</Text> before React hydrates
              — otherwise first paint flashes the wrong theme.
            </Alert.Description>
          </Alert.Content>
        </Alert>
        <ComponentDemo
          code={FOUC_SOURCE}
          preview={<Text fontFamily="$mono">// Platform-specific color-mode script wiring …</Text>}
          defaultOpen
        />
      </Section>

      <Section title="API reference">
        <VStack gap="$2">
          <Text fontSize="$3">
            <Text fontFamily="$mono">useColorMode()</Text> returns{" "}
            <Text fontFamily="$mono">{`{ colorMode, setColorMode, toggleColorMode }`}</Text>.
          </Text>
          <Text fontSize="$3">
            <Text fontFamily="$mono">useColorModeValue(light, dark)</Text> returns whichever value
            matches the current mode — handy inside render for computing colors, icons, or strings.
          </Text>
          <Text fontSize="$3">
            <Text fontFamily="$mono">ColorModeScript</Text> is the FOUC-blocking script component.
            Shipped as a React component from <Text fontFamily="$mono">@superstyling/next/app</Text>{" "}
            and <Text fontFamily="$mono">/pages</Text>, and as a raw string from{" "}
            <Text fontFamily="$mono">@superstyling/vite</Text>'s{" "}
            <Text fontFamily="$mono">colorModeScriptSnippet()</Text>.
          </Text>
        </VStack>
      </Section>
    </DocsPage>
  );
}

function LiveToggle() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <HStack gap="$3" alignItems="center">
      <Button
        variant="ghost"
        onPress={toggleColorMode}
        leftIcon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
      >
        {colorMode === "dark" ? "Light mode" : "Dark mode"}
      </Button>
      <Box paddingHorizontal="$3" paddingVertical="$2" backgroundColor="$color2" borderRadius={6}>
        <Text fontSize="$2" fontFamily="$mono">
          current: {colorMode}
        </Text>
      </Box>
    </HStack>
  );
}
