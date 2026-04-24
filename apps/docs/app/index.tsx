/* oxlint-disable react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-array-as-prop, react-perf/jsx-no-new-object-as-prop -- docs landing, not a hot path */
import { Box, Button, HStack, Heading, Link, Text, VStack } from "@superstyling/core";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  CodeIcon,
  PaletteIcon,
  PhoneIcon,
  SparklesIcon,
  ZapIcon,
} from "./_landing/icons";
import { DocsPage } from "~/components/DocsPage";
import { DocsCodeBlock } from "~/components/DocsCodeBlock";

const HERO_CODE = `import { Button, Modal, useDisclosure } from "@superstyling/core";

export function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button colorScheme="blue" onPress={onOpen}>
        Open
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>Hello from web + native</Modal.Header>
          <Modal.Body>One API. Three platforms.</Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  );
}`;

const PILLS: { label: string; tint: string; border: string; color: string }[] = [
  {
    label: "Cross-platform",
    tint: "rgba(49,130,206,0.12)",
    border: "rgba(49,130,206,0.4)",
    color: "$blue11",
  },
  {
    label: "Chakra-shaped",
    tint: "rgba(128,90,213,0.12)",
    border: "rgba(128,90,213,0.4)",
    color: "$purple11",
  },
  {
    label: "Tamagui-powered",
    tint: "rgba(99,102,241,0.12)",
    border: "rgba(99,102,241,0.4)",
    color: "$indigo11",
  },
  {
    label: "Type-safe",
    tint: "rgba(20,184,166,0.12)",
    border: "rgba(20,184,166,0.4)",
    color: "$teal11",
  },
];

const FEATURES: {
  title: string;
  body: string;
  Icon: typeof CheckCircleIcon;
  tint: string;
  iconColor: string;
}[] = [
  {
    title: "One API, three platforms",
    body: "Web, iOS, Android from a single component tree. Built on Tamagui v2.",
    Icon: PhoneIcon,
    tint: "rgba(49,130,206,0.08)",
    iconColor: "$blue10",
  },
  {
    title: "Chakra-shaped ergonomics",
    body: "Variants, sizes, colorScheme, FormControl, dot-namespaced compounds — the DX you know.",
    Icon: PaletteIcon,
    tint: "rgba(128,90,213,0.08)",
    iconColor: "$purple10",
  },
  {
    title: "Migrate in an afternoon",
    body: "Codemod rewrites imports, providers, and extendTheme(...) call sites. Hand-converts only what it can't.",
    Icon: SparklesIcon,
    tint: "rgba(99,102,241,0.08)",
    iconColor: "$indigo10",
  },
  {
    title: "Type-safe theme",
    body: "createSystem() wires your theme into Tamagui's config. Autocomplete every token.",
    Icon: CheckCircleIcon,
    tint: "rgba(20,184,166,0.08)",
    iconColor: "$teal10",
  },
  {
    title: "Compile-time CSS on web",
    body: "Tamagui's static extractor produces atomic CSS. No runtime style recompute in production.",
    Icon: ZapIcon,
    tint: "rgba(245,158,11,0.08)",
    iconColor: "$orange10",
  },
  {
    title: "Flat StyleSheet on native",
    body: "Same components, same props — RN StyleSheet.create output on the other side.",
    Icon: CodeIcon,
    tint: "rgba(236,72,153,0.08)",
    iconColor: "$pink10",
  },
];

