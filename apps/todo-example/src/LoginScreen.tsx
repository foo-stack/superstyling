/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-function-as-prop -- sample app */
import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControl,
  Heading,
  Input,
  Text,
  VStack,
} from "@superstyling/core";
import type { Session } from "./App";

/**
 * Login screen. Client-only; "signs in" anyone whose email contains @ and
 * whose password is the literal string `todo`. Stores the session in parent
 * state — no actual auth backend.
 */
export function LoginScreen({ onSignIn }: { onSignIn: (s: Session) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const emailInvalid = email.length > 0 && !email.includes("@");
  const valid = email.includes("@") && password.length >= 4;

  function submit() {
    setError(null);
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      if (password !== "todo") {
        setError("Wrong password. Hint: use 'todo' — this is a demo.");
        return;
      }
      onSignIn({ email });
    }, 400);
  }

  return (
    <Box flex={1} alignItems="center" justifyContent="center" padding="$6">
      <Box width={400} maxWidth="100%">
        <VStack gap="$4">
          <VStack gap="$2">
            <Heading level={1}>Sign in</Heading>
            <Text fontSize="$3" color="$color10">
              Sample dogfood app — no real backend.
            </Text>
          </VStack>

          <FormControl isRequired isInvalid={emailInvalid}>
            <FormControl.Label>Email</FormControl.Label>
            <Input
              type="email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
            />
            <FormControl.ErrorMessage>Email must contain @.</FormControl.ErrorMessage>
          </FormControl>

          <FormControl isRequired>
            <FormControl.Label>Password</FormControl.Label>
            <Input type="password" value={password} onChangeText={setPassword} />
            <FormControl.HelperText>Use "todo" for the demo.</FormControl.HelperText>
          </FormControl>

          <Checkbox isChecked={remember} onChange={setRemember} colorScheme="blue">
            Keep me signed in
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
        </VStack>
      </Box>
    </Box>
  );
}
