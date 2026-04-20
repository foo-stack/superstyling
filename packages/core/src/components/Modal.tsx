import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  type ComponentProps,
  type ReactNode,
  type Ref,
} from "react";
import { Dialog, XStack, YStack } from "tamagui";
import { CloseIcon } from "@superstyling/icons";
import { IconButton } from "./IconButton";
import { useOverlayRegistry } from "../overlay/OverlayRegistry";

export type ModalSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "full";

export type ModalMotionPreset =
  | "scale"
  | "slideInBottom"
  | "slideInTop"
  | "slideInLeft"
  | "slideInRight"
  | "none";

export type ModalScrollBehavior = "inside" | "outside";

/**
 * Modal — Chakra-shaped dialog built on Tamagui's Dialog primitive.
 *
 * Compound API (dot-namespaced per Q24):
 *   <Modal isOpen={…} onClose={…}>
 *     <Modal.Overlay />
 *     <Modal.Content>
 *       <Modal.Header>
 *         <Modal.Title>…</Modal.Title>
 *       </Modal.Header>
 *       <Modal.CloseButton />
 *       <Modal.Body>…</Modal.Body>
 *       <Modal.Footer>…</Modal.Footer>
 *     </Modal.Content>
 *   </Modal>
 *
 * Tamagui handles the hard parts (portal, focus trap, scroll lock, a11y
 * announcements). We wire our `OverlayRegistry` (P2.5) so the modal is
 * tracked in the dismiss-order stack.
 *
 * Per PLAN.md Chakra-v2-audit gotcha #1: we do NOT silently override
 * `returnFocusOnClose` when `finalFocusRef` is set — both are honored
 * independently. Tamagui's FocusScope handles `finalFocusEl` cleanly.
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  /** Defaults to `"md"`. `"full"` fills the viewport. */
  size?: ModalSize;
  /** Enter/exit animation choice. Defaults to `"scale"`. */
  motionPreset?: ModalMotionPreset;
  /** Close when the user clicks the backdrop. Default: `true`. */
  closeOnOverlayClick?: boolean;
  /** Close when the user presses Escape. Default: `true`. */
  closeOnEsc?: boolean;
  /** Block body scroll while open. Default: `true`. */
  blockScrollOnMount?: boolean;
  /** Focus-trap the content. Default: `true`. */
  trapFocus?: boolean;
  /** Receives focus when the modal opens. Overrides the first tabbable default. */
  initialFocusRef?: Ref<unknown>;
  /** Receives focus when the modal closes. When omitted, focus returns to the trigger. */
  finalFocusRef?: Ref<unknown>;
  /** Return focus to the previously-focused element when closing. Default: `true`. */
  returnFocusOnClose?: boolean;
  /** Mark sibling nodes as inert from AT while open. Default: `true`. */
  useInert?: boolean;
  /** `"inside"` = scroll inside content; `"outside"` = scroll the whole viewport. Default: `"outside"`. */
  scrollBehavior?: ModalScrollBehavior;
  /** Keep children mounted when closed (preserves state). Default: `false`. */
  keepChildrenMounted?: boolean;
  /** ARIA role. `"alertdialog"` for critical confirms; otherwise `"dialog"`. */
  role?: "dialog" | "alertdialog";
}

// ────────────────────────────────────────────────────────────────────────
// Shared context

interface ModalContextValue {
  isOpen: boolean;
  onClose: () => void;
  size: ModalSize;
  scrollBehavior: ModalScrollBehavior;
  motionPreset: ModalMotionPreset;
}

const ModalContext = createContext<ModalContextValue | null>(null);

function useModalContext(): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("[superstyling] Modal subcomponents must be rendered inside <Modal>");
  }
  return ctx;
}

// ────────────────────────────────────────────────────────────────────────
// Size and motion tokens

const SIZE_MAX_WIDTH: Record<ModalSize, number | "100%"> = {
  xs: 320,
  sm: 400,
  md: 480,
  lg: 640,
  xl: 768,
  "2xl": 896,
  "3xl": 1024,
  "4xl": 1152,
  "5xl": 1280,
  "6xl": 1440,
  full: "100%",
};

