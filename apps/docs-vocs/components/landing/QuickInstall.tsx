/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-jsx-as-prop -- landing */
import { useState } from "react";
import { Box, Button, HStack, Text, VStack } from "@superstyling/core";

const INSTALLERS = [
  { id: "yarn", label: "yarn", cmd: "yarn add @superstyling/core tamagui" },
  { id: "npm", label: "npm", cmd: "npm install @superstyling/core tamagui" },
  { id: "pnpm", label: "pnpm", cmd: "pnpm add @superstyling/core tamagui" },
  { id: "bun", label: "bun", cmd: "bun add @superstyling/core tamagui" },
] as const;

/** Quick-install tab strip under the hero. Works on its own state. */
export function QuickInstall() {
  const [active, setActive] = useState<(typeof INSTALLERS)[number]["id"]>("yarn");
  const [copied, setCopied] = useState(false);
  const cmd = INSTALLERS.find((i) => i.id === active)?.cmd ?? "";

  async function copy() {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked — silent
    }
  }

  return (
    <Box paddingHorizontal="$6" paddingBottom="$10" alignItems="center">
      <VStack
        gap="$0"
        width="100%"
        maxWidth={720}
        borderWidth={1}
        borderColor="$borderColor"
        borderRadius={10}
        overflow="hidden"
      >
        <HStack borderBottomWidth={1} borderColor="$borderColor" backgroundColor="$color2">
          {INSTALLERS.map((i) => (
            <Button
              key={i.id}
              variant="ghost"
              size="sm"
              onPress={() => setActive(i.id)}
              colorScheme={active === i.id ? "blue" : "gray"}
              isActive={active === i.id}
            >
              {i.label}
            </Button>
          ))}
          <Box flex={1} />
          <Button variant="ghost" size="sm" onPress={copy}>
            {copied ? "Copied" : "Copy"}
          </Button>
        </HStack>
        <Box paddingHorizontal="$5" paddingVertical="$4" backgroundColor="$background">
          <Text fontFamily="$mono" fontSize={14} color="$foreground">
            $ {cmd}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}
