/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-jsx-as-prop -- docs building block */
import { Box, Text, VStack } from "@superstyling/core";

export interface PropRow {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

/**
 * Vocs-native markdown would render a props table too, but our type strings
 * (e.g. `"xs" | "sm" | "md" | "lg"`) are ergonomic to write in JS literal
 * form. Keeping this as a React component lets MDX pages pass arrays.
 */
export function PropsTable({ props }: { props: PropRow[] }) {
  return (
    <VStack
      borderWidth={1}
      borderColor="$borderColor"
      borderRadius={8}
      overflow="hidden"
      marginVertical="$3"
    >
      <Box
        flexDirection="row"
        paddingHorizontal="$3"
        paddingVertical="$2"
        backgroundColor="$color2"
        borderBottomWidth={1}
        borderColor="$borderColor"
      >
        <Text flex={2} fontWeight="700" fontSize="$2">
          Prop
        </Text>
        <Text flex={3} fontWeight="700" fontSize="$2">
          Type
        </Text>
        <Text flex={2} fontWeight="700" fontSize="$2">
          Default
        </Text>
        <Text flex={5} fontWeight="700" fontSize="$2">
          Description
        </Text>
      </Box>
      {props.map((p, i) => (
        <Box
          key={p.name}
          flexDirection="row"
          paddingHorizontal="$3"
          paddingVertical="$2"
          borderTopWidth={i === 0 ? 0 : 1}
          borderColor="$borderColor"
        >
          <Text flex={2} fontFamily="$mono" fontSize="$2">
            {p.name}
            {p.required ? <Text color="$red9"> *</Text> : null}
          </Text>
          <Text flex={3} fontFamily="$mono" fontSize="$2" color="$color10">
            {p.type}
          </Text>
          <Text flex={2} fontFamily="$mono" fontSize="$2" color="$color10">
            {p.default ?? "—"}
          </Text>
          <Text flex={5} fontSize="$2">
            {p.description}
          </Text>
        </Box>
      ))}
    </VStack>
  );
}
