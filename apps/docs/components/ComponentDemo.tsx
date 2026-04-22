"use client";

/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-function-as-prop -- docs building block */
import { useState, type ReactNode } from "react";
import { Badge, Box, Button, HStack, Text, VStack } from "@superstyling/core";

export interface ComponentDemoProps {
  preview: ReactNode;
  code: string;
  caption?: string;
  defaultPane?: "preview" | "code";
  status?: string;
  language?: "tsx" | "ts" | "jsx" | "js" | "bash" | "json" | "html" | "css";
}

/**
 * Live preview + code tabs. Ported from Vocs's ComponentDemo v2; only
 * difference is the "use client" directive for One's SSR pipeline.
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
      // Clipboard unavailable; code still visible for manual copy.
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
