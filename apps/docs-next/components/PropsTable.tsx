"use client";

/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-function-as-prop -- docs building block */
import { useMemo, useState } from "react";
import { Box, HStack, Input, Text, VStack } from "@superstyling/core";

export interface PropRow {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
  /** Optional grouping. Rows with the same `group` render together under a subheading. */
  group?: string;
}

const FILTER_THRESHOLD = 10;

/**
 * Props reference table. Ported verbatim from the Vocs v2 implementation —
 * the only change is the "use client" directive at top, needed under One's
 * SSR pipeline for the `useState`/`useMemo` filter behavior.
 */
export function PropsTable({ props }: { props: PropRow[] }) {
  const [query, setQuery] = useState("");
  const showFilter = props.length > FILTER_THRESHOLD;

  const filtered = useMemo(() => {
    if (query.trim().length === 0) return props;
    const needle = query.toLowerCase();
    return props.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.type.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle),
    );
  }, [props, query]);

  const grouped = useMemo(() => {
    const out = new Map<string, PropRow[]>();
    for (const p of filtered) {
      const key = p.group ?? "";
      const list = out.get(key) ?? [];
      list.push(p);
      out.set(key, list);
    }
    return Array.from(out.entries());
  }, [filtered]);

  return (
    <VStack
      gap={0}
      marginVertical="$4"
      borderWidth={1}
      borderColor="$borderColor"
      borderRadius={10}
      overflow="hidden"
      backgroundColor="$background"
    >
      {showFilter ? (
        <Box
          paddingHorizontal="$3"
          paddingVertical="$2"
          backgroundColor="$color2"
          borderBottomWidth={1}
          borderColor="$borderColor"
        >
          <Input
            size="sm"
            placeholder={`Filter ${props.length} props…`}
            value={query}
            onChangeText={setQuery}
          />
        </Box>
      ) : null}

      <HeaderRow />

      {grouped.map(([group, rows], gi) => (
        <VStack key={group || `_${gi}`} gap={0}>
          {group ? (
            <Box
              paddingHorizontal="$3"
              paddingVertical="$2"
              backgroundColor="$color2"
              borderTopWidth={gi === 0 ? 0 : 1}
              borderColor="$borderColor"
            >
              <Text
                fontSize="$2"
                fontWeight="700"
                color="$color10"
                textTransform="uppercase"
                letterSpacing={0.5}
              >
                {group}
              </Text>
            </Box>
          ) : null}
          {rows.map((p, i) => (
            <DataRow key={p.name} p={p} first={!group && gi === 0 && i === 0} />
          ))}
        </VStack>
      ))}

      {filtered.length === 0 ? (
        <Box padding="$4" alignItems="center">
          <Text fontSize="$3" color="$color10">
            No props match "{query}".
          </Text>
        </Box>
      ) : null}
    </VStack>
  );
}

function HeaderRow() {
  return (
    <HStack
      paddingHorizontal="$3"
      paddingVertical="$2"
      backgroundColor="$color3"
      borderBottomWidth={1}
      borderColor="$borderColor"
    >
      <HeaderCell flex={2}>Prop</HeaderCell>
      <HeaderCell flex={3}>Type</HeaderCell>
      <HeaderCell flex={2}>Default</HeaderCell>
      <HeaderCell flex={5}>Description</HeaderCell>
    </HStack>
  );
}

function HeaderCell({ children, flex }: { children: React.ReactNode; flex: number }) {
  return (
    <Text
      flex={flex}
      fontWeight="700"
      fontSize="$2"
      color="$color10"
      textTransform="uppercase"
      letterSpacing={0.4}
    >
      {children}
    </Text>
  );
}

function DataRow({ p, first }: { p: PropRow; first: boolean }) {
  return (
    <HStack
      paddingHorizontal="$3"
      paddingVertical="$3"
      borderTopWidth={first ? 0 : 1}
      borderColor="$borderColor"
      _hover={{ backgroundColor: "$color1" }}
    >
      <Text flex={2} fontFamily="$mono" fontSize="$2" fontWeight="600">
        {p.name}
        {p.required ? (
          <Text color="$red9" fontWeight="700">
            {" "}
            *
          </Text>
        ) : null}
      </Text>
      <Text flex={3} fontFamily="$mono" fontSize="$2" color="$color10">
        {p.type}
      </Text>
      <Text flex={2} fontFamily="$mono" fontSize="$2" color="$color10">
        {p.default ?? "—"}
      </Text>
      <Text flex={5} fontSize="$2" lineHeight="$4">
        {p.description}
      </Text>
    </HStack>
  );
}
