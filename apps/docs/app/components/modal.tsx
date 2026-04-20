/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-new-array-as-prop, react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-function-as-prop -- docs page */
import { useState } from "react";
import { Button, HStack, Modal, Text } from "@superstyling/core";
import { ComponentDemo } from "../../src/docs/ComponentDemo";
import { DocsPage, PropsTable, Section } from "../../src/docs/DocsLayout";

export default function ModalPage() {
  return (
    <DocsPage
      title="Modal"
      description="Modal dialog with an overlay, focus trap, and body scroll lock. Cross-platform: Tamagui Dialog under the hood, so native gets a native-feeling overlay and web gets a portaled fixed-position layer."
    >
      <Section title="Import">
        <ComponentDemo
          code={`import { Modal } from "@superstyling/core";`}
          preview={<Text fontFamily="$mono">import {"{ Modal }"} from "@superstyling/core";</Text>}
          defaultOpen
        />
      </Section>

      <Section title="Basic modal">
        <ComponentDemo
          code={`function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onPress={() => setOpen(true)}>Open modal</Button>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header><Modal.Title>Title</Modal.Title></Modal.Header>
          <Modal.CloseButton />
          <Modal.Body><Text>Body content.</Text></Modal.Body>
          <Modal.Footer>
            <Button variant="ghost" onPress={() => setOpen(false)}>Cancel</Button>
            <Button colorScheme="blue" onPress={() => setOpen(false)}>OK</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
}`}
          preview={<BasicModalDemo />}
        />
      </Section>

      <Section title="Sizes">
        <ComponentDemo
          code={`<Modal isOpen={open} onClose={close} size="sm" />
<Modal isOpen={open} onClose={close} size="md" />  // default
<Modal isOpen={open} onClose={close} size="lg" />
<Modal isOpen={open} onClose={close} size="full" />`}
          preview={<SizeModalDemo />}
        />
      </Section>

      <Section title="Motion presets">
        <ComponentDemo
          code={`<Modal motionPreset="scale" />         // default
<Modal motionPreset="slideInBottom" />
<Modal motionPreset="slideInTop" />`}
          preview={<MotionModalDemo />}
        />
      </Section>

      <Section title="Props — Modal (root)">
        <PropsTable
          props={[
            {
              name: "isOpen",
              type: "boolean",
              required: true,
              description: "Controlled open state.",
            },
            {
              name: "onClose",
              type: "() => void",
              required: true,
              description:
                "Called when the user requests close (overlay click, close button, ESC).",
            },
            {
              name: "size",
              type: `"sm" | "md" | "lg" | "xl" | "2xl" | … | "full"`,
              default: `"md"`,
              description: "Width preset. full stretches edge to edge.",
            },
            {
              name: "motionPreset",
              type: `"scale" | "slideInBottom" | "slideInTop" | "slideInLeft" | "slideInRight" | "none"`,
              default: `"scale"`,
              description: "Enter/exit animation.",
            },
            {
              name: "scrollBehavior",
              type: `"inside" | "outside"`,
              default: `"outside"`,
              description:
                "Whether the body scrolls inside the modal or outside with the whole content.",
            },
            {
              name: "closeOnOverlayClick",
              type: "boolean",
              default: "true",
              description: "Dismiss on overlay click.",
            },
            {
              name: "closeOnEsc",
              type: "boolean",
              default: "true",
              description: "Dismiss on ESC key (web).",
            },
          ]}
        />
      </Section>
    </DocsPage>
  );
}

function BasicModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <HStack gap="$2">
      <Button onPress={() => setOpen(true)}>Open modal</Button>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Example modal</Modal.Title>
          </Modal.Header>
          <Modal.CloseButton />
          <Modal.Body>
            <Text>Body content goes here.</Text>
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
    </HStack>
  );
}

function SizeModalDemo() {
  const [size, setSize] = useState<null | "sm" | "md" | "lg" | "full">(null);
  return (
    <HStack gap="$2" flexWrap="wrap">
      {(["sm", "md", "lg", "full"] as const).map((s) => (
        <Button key={s} onPress={() => setSize(s)}>
          {s.toUpperCase()}
        </Button>
      ))}
      <Modal isOpen={size !== null} onClose={() => setSize(null)} size={size ?? "md"}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Size: {size}</Modal.Title>
          </Modal.Header>
          <Modal.CloseButton />
          <Modal.Body>
            <Text>Body for size {size}.</Text>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </HStack>
  );
}

function MotionModalDemo() {
  const [motion, setMotion] = useState<null | "scale" | "slideInBottom" | "slideInTop">(null);
  return (
    <HStack gap="$2" flexWrap="wrap">
      {(["scale", "slideInBottom", "slideInTop"] as const).map((m) => (
        <Button key={m} onPress={() => setMotion(m)} variant="outline">
          {m}
        </Button>
      ))}
      <Modal
        isOpen={motion !== null}
        onClose={() => setMotion(null)}
        motionPreset={motion ?? "scale"}
      >
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Motion: {motion}</Modal.Title>
          </Modal.Header>
          <Modal.CloseButton />
          <Modal.Body>
            <Text>Motion preset {motion}.</Text>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </HStack>
  );
}
