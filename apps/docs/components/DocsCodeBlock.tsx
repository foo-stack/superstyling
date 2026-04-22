"use client";

/* oxlint-disable react-perf/jsx-no-new-function-as-prop -- docs building block */
import { useMemo, useState } from "react";
import { refractor } from "refractor";
import tsLang from "refractor/lang/typescript.js";
import tsxLang from "refractor/lang/tsx.js";
import bashLang from "refractor/lang/bash.js";
import jsonLang from "refractor/lang/json.js";
import cssLang from "refractor/lang/css.js";
import { toHtml } from "hast-util-to-html";
import { Box, HStack, Button, Text } from "@superstyling/core";

// Register once on first import. refractor is idempotent on duplicate registers.
refractor.register(tsLang);
refractor.register(tsxLang);
refractor.register(bashLang);
refractor.register(jsonLang);
refractor.register(cssLang);

const LANG_ALIASES: Record<string, string> = {
  ts: "typescript",
  js: "typescript",
  jsx: "tsx",
  sh: "bash",
  shell: "bash",
};

export interface DocsCodeBlockProps {
  children: string;
  language?: string;
  copyable?: boolean;
}

/**
 * Syntax-highlighted code block. Adapted from tamagui/tamagui's
 * DocsCodeBlock — we use refractor directly (not the rehype-react pipeline)
 * because our MDX runtime doesn't share tamagui.dev's bundler plugins.
 *
 * Ships server-renderable highlighted HTML via hast-util-to-html. The
 * Copy button is the only client-side piece.
 */
export function DocsCodeBlock({ children, language, copyable = true }: DocsCodeBlockProps) {
  const code = children.trimEnd();
  const lang = LANG_ALIASES[language ?? ""] ?? language ?? "typescript";
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => {
    try {
      const tree = refractor.highlight(code, lang);
      return toHtml(tree);
    } catch {
      // Unknown language — return as escaped text
      return code.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);
    }
  }, [code, lang]);

  return (
    <Box
      position="relative"
      marginVertical="$3"
      borderRadius={8}
      borderWidth={1}
      borderColor="$borderColor"
      backgroundColor="$color2"
      overflow="hidden"
    >
      <HStack
        paddingHorizontal="$3"
        paddingVertical="$2"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        backgroundColor="$color3"
        alignItems="center"
      >
        <Text fontSize={11} fontFamily="$mono" color="$color11" textTransform="uppercase">
          {lang}
        </Text>
        <Box flex={1} />
        {copyable ? (
          <Button
            size="sm"
            variant="ghost"
            onPress={() => {
              navigator.clipboard?.writeText(code);
              setCopied(true);
              setTimeout(() => setCopied(false), 1200);
            }}
          >
            {copied ? "Copied" : "Copy"}
          </Button>
        ) : null}
      </HStack>
      <Box padding="$3" overflowX="auto">
        <pre
          style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </Box>
    </Box>
  );
}