export default function HomePage() {
  return (
    <DocsPage currentPath="/">
      <VStack gap="$6" paddingBottom="$10">
        {/* HERO */}
        <Box position="relative" overflow="hidden" borderRadius={20} marginTop="$2">
          {/* Layered radial glows */}
          <Box
            position="absolute"
            top={-160}
            left={-120}
            width={520}
            height={520}
            borderRadius={520}
            backgroundColor="rgba(49,130,206,0.18)"
            style={{ filter: "blur(80px)" } as object}
            pointerEvents="none"
          />
          <Box
            position="absolute"
            bottom={-200}
            right={-160}
            width={620}
            height={620}
            borderRadius={620}
            backgroundColor="rgba(128,90,213,0.18)"
            style={{ filter: "blur(100px)" } as object}
            pointerEvents="none"
          />

          <Box
            position="relative"
            paddingHorizontal="$5"
            paddingVertical="$8"
            $md={{ paddingHorizontal: "$8", paddingVertical: "$10" }}
          >
            <HStack gap="$8" flexWrap="wrap" alignItems="center">
              {/* LEFT — copy + CTAs */}
              <VStack gap="$4" flex={1} minWidth={320} maxWidth={580}>
                <Box
                  paddingHorizontal="$3"
                  paddingVertical="$1"
                  borderRadius={999}
                  alignSelf="flex-start"
                  backgroundColor="rgba(49,130,206,0.12)"
                  borderWidth={1}
                  borderColor="rgba(49,130,206,0.4)"
                >
                  <Text fontSize={12} fontWeight="600" color="$blue11" letterSpacing={0.5}>
                    v0.2.0 — Chakra v2 codemod shipped
                  </Text>
                </Box>

                <Heading
                  level={1}
                  fontSize={48}
                  lineHeight={52}
                  fontWeight="800"
                  letterSpacing={-1}
                  $md={{ fontSize: 64, lineHeight: 68 }}
                >
                  Chakra on Tamagui.{" "}
                  <Text
                    fontSize="inherit"
                    fontWeight="inherit"
                    lineHeight="inherit"
                    color="$blue10"
                  >
                    Web + iOS + Android.
                  </Text>
                </Heading>

                <Text fontSize={18} color="$color11" lineHeight={28} $md={{ fontSize: 20 }}>
                  A cross-platform React UI library with Chakra UI's developer experience and
                  Tamagui's compile-time engine. Drop-in migration from Chakra v2 — codemod
                  included.
                </Text>

                <HStack gap="$3" paddingTop="$2" flexWrap="wrap">
                  <Link href="/getting-started/next" textDecorationLine="none">
                    <Button colorScheme="blue" size="lg" rightIcon={<ArrowRightIcon size={16} />}>
                      Get started
                    </Button>
                  </Link>
                  <Link href="/migration/from-chakra-v2" textDecorationLine="none">
                    <Button variant="outline" size="lg">
                      Migrating from Chakra?
                    </Button>
                  </Link>
                  <Link
                    href="https://github.com/foo-stack/superstyling"
                    isExternal
                    textDecorationLine="none"
                  >
                    <Button variant="ghost" size="lg">
                      GitHub
                    </Button>
                  </Link>
                </HStack>
              </VStack>

              {/* RIGHT — floating code card */}
              <Box
                flex={1}
                minWidth={320}
                maxWidth={560}
                style={{ transform: "rotate(1.2deg)" } as object}
                hoverStyle={{ transform: "rotate(0deg) translateY(-2px)" } as object}
                {...({ animation: "quicker" } as object)}
              >
                <Box
                  borderRadius={16}
                  overflow="hidden"
                  borderWidth={1}
                  borderColor="$borderColor"
                  shadowColor="rgba(0,0,0,0.4)"
                  shadowOffset={{ width: 0, height: 24 }}
                  shadowRadius={48}
                  shadowOpacity={1}
                >
                  <DocsCodeBlock language="tsx">{HERO_CODE}</DocsCodeBlock>
                </Box>
              </Box>
            </HStack>

            {/* Pills */}
            <HStack gap="$2" flexWrap="wrap" paddingTop="$6">
              {PILLS.map((p) => (
                <Box
                  key={p.label}
                  paddingHorizontal="$3"
                  paddingVertical="$1.5"
                  borderRadius={999}
                  backgroundColor={p.tint}
                  borderWidth={1}
                  borderColor={p.border}
                >
                  <Text fontSize={13} fontWeight="500" color={p.color}>
                    {p.label}
                  </Text>
                </Box>
              ))}
            </HStack>
          </Box>
        </Box>

        {/* INSTALL */}
        <VStack gap="$2" paddingTop="$4">
          <Heading level={2} fontSize={28} fontWeight="700">
            Install
          </Heading>
          <DocsCodeBlock language="bash">
            {`yarn add @superstyling/core @superstyling/vite react-native-web`}
          </DocsCodeBlock>
          <Text fontSize={13} color="$color10">
            Next.js, Expo, and Vite each get their own integration package — pick the{" "}
            <Link href="/getting-started/next">Next</Link>,{" "}
            <Link href="/getting-started/expo">Expo</Link>, or{" "}
            <Link href="/getting-started/vite">Vite</Link> guide.
          </Text>
        </VStack>

        {/* FEATURES */}
        <VStack gap="$4" paddingTop="$6">
          <Heading level={2} fontSize={28} fontWeight="700">
            Why
          </Heading>
          <Box flexDirection="row" flexWrap="wrap" gap="$4">
            {FEATURES.map((f) => (
              <Box
                key={f.title}
                flexBasis="100%"
                $md={{ flexBasis: "48%" }}
                padding="$5"
                borderWidth={1}
                borderColor="$borderColor"
                borderRadius={14}
                backgroundColor="$color2"
                gap="$2"
                {...({ animation: "quicker" } as object)}
                hoverStyle={{ y: -2, borderColor: "$primary" } as object}
              >
                <Box
                  width={40}
                  height={40}
                  borderRadius={10}
                  backgroundColor={f.tint}
                  alignItems="center"
                  justifyContent="center"
                >
                  <f.Icon size={20} color={f.iconColor} />
                </Box>
                <Text fontSize={16} fontWeight="600" color="$color">
                  {f.title}
                </Text>
                <Text fontSize={14} color="$color11" lineHeight={20}>
                  {f.body}
                </Text>
              </Box>
            ))}
          </Box>
        </VStack>
      </VStack>
    </DocsPage>
  );
}
