/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-new-array-as-prop, react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-function-as-prop -- docs page */
import { useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  HStack,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Text,
  VStack,
} from "@superstyling/core";
import { ComponentDemo } from "../../src/docs/ComponentDemo";
import { DocsPage, Section as DocsSection } from "../../src/docs/DocsLayout";

const SOURCE = `// A settings screen composed from form primitives.
// Groups: Profile, Notifications, Preferences, Danger Zone.
// See /examples/settings.tsx for the full source.`;

export default function SettingsExample() {
  return (
    <DocsPage
      title="Example — Settings screen"
      description="A realistic settings layout showing grouped FormControls, Switch toggles, a RadioGroup theme picker, and a destructive action at the bottom."
    >
      <DocsSection title="Live preview">
        <ComponentDemo code={SOURCE} preview={<SettingsPreview />} />
      </DocsSection>
    </DocsPage>
  );
}

function SettingsPreview() {
  const [displayName, setDisplayName] = useState("Ada Lovelace");
  const [role, setRole] = useState("eng");
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [theme, setTheme] = useState("system");

  return (
    <VStack gap="$6" maxWidth={560}>
      {/* Profile */}
      <Section title="Profile">
        <HStack gap="$3" alignItems="center">
          <Avatar circular size="$7">
            <Avatar.Image src="https://i.pravatar.cc/150?img=5" />
            <Avatar.Fallback backgroundColor="$primaryMuted" />
          </Avatar>
          <VStack gap="$1" flex={1}>
            <Text fontWeight="600">{displayName}</Text>
            <Text fontSize="$2" color="$color10">
              ada@superstyling.dev
            </Text>
          </VStack>
        </HStack>

        <FormControl>
          <FormControl.Label>Display name</FormControl.Label>
          <Input value={displayName} onChangeText={setDisplayName} />
        </FormControl>

        <FormControl>
          <FormControl.Label>Role</FormControl.Label>
          <Select value={role} onChange={setRole} placeholder="Choose role">
            <Select.Option value="eng" index={0}>
              Engineer
            </Select.Option>
            <Select.Option value="design" index={1}>
              Designer
            </Select.Option>
            <Select.Option value="pm" index={2}>
              Product manager
            </Select.Option>
          </Select>
        </FormControl>
      </Section>

      <Divider />

      {/* Notifications */}
      <Section title="Notifications">
        <Switch isChecked={emailNotif} onChange={setEmailNotif} colorScheme="blue">
          Email notifications
        </Switch>
        <Switch isChecked={pushNotif} onChange={setPushNotif} colorScheme="blue">
          Push notifications
        </Switch>
        <Switch isChecked={weeklyDigest} onChange={setWeeklyDigest} colorScheme="blue">
          Weekly digest
        </Switch>
      </Section>

      <Divider />

      {/* Preferences */}
      <Section title="Appearance">
        <FormControl>
          <FormControl.Label>Theme</FormControl.Label>
          <RadioGroup value={theme} onChange={setTheme} colorScheme="blue">
            <Radio value="light">Light</Radio>
            <Radio value="dark">Dark</Radio>
            <Radio value="system">Follow system</Radio>
          </RadioGroup>
        </FormControl>
      </Section>

      <Divider />

      {/* Danger zone */}
      <Section title="Danger zone">
        <Alert status="warning">
          <Alert.Icon />
          <Alert.Content>
            <Alert.Title>Delete account</Alert.Title>
            <Alert.Description>
              This permanently removes your profile and all content. Cannot be undone.
            </Alert.Description>
          </Alert.Content>
        </Alert>
        <HStack>
          <Box flex={1} />
          <Button colorScheme="red" variant="outline">
            Delete account
          </Button>
        </HStack>
      </Section>
    </VStack>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <VStack gap="$3">
      <Heading level={3}>{title}</Heading>
      {children}
    </VStack>
  );
}
