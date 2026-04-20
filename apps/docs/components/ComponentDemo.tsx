/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-function-as-prop -- docs building block */
import { useState, type ReactNode } from "react";
import { Badge, Box, Button, HStack, Text, VStack } from "@superstyling/core";

export interface ComponentDemoProps {
  /** The rendered React example. */
  preview: ReactNode;
  /** Source string shown in the code pane. Paste the exact TSX the `preview` uses. */
  code: string;
  /** Optional caption shown in the header row. */
  caption?: string;
  /** Initial visible pane. Default: `"preview"`. */
  defaultPane?: "preview" | "code";
  /** Status badge shown next to the tab pills (e.g. "a11y verified"). */
  status?: string;
  /** Syntax language label (pill in the header). Default: `"tsx"`. */
  language?: "tsx" | "ts" | "jsx" | "js" | "bash" | "json" | "html" | "css";
}

/**
 * Docs building block. Renders a live preview + code source with a
 * "Preview" / "Code" tab switcher. The preview pane sits inside our
 * `<SuperStylingProvider>` (see `apps/docs/layout.tsx`), so Tamagui theme
 * tokens and color-mode state apply.
 *
 * Upgrade from P8.5.4: tabs replace the show/hide toggle; status badge slot;
 * nicer frame. Shiki syntax highlighting in the code pane is a follow-up
 * (requires async highlighter init that's awkward in SSR).
 */
export function ComponentDemo({
  preview,
  code,
  caption,
  defaultPane = "preview",
  status,
  language = "tsx",
}: ComponentDemoProps) {
  const [pane, setPane] = useState<"preview" | "code">(defaultPane);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable (e.g., insecure context). Code still visible
      // in the pane; users can select + copy manually.
    }
  }

  return (
    <VStack
      gap={0}
      borderWidth={1}
      borderColor="$borderColor"
      borderRadius={10}
      overflow="hidden"
      marginVertical="$4"
      backgroundColor="$background"
    >
      {/* Header: tab pills + optional caption + status + language */}
      <HStack
        paddingHorizontal="$3"
        paddingVertical="$2"
        alignItems="center"
        gap="$2"
        borderBottomWidth={1}
        borderColor="$borderColor"
        backgroundColor="$color2"
      >
        <HStack gap={0}>
          <Button
            size="xs"
            variant={pane === "preview" ? "solid" : "ghost"}
            colorScheme={pane === "preview" ? "blue" : "gray"}
            onPress={() => setPane("preview")}
          >
            Preview
          </Button>
          <Button
            size="xs"
            variant={pane === "code" ? "solid" : "ghost"}
            colorScheme={pane === "code" ? "blue" : "gray"}
            onPress={() => setPane("code")}
          >
            Code
          </Button>
        </HStack>
        {caption ? (
          <Text fontSize={13} color="$color10">
            {caption}
          </Text>
        ) : null}
        {status ? (
          <Badge variant="subtle" colorScheme="green" size="sm">
            {status}
          </Badge>
        ) : null}
        <Box flex={1} />
        <Badge variant="outline" colorScheme="gray" size="sm">
          {language}
        </Badge>
        {pane === "code" ? (
          <Button size="xs" variant="ghost" onPress={copy}>
            {copied ? "Copied" : "Copy"}
          </Button>
        ) : null}
      </HStack>

      {/* Body: preview (framed box, theme-aware bg) OR code (mono pre) */}
      {pane === "preview" ? (
        <Box padding="$6" backgroundColor="$background" minHeight={80}>
          {preview}
        </Box>
      ) : (
        <Box paddingHorizontal="$4" paddingVertical="$3" backgroundColor="$color1" minHeight={80}>
          <pre
            style={{
              margin: 0,
              fontSize: 13,
              lineHeight: "1.55",
              fontFamily:
                'JetBrains Mono, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              whiteSpace: "pre",
              overflowX: "auto",
            }}
          >
            {code}
          </pre>
        </Box>
      )}
    </VStack>
  );
}
