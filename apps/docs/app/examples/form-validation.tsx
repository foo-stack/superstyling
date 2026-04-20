/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-new-array-as-prop, react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-function-as-prop -- docs page */
import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  Heading,
  Input,
  Text,
  Textarea,
  VStack,
} from "@superstyling/core";
import { ComponentDemo } from "../../src/docs/ComponentDemo";
import { DocsPage, Section } from "../../src/docs/DocsLayout";

const SOURCE = `// Sign-up form with field-level validation running on blur + submit.
// Each field owns its own validator; the submit button stays disabled
// until every field is valid. See /examples/form-validation.tsx.`;

interface Errors {
  name?: string;
  email?: string;
  password?: string;
  bio?: string;
}

function validate(values: { name: string; email: string; password: string; bio: string }): Errors {
  const e: Errors = {};
  if (values.name.trim().length < 2) e.name = "Name must be at least 2 characters.";
  if (!values.email.includes("@")) e.email = "Email must contain @.";
  if (values.password.length < 8) e.password = "Password must be at least 8 characters.";
  if (values.bio.length > 280) e.bio = "Bio must be 280 characters or fewer.";
  return e;
}

export default function FormValidationExample() {
  return (
    <DocsPage
      title="Example — Form with validation"
      description="Sign-up form showing field-level validation, touched tracking, and a submit flow. Built entirely from Superstyling primitives — no external form library required."
    >
      <Section title="Live preview">
        <ComponentDemo code={SOURCE} preview={<FormPreview />} />
      </Section>

      <Section title="What to notice">
        <VStack gap="$2">
          <Text fontSize="$3">· The submit button stays disabled until every field validates.</Text>
          <Text fontSize="$3">
            · <Text fontFamily="$mono">FormControl.isInvalid</Text> is only applied after the field
            has been touched (blurred) — no angry red border before the user's even tried.
          </Text>
          <Text fontSize="$3">
            · Errors ride in <Text fontFamily="$mono">FormControl.ErrorMessage</Text>, which reads
            as <Text fontFamily="$mono">aria-live="polite"</Text> so screen readers announce them
            without stealing focus.
          </Text>
        </VStack>
      </Section>
    </DocsPage>
  );
}

function FormPreview() {
  const [values, setValues] = useState({ name: "", email: "", password: "", bio: "" });
  const [touched, setTouched] = useState<Record<keyof Errors, boolean>>({
    name: false,
    email: false,
    password: false,
    bio: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const errors = validate(values);
  const allValid = Object.keys(errors).length === 0;

  function set(k: keyof typeof values, v: string) {
    setValues((p) => ({ ...p, [k]: v }));
  }
  function touch(k: keyof Errors) {
    setTouched((p) => ({ ...p, [k]: true }));
  }
  function show(k: keyof Errors) {
    return touched[k] && !!errors[k];
  }

  if (submitted) {
    return (
      <Alert status="success">
        <Alert.Icon />
        <Alert.Content>
          <Alert.Title>Account created</Alert.Title>
          <Alert.Description>Welcome, {values.name}!</Alert.Description>
        </Alert.Content>
      </Alert>
    );
  }

  return (
    <Box maxWidth={420}>
      <VStack gap="$4">
        <Heading level={2}>Sign up</Heading>

        <FormControl isRequired isInvalid={show("name")}>
          <FormControl.Label>Name</FormControl.Label>
          <Input
            value={values.name}
            onChangeText={(v) => set("name", v)}
            onBlur={() => touch("name")}
            placeholder="Ada Lovelace"
          />
          <FormControl.ErrorMessage>{errors.name}</FormControl.ErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={show("email")}>
          <FormControl.Label>Email</FormControl.Label>
          <Input
            type="email"
            value={values.email}
            onChangeText={(v) => set("email", v)}
            onBlur={() => touch("email")}
            placeholder="you@example.com"
          />
          <FormControl.ErrorMessage>{errors.email}</FormControl.ErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={show("password")}>
          <FormControl.Label>Password</FormControl.Label>
          <Input
            type="password"
            value={values.password}
            onChangeText={(v) => set("password", v)}
            onBlur={() => touch("password")}
          />
          <FormControl.HelperText>At least 8 characters.</FormControl.HelperText>
          <FormControl.ErrorMessage>{errors.password}</FormControl.ErrorMessage>
        </FormControl>

        <FormControl isInvalid={show("bio")}>
          <FormControl.Label>Bio</FormControl.Label>
          <Textarea
            value={values.bio}
            onChangeText={(v) => set("bio", v)}
            onBlur={() => touch("bio")}
            rows={3}
            placeholder="Tell us about yourself"
          />
          <FormControl.HelperText>{values.bio.length}/280</FormControl.HelperText>
          <FormControl.ErrorMessage>{errors.bio}</FormControl.ErrorMessage>
        </FormControl>

        <Button colorScheme="blue" isDisabled={!allValid} onPress={() => setSubmitted(true)}>
          Create account
        </Button>
      </VStack>
    </Box>
  );
}
