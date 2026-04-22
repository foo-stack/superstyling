"use client";

/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-new-function-as-prop, react-perf/jsx-no-new-array-as-prop -- docs chrome, not a hot path */
import { useMemo, useState, useEffect, useRef } from "react";
import uFuzzy from "@leeoniya/ufuzzy";
import { Box, Input, VStack, Text, Link } from "@superstyling/core";
import { SEARCH_INDEX, type SearchEntry } from "~/features/searchIndex";

const MAX_RESULTS = 8;

/**
 * Inline search box for TopNav. Renders an input + floating results panel.
 * uFuzzy runs on every keystroke against the prebuilt SEARCH_INDEX — no
 * network calls, ~100KB gzipped worst case (MDX sources are small).
 */
export function Search() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const haystacks = useMemo(() => SEARCH_INDEX.map((e) => e.haystack), []);
  const fuzzy = useMemo(() => new uFuzzy({ intraMode: 1 }), []);

  const results = useMemo<SearchEntry[]>(() => {
    const q = query.trim();
    if (q.length < 2) return [];
    const idxs = fuzzy.filter(haystacks, q);
    if (!idxs) return [];
    const info = fuzzy.info(idxs, haystacks, q);
    const order = fuzzy.sort(info, haystacks, q);
    return order
      .slice(0, MAX_RESULTS)
      .map((orderIdx) => {
        const idx = info.idx[orderIdx];
        return idx === undefined ? undefined : SEARCH_INDEX[idx];
      })
      .filter((e): e is SearchEntry => e !== undefined);
  }, [query, fuzzy, haystacks]);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      const target = results[active];
      if (target) window.location.href = target.href;
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <Box position="relative" width={260} ref={containerRef as never}>
      <Input
        size="sm"
        placeholder="Search docs…"
        value={query}
        onFocus={() => setOpen(true)}
        onChangeText={setQuery}
        onKeyDown={onKeyDown}
      />
      {open && results.length > 0 ? (
        <Box
          position="absolute"
          top={40}
          left={0}
          right={0}
          zIndex={50}
          backgroundColor="$background"
          borderWidth={1}
          borderColor="$borderColor"
          borderRadius={8}
          padding="$2"
          maxHeight={400}
          overflowY="auto"
        >
          <VStack gap="$1">
            {results.map((r, i) => (
              <Link
                key={r.href}
                href={r.href}
                textDecorationLine="none"
                paddingVertical="$2"
                paddingHorizontal="$3"
                borderRadius={6}
                backgroundColor={i === active ? "$backgroundHover" : "transparent"}
                onPress={() => setOpen(false)}
              >
                <VStack gap="$1">
                  <Text fontSize={14} fontWeight="600" color="$color">
                    {r.title}
                  </Text>
                  {r.description ? (
                    <Text fontSize={12} color="$color10" numberOfLines={2}>
                      {r.description}
                    </Text>
                  ) : null}
                </VStack>
              </Link>
            ))}
          </VStack>
        </Box>
      ) : null}
    </Box>
  );
}
