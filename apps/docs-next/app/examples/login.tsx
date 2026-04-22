/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-function-as-prop, react-perf/jsx-no-new-array-as-prop -- docs page, not a hot path */
import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControl,
  Heading,
  Input,
  Link,
  Text,
  VStack,
} from "@superstyling/core";
import { DocsPage } from "~/components/DocsPage";
import { ComponentDemo } from "~/components/ComponentDemo";
import { mdxComponents } from "~/components/MDXComponents";

const H1 = mdxComponents.h1;
const P = mdxComponents.p;

function LoginPreview() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const emailInvalid = email.length > 0 && !email.includes("@");
  const valid = email.includes("@") && password.length >= 8;
  function submit() {
    setError(null);
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      if (password !== "password") setError("Invalid email or password.");
    }, 800);
  }
  return (
    <Box maxWidth={360} alignSelf="flex-start">
      <VStack gap="$4">
        <Heading level={2}>Log in</Heading>
        <FormControl isRequired isInvalid={emailInvalid}>
          <FormControl.Label>Email</FormControl.Label>
          <Input type="email" value={email} onChangeText={setEmail} placeholder="you@example.com" />
          <FormControl.ErrorMessage>Must contain @.</FormControl.ErrorMessage>
        </FormControl>
        <FormControl isRequired>
          <FormControl.Label>Password</FormControl.Label>
          <Input type="password" value={password} onChangeText={setPassword} />
          <FormControl.HelperText>
            At least 8 characters. Try "password" to succeed.
          </FormControl.HelperText>
        </FormControl>
        <Checkbox isChecked={remember} onChange={setRemember} colorScheme="blue">
          Remember me
        </Checkbox>
        {error ? (
          <Alert status="error">
            <Alert.Icon />
            <Alert.Content>
              <Alert.Title>Sign-in failed</Alert.Title>
              <Alert.Description>{error}</Alert.Description>
            </Alert.Content>
          </Alert>
        ) : null}
        <Button
          colorScheme="blue"
          onPress={submit}
          isLoading={submitting}
          loadingText="Signing in"
          isDisabled={!valid}
        >
          Sign in
        </Button>
        <Text fontSize={14} color="$color10">
          Forgot your password? <Link href="/reset">Reset it</Link>
        </Text>
      </VStack>
    </Box>
  );
}

const SOURCE = `import { useState } from "react";
import {
  Alert, Button, Checkbox, FormControl, Heading, Input, Link, Text, VStack,
} from "@superstyling/core";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailInvalid = email.length > 0 && !email.includes("@");
  const valid = email.includes("@") && password.length >= 8;

  async function submit() {
    setError(null);
    setSubmitting(true);
    try {
      // call your auth endpoint here
    } catch (e) {
      setError("Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <VStack gap="$4" maxWidth={360}>
      <Heading level={2}>Log in</Heading>
      <FormControl isRequired isInvalid={emailInvalid}>
        <FormControl.Label>Email</FormControl.Label>
        <Input type="email" value={email} onChangeText={setEmail}
          placeholder="you@example.com" />
        <FormControl.ErrorMessage>Must contain @.</FormControl.ErrorMessage>
      </FormControl>
      <FormControl isRequired>
        <FormControl.Label>Password</FormControl.Label>
        <Input type="password" value={password} onChangeText={setPassword} />
        <FormControl.HelperText>At least 8 characters.</FormControl.HelperText>
      </FormControl>
      <Checkbox isChecked={remember} onChange={setRemember} colorScheme="blue">
        Remember me
      </Checkbox>
      {error ? (
        <Alert status="error">
          <Alert.Icon />
          <Alert.Content>
            <Alert.Title>Sign-in failed</Alert.Title>
            <Alert.Description>{error}</Alert.Description>
          </Alert.Content>
        </Alert>
      ) : null}
      <Button
        colorScheme="blue"
        onPress={submit}
        isLoading={submitting}
        loadingText="Signing in"
        isDisabled={!valid}
      >
        Sign in
      </Button>
      <Text fontSize={14} color="$color10">
        Forgot your password? <Link href="/reset">Reset it</Link>
      </Text>
    </VStack>
  );
}`;

export default function LoginExamplePage() {
  return (
    <DocsPage currentPath="/examples/login">
      <H1>Example — Login</H1>
      <P>
        Email + password login built from FormControl, Input, Checkbox, Button, and Alert.
        Demonstrates validation, loading state, and error surfacing.
      </P>
      <ComponentDemo code={SOURCE} preview={<LoginPreview />} />
    </DocsPage>
  );
}
