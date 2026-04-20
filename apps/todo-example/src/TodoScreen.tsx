/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-function-as-prop -- sample app */
import { useState } from "react";
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  FormControl,
  HStack,
  Heading,
  IconButton,
  Input,
  Modal,
  Radio,
  RadioGroup,
  Switch,
  Text,
  VStack,
  useColorMode,
} from "@superstyling/core";
import { CloseIcon, MoonIcon, PlusIcon, SunIcon } from "@superstyling/icons";
import type { Session } from "./App";

interface Todo {
  id: string;
  title: string;
  done: boolean;
  createdAt: number;
}

type Filter = "all" | "active" | "done";

let idCounter = 1;
const seed: Todo[] = [
  {
    id: String(idCounter++),
    title: "Try the login flow",
    done: true,
    createdAt: Date.now() - 60_000,
  },
  {
    id: String(idCounter++),
    title: "Dogfood the library",
    done: false,
    createdAt: Date.now() - 30_000,
  },
  {
    id: String(idCounter++),
    title: "File a GitHub issue for every rough edge",
    done: false,
    createdAt: Date.now(),
  },
];

/** Main TODO screen shown after sign-in. */
export function TodoScreen({ session, onSignOut }: { session: Session; onSignOut: () => void }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const [todos, setTodos] = useState<Todo[]>(seed);
  const [draft, setDraft] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const visible = todos.filter((t) =>
    filter === "all" ? true : filter === "active" ? !t.done : t.done,
  );
  const activeCount = todos.filter((t) => !t.done).length;

  function addTodo() {
    if (draft.trim().length === 0) return;
    setTodos((p) => [
      ...p,
      { id: String(idCounter++), title: draft.trim(), done: false, createdAt: Date.now() },
    ]);
    setDraft("");
  }

  function toggle(id: string) {
    setTodos((p) => p.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function remove(id: string) {
    setTodos((p) => p.filter((t) => t.id !== id));
  }

  function clearCompleted() {
    setTodos((p) => p.filter((t) => !t.done));
    setConfirmOpen(false);
  }

  return (
    <Box flex={1} padding="$4" maxWidth={720} width="100%" alignSelf="center">
      <VStack gap="$4">
        {/* Header */}
        <HStack gap="$3" alignItems="center" justifyContent="space-between">
          <HStack gap="$3" alignItems="center">
            <Avatar circular size="$5">
              <Avatar.Fallback backgroundColor="$primaryMuted" />
            </Avatar>
            <VStack gap="$0">
              <Heading level={3}>Hi, {session.email.split("@")[0]}</Heading>
              <Text fontSize="$2" color="$color10">
                {activeCount} active · {todos.length - activeCount} done
              </Text>
            </VStack>
          </HStack>
          <HStack gap="$2">
            <IconButton
              aria-label={colorMode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
              variant="ghost"
              onPress={toggleColorMode}
            />
            <Button size="sm" variant="outline" onPress={() => setSettingsOpen(true)}>
              Settings
            </Button>
          </HStack>
        </HStack>

        <Divider />

        {/* Add-todo composer */}
        <HStack gap="$2" alignItems="flex-end">
          <Box flex={1}>
            <FormControl>
              <FormControl.Label>New task</FormControl.Label>
              <Input value={draft} onChangeText={setDraft} placeholder="What needs doing?" />
            </FormControl>
          </Box>
          <Button
            leftIcon={<PlusIcon />}
            colorScheme="blue"
            onPress={addTodo}
            isDisabled={draft.trim().length === 0}
          >
            Add
          </Button>
        </HStack>

        {/* Filter */}
        <FormControl>
          <FormControl.Label>Filter</FormControl.Label>
          <RadioGroup value={filter} onChange={(v) => setFilter(v as Filter)} colorScheme="blue">
            <Radio value="all">All</Radio>
            <Radio value="active">Active</Radio>
            <Radio value="done">Done</Radio>
          </RadioGroup>
        </FormControl>

        <Divider />

        {/* List */}
        {visible.length === 0 ? (
          <Alert status="info">
            <Alert.Icon />
            <Alert.Content>
              <Alert.Title>Nothing here</Alert.Title>
              <Alert.Description>
                {filter === "done"
                  ? "No completed tasks yet."
                  : filter === "active"
                    ? "All done — great job."
                    : "Add your first task above."}
              </Alert.Description>
            </Alert.Content>
          </Alert>
        ) : (
          <VStack gap="$2">
            {visible.map((t) => (
              <HStack
                key={t.id}
                gap="$3"
                alignItems="center"
                padding="$3"
                borderWidth={1}
                borderColor="$borderColor"
                borderRadius={8}
              >
                <Switch
                  size="sm"
                  isChecked={t.done}
                  onChange={() => toggle(t.id)}
                  colorScheme="green"
                />
                <Text
                  flex={1}
                  fontSize="$3"
                  color={t.done ? "$color10" : "$foreground"}
                  // The RN-web `textDecorationLine` prop survives both platforms.
                  textDecorationLine={t.done ? "line-through" : "none"}
                >
                  {t.title}
                </Text>
                {t.done ? <Badge colorScheme="green">done</Badge> : null}
                <IconButton
                  aria-label={`Delete ${t.title}`}
                  icon={<CloseIcon />}
                  variant="ghost"
                  size="sm"
                  onPress={() => remove(t.id)}
                />
              </HStack>
            ))}
          </VStack>
        )}

        {/* Footer actions */}
        <HStack gap="$2" justifyContent="flex-end">
          <Button
            variant="ghost"
            onPress={() => setConfirmOpen(true)}
            isDisabled={todos.every((t) => !t.done)}
          >
            Clear completed
          </Button>
          <Button variant="outline" onPress={onSignOut}>
            Sign out
          </Button>
        </HStack>
      </VStack>

      {/* Settings modal */}
      <Modal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Settings</Modal.Title>
          </Modal.Header>
          <Modal.CloseButton />
          <Modal.Body>
            <VStack gap="$3">
              <Switch defaultIsChecked colorScheme="blue">
                Email notifications
              </Switch>
              <Switch defaultIsChecked colorScheme="blue">
                Keyboard shortcuts
              </Switch>
              <Switch colorScheme="blue">Compact mode</Switch>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button colorScheme="blue" onPress={() => setSettingsOpen(false)}>
              Done
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* Confirm destructive action */}
      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} size="sm">
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Clear completed tasks?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Text>This removes all done tasks. Cannot be undone.</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="ghost" onPress={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button colorScheme="red" onPress={clearCompleted}>
              Clear
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
}