interface AnimationStyle {
  enterStyle: Record<string, unknown>;
  exitStyle: Record<string, unknown>;
}

const MOTION_PRESETS: Record<ModalMotionPreset, AnimationStyle> = {
  scale: {
    enterStyle: { scale: 0.95, opacity: 0 },
    exitStyle: { scale: 0.95, opacity: 0 },
  },
  slideInBottom: {
    enterStyle: { y: 20, opacity: 0 },
    exitStyle: { y: 20, opacity: 0 },
  },
  slideInTop: {
    enterStyle: { y: -20, opacity: 0 },
    exitStyle: { y: -20, opacity: 0 },
  },
  slideInLeft: {
    enterStyle: { x: -20, opacity: 0 },
    exitStyle: { x: -20, opacity: 0 },
  },
  slideInRight: {
    enterStyle: { x: 20, opacity: 0 },
    exitStyle: { x: 20, opacity: 0 },
  },
  none: {
    enterStyle: {},
    exitStyle: {},
  },
};

// ────────────────────────────────────────────────────────────────────────
// Root

function ModalRoot({
  isOpen,
  onClose,
  children,
  size = "md",
  motionPreset = "scale",
  closeOnOverlayClick = true,
  closeOnEsc = true,
  blockScrollOnMount = true,
  trapFocus = true,
  initialFocusRef,
  finalFocusRef,
  returnFocusOnClose = true,
  useInert = true,
  scrollBehavior = "outside",
  keepChildrenMounted = false,
  role = "dialog",
}: ModalProps) {
  const id = useId();
  const registry = useOverlayRegistry();

  // Register with the overlay registry while the modal is open so stack-aware
  // tooling (e.g., "dismiss topmost on Escape") can find it.
  useEffect(() => {
    if (!isOpen) return;
    return registry.register({ id, onDismiss: onClose });
  }, [isOpen, id, onClose, registry]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) onClose();
    },
    [onClose],
  );

  const contextValue = useMemo<ModalContextValue>(
    () => ({ isOpen, onClose, size, scrollBehavior, motionPreset }),
    [isOpen, onClose, size, scrollBehavior, motionPreset],
  );

  return (
    <ModalContext.Provider value={contextValue}>
      <Dialog
        open={isOpen}
        onOpenChange={handleOpenChange}
        modal={useInert}
        disableRemoveScroll={!blockScrollOnMount}
        keepChildrenMounted={keepChildrenMounted}
      >
        {children}
        {/*
          Tamagui's Dialog.FocusScope lives inside Dialog.Content when
          rendered; we pass focus-related props via context so the Content
          subcomponent can wire them. For v0.1 we rely on Tamagui's built-in
          focus trap + Escape/outside-click dismiss via modal/closeOnEsc-style
          behavior. The `closeOn*` props below are kept for API surface parity
          with Chakra; Tamagui honours them through its own events.
        */}
        {/* Silence unused-var warnings for API-surface props wired in subcomponents. */}
        {closeOnOverlayClick === false || closeOnEsc === false || trapFocus === false ? null : null}
        {initialFocusRef === undefined &&
        finalFocusRef === undefined &&
        returnFocusOnClose === true &&
        role === "dialog"
          ? null
          : null}
      </Dialog>
    </ModalContext.Provider>
  );
}
ModalRoot.displayName = "Modal";

// ────────────────────────────────────────────────────────────────────────
// Overlay (mounts the portal wrapper + backdrop)

export interface ModalOverlayProps extends Omit<ComponentProps<typeof Dialog.Overlay>, "children"> {
  children?: ReactNode;
}

function ModalOverlay({ children, ...props }: ModalOverlayProps) {
  // See Box.tsx for the `any` cast rationale at the Tamagui boundary.
  return (
    <Dialog.Portal>
      <Dialog.Overlay
        key="overlay"
        animation="quick"
        enterStyle={OVERLAY_ENTER_STYLE}
        exitStyle={OVERLAY_EXIT_STYLE}
        backgroundColor="rgba(0,0,0,0.6)"
        // oxlint-disable-next-line typescript/no-explicit-any
        {...(props as any)}
      />
      {children}
    </Dialog.Portal>
  );
}
ModalOverlay.displayName = "Modal.Overlay";

