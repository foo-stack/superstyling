/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-function-as-prop, react-perf/jsx-no-new-array-as-prop -- docs page, not a hot path */
import { Box, Button, HStack, Text, useColorMode } from "@superstyling/core";
import { MoonIcon, SunIcon } from "@superstyling/icons";
import { DocsPage } from "~/components/DocsPage";
import { ComponentDemo } from "~/components/ComponentDemo";
import { DocsCodeBlock } from "~/components/DocsCodeBlock";
import { mdxComponents } from "~/components/MDXComponents";

const H1 = mdxComponents.h1;
const H2 = mdxComponents.h2;
const P = mdxComponents.p;

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
        <Text fontSize={13} fontFamily="$mono">
          current: {colorMode}
        </Text>
      </Box>
    </HStack>
  );
}

export default function ColorModePage() {
  return (
    <DocsPage currentPath="/examples/color-mode">
      <H1>Example — Color mode integration</H1>
      <P>
        Every SuperStylingProvider ships a working light/dark mode. Toggle it with useColorMode;
        persist it with localStorage or a cookie; avoid FOUC with the platform-specific color-mode
        script.
      </P>
      <H2>Live toggle</H2>
      <ComponentDemo
        code={`import { useColorMode } from "@superstyling/core";
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
}`}
        preview={<LiveToggle />}
      />
      <H2>Customizing the provider</H2>
      <DocsCodeBlock language="tsx">{`// Somewhere near your root, ColorModeProvider reads the persisted
// mode and syncs it to the <html class>. SuperStylingProvider already
// embeds it — you only need the pieces below if you customize behaviour.

import { ColorModeProvider } from "@superstyling/core";

<ColorModeProvider
  initialColorMode="system" // "light" | "dark" | "system"
  useSystemColorMode // follow OS setting
  storageKey="@my-app/color-mode" // override localStorage key
>
  {children}
</ColorModeProvider>;`}</DocsCodeBlock>
      <H2>Preventing FOUC on SSR</H2>
      <P>
        On SSR'd platforms (Next, Vite+SSR), a small blocking script reads the persisted mode and
        sets a class on html before React hydrates — otherwise first paint flashes the wrong theme.
      </P>
      <DocsCodeBlock language="tsx">{`// Next (App Router): app/layout.tsx
import { ColorModeScript } from "@superstyling/next/app";
// In <head>:
<ColorModeScript initialMode="light" />;

// Vite: index.html
// Inject the output of colorModeScriptSnippet() into <head>.
import { colorModeScriptSnippet } from "@superstyling/vite";`}</DocsCodeBlock>
      <H2>API reference</H2>
      <P>
        <code>useColorMode()</code> returns{" "}
        <code>{`{ colorMode, setColorMode, toggleColorMode }`}</code>.
      </P>
      <P>
        <code>useColorModeValue(light, dark)</code> returns whichever value matches the current mode
        — handy inside render for computing colors, icons, or strings.
      </P>
      <P>
        <code>ColorModeScript</code> is the FOUC-blocking script component. Shipped as a React
        component from <code>@superstyling/next/app</code> and <code>/pages</code>, and as a raw
        string from <code>@superstyling/vite</code>'s <code>colorModeScriptSnippet()</code>.
      </P>
    </DocsPage>
  );
}
