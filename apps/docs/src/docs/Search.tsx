/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-function-as-prop -- docs building block */
import { useEffect, useRef, useState } from "react";
import { Box, Input, Text, VStack } from "@superstyling/core";

/**
 * Pagefind-backed search. Loads `/pagefind/pagefind.js` at runtime — the
 * file only exists after `yarn build:search` (which runs Pagefind over the
 * output of `one build`). In dev or when the index is missing, the input
 * degrades to a disabled state with a "search unavailable" hint.
 */

interface PagefindResult {
  id: string;
  data: () => Promise<{
    url: string;
    excerpt: string;
    meta: { title?: string };
  }>;
}

interface PagefindSearchResponse {
  results: PagefindResult[];
}

interface PagefindAPI {
  search: (q: string) => Promise<PagefindSearchResponse>;
}

declare global {
  interface Window {
    // oxlint-disable-next-line typescript/no-explicit-any
    pagefind?: PagefindAPI;
  }
}

async function loadPagefind(): Promise<PagefindAPI | null> {
  if (typeof window === "undefined") return null;
  if (window.pagefind) return window.pagefind;
  try {
    // Vite/One will try to resolve this at build time — silence it with the
    // @vite-ignore hint so the string isn't followed. TS can't statically
    // resolve a runtime URL either, hence the cast.
    // oxlint-disable-next-line typescript/no-explicit-any
    const mod = (await import(/* @vite-ignore */ "/pagefind/pagefind.js" as any)) as PagefindAPI;
    window.pagefind = mod;
    return mod;
  } catch {
    return null;
  }
}

interface Hit {
  url: string;
  title: string;
  excerpt: string;
}

export function Search() {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [available, setAvailable] = useState<boolean | null>(null);
  const pagefindRef = useRef<PagefindAPI | null>(null);

  useEffect(() => {
    loadPagefind().then((pf) => {
      pagefindRef.current = pf;
      setAvailable(pf !== null);
    });
  }, []);

  useEffect(() => {
    if (!pagefindRef.current || q.trim().length < 2) {
      setHits([]);
      return;
    }
    let cancelled = false;
    pagefindRef.current.search(q).then(async (res) => {
      if (cancelled) return;
      const expanded = await Promise.all(
        res.results.slice(0, 8).map(async (r) => {
          const d = await r.data();
          return {
            url: d.url,
            title: d.meta.title ?? d.url,
            excerpt: d.excerpt,
          };
        }),
      );
      if (!cancelled) setHits(expanded);
    });
    return () => {
      cancelled = true;
    };
  }, [q]);

  return (
    <VStack gap="$2" position="relative" width={300}>
      <Input
        size="sm"
        placeholder={available === false ? "Search (build index to enable)" : "Search docs…"}
        value={q}
        onChangeText={setQ}
        isDisabled={available === false}
      />
      {hits.length > 0 ? (
        <Box
          position="absolute"
          top={40}
          left={0}
          right={0}
          backgroundColor="$background"
          borderWidth={1}
          borderColor="$borderColor"
          borderRadius={8}
          zIndex={10}
          paddingVertical="$1"
        >
          {hits.map((h) => (
            <Box key={h.url} paddingHorizontal="$3" paddingVertical="$2">
              <a href={h.url} style={{ textDecoration: "none" }}>
                <VStack gap="$1">
                  <Text fontWeight="600" fontSize="$3">
                    {h.title}
                  </Text>
                  <Text
                    fontSize="$2"
                    color="$color10"
                    // oxlint-disable-next-line typescript/no-explicit-any
                    dangerouslySetInnerHTML={{ __html: h.excerpt } as any}
                  />
                </VStack>
              </a>
            </Box>
          ))}
        </Box>
      ) : null}
    </VStack>
  );
}
