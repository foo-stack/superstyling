/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-function-as-prop -- docs building block */
import { useState, type ReactNode } from "react";
import { Box, Button, HStack, Text, VStack } from "@superstyling/core";

export interface ComponentDemoProps {
  /** The rendered React example. */
  preview: ReactNode;
  /** Source string shown in the code block. Paste the exact TSX the `preview` uses. */
  code: string;
  /** Optional caption above the preview. */
  caption?: string;
  /** Show the code block by default. Default: false (show/hide toggle per Q13). */
  defaultOpen?: boolean;
  /** Syntax language for the code block. Default: "tsx". */
  language?: "tsx" | "ts" | "jsx" | "js" | "bash" | "json";
}

/**
 * Docs building block. Renders a live preview inside the
 * `<SuperStylingProvider>` that `docs/layout.tsx` wraps Vocs pages in, plus a
 * show/hide code panel with a copy button.
 *
 * Per Q13 (Phase 7.5): the show/hide toggle is preserved. Code content uses
 * a simple inline `<pre>` — Vocs's MDX `<CodeBlock>` is only available when
 * the code comes from a fenced markdown block, not from a prop. Shiki
 * highlighting is applied to fenced blocks above or below the `<ComponentDemo>`
 * if you want both.
 */
export function ComponentDemo({
  preview,
  code,
  caption,
  defaultOpen = false,
  language = "tsx",
}: ComponentDemoProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable (e.g., insecure context). Fail silently — the
      // code is still visible when expanded; users can select+copy manually.
    }
  }

  return (
    <VStack
      gap={0}
      borderWidth={1}
      borderColor="$borderColor"
      borderRadius={8}
      overflow="hidden"
      marginVertical="$3"
    >
      {caption ? (
        <Box
          paddingHorizontal="$4"
          paddingVertical="$2"
          backgroundColor="$color2"
          borderBottomWidth={1}
          borderColor="$borderColor"
        >
          <Text fontSize={13} color="$color10" fontFamily="$body">
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
        <Text fontSize={11} color="$color10" fontFamily="$mono">
          {language}
        </Text>
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
          <pre
            style={{
              margin: 0,
              fontSize: 13,
              lineHeight: "1.5",
              fontFamily:
                'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              whiteSpace: "pre",
              overflowX: "auto",
            }}
          >
            {code}
          </pre>
        </Box>
      ) : null}
    </VStack>
  );
}