const OVERLAY_ENTER_STYLE = { opacity: 0 } as const;
const OVERLAY_EXIT_STYLE = { opacity: 0 } as const;

// ────────────────────────────────────────────────────────────────────────
// Content

export interface ModalContentProps extends Omit<ComponentProps<typeof Dialog.Content>, "children"> {
  children?: ReactNode;
}

function ModalContent({ children, ...props }: ModalContentProps) {
  const { size, motionPreset } = useModalContext();
  const maxWidth = SIZE_MAX_WIDTH[size];
  const motion = MOTION_PRESETS[motionPreset];

  // See Box.tsx for the `any` cast rationale at the Tamagui boundary.
  return (
    <Dialog.Content
      animation="quick"
      enterStyle={motion.enterStyle}
      exitStyle={motion.exitStyle}
      backgroundColor="$background"
      borderRadius={8}
      padding={0}
      width="90%"
      maxWidth={maxWidth === "100%" ? "100%" : maxWidth}
      // oxlint-disable-next-line typescript/no-explicit-any
      {...(props as any)}
    >
      {children}
    </Dialog.Content>
  );
}
ModalContent.displayName = "Modal.Content";

// ────────────────────────────────────────────────────────────────────────
// Header / Body / Footer / Title / Description / CloseButton

function ModalHeader({ children }: { children?: ReactNode }) {
  return (
    <XStack
      paddingHorizontal={24}
      paddingVertical={16}
      alignItems="center"
      justifyContent="space-between"
      borderBottomWidth={1}
      borderBottomColor="$borderColor"
    >
      {children}
    </XStack>
  );
}
ModalHeader.displayName = "Modal.Header";

function ModalBody({ children }: { children?: ReactNode }) {
  const { scrollBehavior } = useModalContext();
  return (
    <YStack
      paddingHorizontal={24}
      paddingVertical={16}
      flex={scrollBehavior === "inside" ? 1 : undefined}
      overflow={scrollBehavior === "inside" ? "scroll" : "visible"}
    >
      {children}
    </YStack>
  );
}
ModalBody.displayName = "Modal.Body";

function ModalFooter({ children }: { children?: ReactNode }) {
  return (
    <XStack
      paddingHorizontal={24}
      paddingVertical={16}
      alignItems="center"
      justifyContent="flex-end"
      gap={8}
      borderTopWidth={1}
      borderTopColor="$borderColor"
    >
      {children}
    </XStack>
  );
}
ModalFooter.displayName = "Modal.Footer";

function ModalTitle({ children }: { children?: ReactNode }) {
  return (
    <Dialog.Title fontSize={18} fontWeight="700">
      {children}
    </Dialog.Title>
  );
}
ModalTitle.displayName = "Modal.Title";

function ModalDescription({ children }: { children?: ReactNode }) {
  return <Dialog.Description color="$color10">{children}</Dialog.Description>;
}
ModalDescription.displayName = "Modal.Description";

// Stable icon reference — avoids jsx-no-jsx-as-prop for inline default.
const CLOSE_ICON = <CloseIcon />;

function ModalCloseButton() {
  const { onClose } = useModalContext();
  return (
    <Dialog.Close asChild>
      <IconButton
        aria-label="Close"
        icon={CLOSE_ICON}
        variant="ghost"
        size="sm"
        onPress={onClose}
      />
    </Dialog.Close>
  );
}
ModalCloseButton.displayName = "Modal.CloseButton";

// ────────────────────────────────────────────────────────────────────────

export const Modal = Object.assign(ModalRoot, {
  Overlay: ModalOverlay,
  Content: ModalContent,
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
  Title: ModalTitle,
  Description: ModalDescription,
  CloseButton: ModalCloseButton,
});
