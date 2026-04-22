/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-function-as-prop, react-perf/jsx-no-new-array-as-prop -- docs page, not a hot path */
import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  Heading,
  Input,
  Textarea,
  VStack,
} from "@superstyling/core";
import { DocsPage } from "~/components/DocsPage";
import { ComponentDemo } from "~/components/ComponentDemo";
import { mdxComponents } from "~/components/MDXComponents";

const H1 = mdxComponents.h1;
const H2 = mdxComponents.h2;
const P = mdxComponents.p;

type Field = "name" | "email" | "password" | "bio";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;

function validate(values: Values): Errors {
  const e: Errors = {};
  if (values.name.trim().length < 2) e.name = "Name must be at least 2 characters.";
  if (!values.email.includes("@")) e.email = "Email must contain @.";
  if (values.password.length < 8) e.password = "Password must be at least 8 characters.";
  if (values.bio.length > 280) e.bio = "Bio must be 280 characters or fewer.";
  return e;
}

function FormPreview() {
  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    password: "",
    bio: "",
  });
  const [touched, setTouched] = useState<Record<Field, boolean>>({
    name: false,
    email: false,
    password: false,
    bio: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const errors = validate(values);
  const allValid = Object.keys(errors).length === 0;
  function set(k: Field, v: string) {
    setValues((p) => ({ ...p, [k]: v }));
  }
  function touch(k: Field) {
    setTouched((p) => ({ ...p, [k]: true }));
  }
  function show(k: Field) {
    return touched[k] && Boolean(errors[k]);
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

export default function FormValidationExamplePage() {
  return (
    <DocsPage currentPath="/examples/form-validation">
      <H1>Example — Form with validation</H1>
      <P>
        Sign-up form showing field-level validation, touched tracking, and a submit flow. Built
        entirely from Superstyling primitives — no external form library required.
      </P>
      <ComponentDemo
        code={`// Sign-up form with field-level validation running on blur + submit.
// Each field owns its own validator; the submit button stays disabled
// until every field is valid.`}
        preview={<FormPreview />}
      />
      <H2>What to notice</H2>
      <P>
        The submit button stays disabled until every field validates. FormControl's isInvalid is
        only applied after the field has been touched (blurred) — no angry red border before the
        user's even tried. Errors ride in FormControl.ErrorMessage, which reads as
        aria-live="polite" so screen readers announce them without stealing focus.
      </P>
    </DocsPage>
  );
}
