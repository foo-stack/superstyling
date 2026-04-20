/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-function-as-prop -- docs building block; perf-rule noise */
import { useState, type ReactNode } from "react";
import { Box, Button, HStack, Text, VStack } from "@superstyling/core";

export interface ComponentDemoProps {
  /** The rendered React example. */
  preview: ReactNode;
  /** Source string shown in the code block. Paste the exact TSX the `preview` uses. */
  code: string;
  /** Optional caption above the preview. */
  caption?: string;
  /**
   * Show the code block by default. Most demos default to closed to keep
   * pages scannable; set `true` for pages where the code is the point.
   */
  defaultOpen?: boolean;
}

/**
 * Docs building block: renders a live preview + a toggleable code block
 * with a copy-to-clipboard button.
 *
 * Per Q7 decision (P7.1): v0.1 ships static-code-block + live-preview pairs.
 * Sandpack upgrade is deferred to v0.2.
 */
export function ComponentDemo({ preview, code, caption, defaultOpen = false }: ComponentDemoProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable (e.g., insecure context). Fail silently — the
      // code is still visible; users can select+copy manually.
    }
  }

  return (
    <VStack gap={0} borderWidth={1} borderColor="$borderColor" borderRadius={8} overflow="hidden">
      {caption ? (
        <Box
          paddingHorizontal="$4"
          paddingVertical="$2"
          backgroundColor="$color2"
          borderBottomWidth={1}
          borderColor="$borderColor"
        >
          <Text fontSize="$2" color="$color10">
            {caption}
          </Text>
        </Box>
      ) : null}
      <Box padding="$6" backgroundColor="$background">
        {preview}
      </Box>
      <HStack
        paddingHorizontal="$3"
        paddingVertical="$2"
        gap="$2"
        alignItems="center"
        borderTopWidth={1}
        borderColor="$borderColor"
        backgroundColor="$color2"
      >
        <Button size="xs" variant="ghost" onPress={() => setOpen((o) => !o)}>
          {open ? "Hide code" : "Show code"}
        </Button>
        <Box flex={1} />
        <Button size="xs" variant="ghost" onPress={copy}>
          {copied ? "Copied" : "Copy"}
        </Button>
      </HStack>
      {open ? (
        <Box
          paddingHorizontal="$4"
          paddingVertical="$3"
          backgroundColor="$color1"
          borderTopWidth={1}
          borderColor="$borderColor"
        >
          <Text
            fontSize="$2"
            fontFamily="$mono"
            color="$foreground"
            // oxlint-disable-next-line react-perf/jsx-no-new-object-as-prop
            style={{ whiteSpace: "pre" }}
          >
            {code}
          </Text>
        </Box>
      ) : null}
    </VStack>
  );
}
