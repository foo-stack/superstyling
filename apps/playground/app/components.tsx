/* oxlint-disable react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-new-function-as-prop -- showcase page; perf irrelevant */
import { useState } from "react";
import { ScrollView } from "react-native";
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
  Modal,
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
    <ScrollView style={{ flex: 1 }} contentInsetAdjustmentBehavior="automatic">
      <Box padding="$4" gap="$6" paddingBottom="$12">
        <VStack gap="$2">
          <Heading level={1}>Superstyling Playground</Heading>
          <Text color="$color10">Native showcase for every primitive.</Text>
        </VStack>

        <Section title="Typography">
          <Heading level={1}>Heading 1</Heading>
          <Heading level={2}>Heading 2</Heading>
          <Heading level={3}>Heading 3</Heading>
          <Text fontSize="$4">Body text paragraph.</Text>
          <Text fontSize="$2" color="$color10">
            Caption.
          </Text>
        </Section>

        <Section title="Layout">
          <Text fontWeight="600">HStack</Text>
          <HStack gap="$3">
            <Box width={40} height={40} backgroundColor="$primary" borderRadius={6} />
            <Box width={40} height={40} backgroundColor="$primary" borderRadius={6} />
            <Box width={40} height={40} backgroundColor="$primary" borderRadius={6} />
          </HStack>
          <Divider marginVertical="$2" />
          <Stack direction="column" gap="$2">
            <Box height={24} backgroundColor="$primary" borderRadius={4} />
            <Box height={24} backgroundColor="$primary" borderRadius={4} />
          </Stack>
        </Section>

        <Section title="Spinner">
          <HStack gap="$4" alignItems="center">
            <Spinner size="small" />
            <Spinner size="large" />
          </HStack>
        </Section>

        <Section title="Badge">
          <VStack gap="$3">
            {BADGE_VARIANTS.map((variant) => (
              <HStack key={variant} gap="$2" flexWrap="wrap">
                {COLOR_SCHEMES.map((cs) => (
                  <Badge key={cs} variant={variant} colorScheme={cs}>
                    {cs}
                  </Badge>
                ))}
              </HStack>
            ))}
          </VStack>
        </Section>

        <Section title="Alert">
          <VStack gap="$3">
            {ALERT_VARIANTS.map((variant) => (
              <VStack key={variant} gap="$2">
                <Text fontWeight="600" color="$color10">
                  variant: {variant}
                </Text>
                {ALERT_STATUSES.map((status) => (
                  <Alert key={status} status={status} variant={variant}>
                    <Alert.Icon />
                    <Alert.Content>
                      <Alert.Title>{titleCase(status)}</Alert.Title>
                      <Alert.Description>
                        A {status} alert in {variant} form.
                      </Alert.Description>
                    </Alert.Content>
                  </Alert>
                ))}
              </VStack>
            ))}
          </VStack>
        </Section>

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
          </HStack>
        </Section>

        <Section title="Button">
          <VStack gap="$2">
            {BUTTON_VARIANTS.map((variant) => (
              <HStack key={variant} gap="$2" flexWrap="wrap">
                {BUTTON_SIZES.map((size) => (
                  <Button key={size} variant={variant} size={size} colorScheme="blue">
                    {size.toUpperCase()}
                  </Button>
                ))}
              </HStack>
            ))}
          </VStack>
        </Section>

        <Section title="Button — icons + states">
          <VStack gap="$2">
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
          </VStack>
        </Section>

        <Section title="IconButton">
          <HStack gap="$2">
            <IconButton aria-label="Search" icon={<SearchIcon />} variant="outline" />
            <IconButton aria-label="Add" icon={<PlusIcon />} colorScheme="blue" />
            <IconButton aria-label="More" icon={<ChevronDownIcon />} variant="ghost" />
          </HStack>
        </Section>

        <Section title="Modal">
          <ModalDemo />
        </Section>
      </Box>
    </ScrollView>
  );
}

function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <VStack gap="$2" alignItems="flex-start">
      <Button colorScheme="blue" onPress={() => setOpen(true)}>
        Open Modal
      </Button>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Dialog</Modal.Title>
          </Modal.Header>
          <Modal.CloseButton />
          <Modal.Body>
            <Text>This is a native-rendered modal via Tamagui Dialog.</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="ghost" onPress={() => setOpen(false)}>
              Cancel
            </Button>
            <Button colorScheme="blue" onPress={() => setOpen(false)}>
              OK
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </VStack>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <VStack gap="$2">
      <Heading level={3}>{title}</Heading>
      <Box
        padding="$3"
        backgroundColor="$background"
        borderWidth={1}
        borderColor="$borderColor"
        borderRadius={8}
        gap="$2"
      >
        {children}
      </Box>
    </VStack>
  );
}

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
