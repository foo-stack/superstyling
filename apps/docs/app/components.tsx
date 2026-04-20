/* oxlint-disable react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-object-as-prop -- showcase page; perf irrelevant */
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  HStack,
  Heading,
  IconButton,
  Link,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@superstyling/core";
import { CheckIcon, ChevronDownIcon, CloseIcon, PlusIcon, SearchIcon } from "@superstyling/icons";

const COLOR_SCHEMES = ["gray", "blue", "red", "green", "purple"] as const;
const BUTTON_VARIANTS = ["solid", "outline", "ghost", "link"] as const;
const BUTTON_SIZES = ["xs", "sm", "md", "lg"] as const;
const BADGE_VARIANTS = ["solid", "subtle", "outline"] as const;
const ALERT_STATUSES = ["info", "success", "warning", "error", "loading"] as const;
const ALERT_VARIANTS = ["subtle", "solid", "left-accent", "top-accent"] as const;

export default function Components() {
  return (
    <Box padding="$6" maxWidth={960} marginHorizontal="auto" gap="$8">
      <VStack gap="$2">
        <Heading level={1}>Superstyling Components</Heading>
        <Text color="$color10">
          A dogfooding showcase of every primitive shipped in Phases 2–3.
        </Text>
      </VStack>

      {/* ─── Typography ─────────────────────────────────────────── */}
      <Section title="Typography">
        <Heading level={1}>Heading level 1</Heading>
        <Heading level={2}>Heading level 2</Heading>
        <Heading level={3}>Heading level 3</Heading>
        <Heading level={4}>Heading level 4</Heading>
        <Heading level={5}>Heading level 5</Heading>
        <Heading level={6}>Heading level 6</Heading>
        <Text fontSize="$4">Body text at fontSize $4 — the default paragraph size.</Text>
        <Text fontSize="$2" color="$color10">
          Small muted caption.
        </Text>
      </Section>

      {/* ─── Layout ─────────────────────────────────────────────── */}
      <Section title="Layout">
        <Text fontWeight="600">HStack</Text>
        <HStack gap="$3" alignItems="center">
          <Box width={40} height={40} backgroundColor="$primary" borderRadius={6} />
          <Box width={40} height={40} backgroundColor="$primary" borderRadius={6} />
          <Box width={40} height={40} backgroundColor="$primary" borderRadius={6} />
        </HStack>
        <Divider marginVertical="$2" />
        <Text fontWeight="600">VStack (via Stack direction=column)</Text>
        <Stack direction="column" gap="$2">
          <Box height={24} backgroundColor="$primary" borderRadius={4} />
          <Box height={24} backgroundColor="$primary" borderRadius={4} />
        </Stack>
        <Divider marginVertical="$2" />
        <Text fontWeight="600">Divider vertical</Text>
        <HStack height={60} alignItems="center" gap="$3">
          <Text>Left</Text>
          <Divider orientation="vertical" />
          <Text>Right</Text>
        </HStack>
      </Section>

      {/* ─── Feedback ───────────────────────────────────────────── */}
      <Section title="Spinner">
        <HStack gap="$4" alignItems="center">
          <Spinner size="small" />
          <Spinner size="large" />
        </HStack>
      </Section>

      <Section title="Badge — variant × colorScheme">
        <VStack gap="$3">
          {BADGE_VARIANTS.map((variant) => (
            <HStack key={variant} gap="$2" alignItems="center">
              <Text width={70} fontWeight="600">
                {variant}
              </Text>
              {COLOR_SCHEMES.map((cs) => (
                <Badge key={cs} variant={variant} colorScheme={cs}>
                  {cs}
                </Badge>
              ))}
            </HStack>
          ))}
        </VStack>
      </Section>

      <Section title="Alert — all statuses × variants">
        <VStack gap="$4">
          {ALERT_VARIANTS.map((variant) => (
            <VStack key={variant} gap="$2">
              <Text fontSize="$3" fontWeight="600" color="$color10">
                variant: {variant}
              </Text>
              {ALERT_STATUSES.map((status) => (
                <Alert key={status} status={status} variant={variant}>
                  <Alert.Icon />
                  <Alert.Content>
                    <Alert.Title>{titleCase(status)}</Alert.Title>
                    <Alert.Description>
                      This is a {status} alert using the {variant} variant.
                    </Alert.Description>
                  </Alert.Content>
                </Alert>
              ))}
            </VStack>
          ))}
        </VStack>
      </Section>

      {/* ─── Media ──────────────────────────────────────────────── */}
      <Section title="Avatar">
        <HStack gap="$3" alignItems="center">
          <Avatar circular size="$4">
            <Avatar.Image src="https://i.pravatar.cc/100?img=1" />
            <Avatar.Fallback backgroundColor="$primaryMuted" />
          </Avatar>
          <Avatar circular size="$6">
            <Avatar.Image src="https://i.pravatar.cc/150?img=2" />
            <Avatar.Fallback backgroundColor="$primaryMuted" />
          </Avatar>
          <Avatar circular size="$8">
            <Avatar.Image src="https://i.pravatar.cc/200?img=3" />
            <Avatar.Fallback backgroundColor="$primaryMuted" />
          </Avatar>
        </HStack>
      </Section>

      {/* ─── Interactive ────────────────────────────────────────── */}
      <Section title="Button — variant × size">
        <VStack gap="$3">
          {BUTTON_VARIANTS.map((variant) => (
            <HStack key={variant} gap="$2" alignItems="center">
              <Text width={70} fontWeight="600">
                {variant}
              </Text>
              {BUTTON_SIZES.map((size) => (
                <Button key={size} variant={variant} size={size} colorScheme="blue">
                  {size.toUpperCase()}
                </Button>
              ))}
            </HStack>
          ))}
        </VStack>
      </Section>

      <Section title="Button — states + icons">
        <HStack gap="$3" alignItems="center" flexWrap="wrap">
          <Button colorScheme="blue" leftIcon={<PlusIcon />}>
            Add
          </Button>
          <Button colorScheme="green" rightIcon={<CheckIcon />}>
            Confirm
          </Button>
          <Button colorScheme="red" variant="outline" leftIcon={<CloseIcon />}>
            Remove
          </Button>
          <Button isLoading>Saving…</Button>
          <Button isLoading loadingText="Submitting" colorScheme="blue">
            Submit
          </Button>
          <Button isDisabled>Disabled</Button>
        </HStack>
      </Section>

      <Section title="IconButton">
        <HStack gap="$2" alignItems="center">
          <IconButton aria-label="Search" icon={<SearchIcon />} variant="outline" />
          <IconButton aria-label="Add" icon={<PlusIcon />} colorScheme="blue" />
          <IconButton aria-label="More options" icon={<ChevronDownIcon />} variant="ghost" />
        </HStack>
      </Section>

      <Section title="Link">
        <VStack gap="$2" alignItems="flex-start">
          <Link href="/">Internal link</Link>
          <Link href="https://tamagui.dev" isExternal>
            External link (opens in new tab)
          </Link>
        </VStack>
      </Section>

      <Box paddingVertical="$6">
        <Text color="$color10" fontSize="$2">
          End of showcase · {new Date().getFullYear()} Superstyling
        </Text>
      </Box>
    </Box>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <VStack gap="$3">
      <Heading level={3}>{title}</Heading>
      <Box
        padding="$4"
        backgroundColor="$background"
        borderWidth={1}
        borderColor="$borderColor"
        borderRadius={8}
        gap="$3"
      >
        {children}
      </Box>
    </VStack>
  );
}

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
