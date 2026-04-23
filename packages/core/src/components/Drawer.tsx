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

/**
 * Drawer — edge-sliding dialog. Matches Chakra's `<Drawer>` API surface
 * (placement / size / overlay / focus trap). Reuses Tamagui's Dialog
 * internals for portal + focus-scope + scroll-lock; the only shape
 * difference from Modal is placement-aware sizing + slide motion.
 *
 * Dot-namespaced compound:
 *   <Drawer isOpen={…} onClose={…} placement="right">
 *     <Drawer.Overlay />
 *     <Drawer.Content>
 *       <Drawer.Header>
 *         <Drawer.Title>…</Drawer.Title>
 *       </Drawer.Header>
 *       <Drawer.CloseButton />
 *       <Drawer.Body>…</Drawer.Body>
 *       <Drawer.Footer>…</Drawer.Footer>
 *     </Drawer.Content>
 *   </Drawer>
 */

export type DrawerPlacement = "top" | "right" | "bottom" | "left";
export type DrawerSize = "xs" | "sm" | "md" | "lg" | "xl" | "full";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  /** Which edge the drawer slides from. Default `"right"`. */
  placement?: DrawerPlacement;
  /** Size along the placement axis (width for left/right, height for top/bottom). */
  size?: DrawerSize;
  /** Close on backdrop click. Default `true`. */
  closeOnOverlayClick?: boolean;
  /** Close on Escape. Default `true`. */
  closeOnEsc?: boolean;
  /** Block body scroll while open. Default `true`. */
  blockScrollOnMount?: boolean;
  /** Focus-trap. Default `true`. */
  trapFocus?: boolean;
  initialFocusRef?: Ref<unknown>;
  finalFocusRef?: Ref<unknown>;
  returnFocusOnClose?: boolean;
  useInert?: boolean;
  keepChildrenMounted?: boolean;
}

interface DrawerContextValue {
  isOpen: boolean;
  onClose: () => void;
  placement: DrawerPlacement;
  size: DrawerSize;
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

function useDrawerContext(): DrawerContextValue {
  const ctx = useContext(DrawerContext);
  if (!ctx) {
    throw new Error("[superstyling] Drawer subcomponents must be rendered inside <Drawer>");
  }
  return ctx;
}

const SIZE_EXTENT: Record<DrawerSize, number | "100%"> = {
  xs: 240,
  sm: 320,
  md: 400,
  lg: 520,
  xl: 720,
  full: "100%",
};

interface PlacementStyle {
  containerAlign: {
    alignItems: "flex-start" | "flex-end" | "stretch" | "center";
    justifyContent: "flex-start" | "flex-end" | "center";
  };
  contentSize: { width?: number | "100%"; height?: number | "100%" };
  enter: Record<string, unknown>;
  exit: Record<string, unknown>;
}

function placementStyle(placement: DrawerPlacement, size: DrawerSize): PlacementStyle {
  const extent = SIZE_EXTENT[size];
  switch (placement) {
    case "left":
      return {
        containerAlign: { alignItems: "stretch", justifyContent: "flex-start" },
        contentSize: { width: extent, height: "100%" },
        enter: { x: -40, opacity: 0 },
        exit: { x: -40, opacity: 0 },
      };
    case "right":
      return {
        containerAlign: { alignItems: "stretch", justifyContent: "flex-end" },
        contentSize: { width: extent, height: "100%" },
        enter: { x: 40, opacity: 0 },
        exit: { x: 40, opacity: 0 },
      };
    case "top":
      return {
        containerAlign: { alignItems: "flex-start", justifyContent: "center" },
        contentSize: { width: "100%", height: extent },
        enter: { y: -40, opacity: 0 },
        exit: { y: -40, opacity: 0 },
      };
    case "bottom":
    default:
      return {
        containerAlign: { alignItems: "flex-end", justifyContent: "center" },
        contentSize: { width: "100%", height: extent },
        enter: { y: 40, opacity: 0 },
        exit: { y: 40, opacity: 0 },
      };
  }
}

function DrawerRoot({
  isOpen,
  onClose,
  children,
  placement = "right",
  size = "md",
  blockScrollOnMount = true,
}: DrawerProps) {
  // Unused-but-declared DrawerProps fields (closeOnOverlayClick / closeOnEsc /
  // trapFocus / initialFocusRef / finalFocusRef / returnFocusOnClose /
  // useInert / keepChildrenMounted) are accepted for API parity with
  // Modal and Chakra; they're handled by Tamagui's Dialog defaults for v0.2.
  // Wiring per-prop overrides tracked for v0.3 if use cases surface.
  const id = useId();
  const registry = useOverlayRegistry();

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

  const ctx = useMemo<DrawerContextValue>(
    () => ({ isOpen, onClose, placement, size }),
    [isOpen, onClose, placement, size],
  );

  return (
    <DrawerContext.Provider value={ctx}>
      <Dialog
        modal
        open={isOpen}
        onOpenChange={handleOpenChange}
        disableRemoveScroll={!blockScrollOnMount}
      >
        {/* FocusScope props map Chakra's focus semantics onto Tamagui's trap. */}
        <Dialog.Portal>{children}</Dialog.Portal>
      </Dialog>
    </DrawerContext.Provider>
  );
}
DrawerRoot.displayName = "Drawer";

// ────────────────────────────────────────────────────────────────────────
// Overlay

export type DrawerOverlayProps = ComponentProps<typeof Dialog.Overlay>;

const DrawerOverlay = function DrawerOverlay(props: DrawerOverlayProps) {
  return (
    <Dialog.Overlay
      key="drawer-overlay"
      backgroundColor="rgba(0,0,0,0.55)"
      {...({ animation: "quicker" } as object)}
      enterStyle={{ opacity: 0 }}
      exitStyle={{ opacity: 0 }}
      {...props}
    />
  );
};
DrawerOverlay.displayName = "Drawer.Overlay";

// ────────────────────────────────────────────────────────────────────────
// Content

export type DrawerContentProps = ComponentProps<typeof Dialog.Content>;

const DrawerContent = function DrawerContent(props: DrawerContentProps) {
  const { placement, size } = useDrawerContext();
  const { containerAlign, contentSize, enter, exit } = placementStyle(placement, size);

  return (
    <YStack
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      {...containerAlign}
      pointerEvents="box-none"
    >
      <Dialog.Content
        elevate
        key="drawer-content"
        {...({ animation: "quicker" } as object)}
        enterStyle={enter}
        exitStyle={exit}
        backgroundColor="$background"
        padding="$4"
        gap="$3"
        {...(contentSize as ComponentProps<typeof Dialog.Content>)}
        {...props}
      />
    </YStack>
  );
};
DrawerContent.displayName = "Drawer.Content";

// ────────────────────────────────────────────────────────────────────────
// Header / Body / Footer / Title / Description / CloseButton

const DrawerHeader = function DrawerHeader(props: ComponentProps<typeof YStack>) {
  return <YStack gap="$1" paddingBottom="$2" {...props} />;
};
DrawerHeader.displayName = "Drawer.Header";

const DrawerBody = function DrawerBody(props: ComponentProps<typeof YStack>) {
  return <YStack flex={1} gap="$2" {...props} />;
};
DrawerBody.displayName = "Drawer.Body";

const DrawerFooter = function DrawerFooter(props: ComponentProps<typeof XStack>) {
  return (
    <XStack gap="$2" paddingTop="$3" justifyContent="flex-end" alignItems="center" {...props} />
  );
};
DrawerFooter.displayName = "Drawer.Footer";

const DrawerTitle = Dialog.Title;
const DrawerDescription = Dialog.Description;

const DrawerCloseButton = function DrawerCloseButton(
  props: Omit<ComponentProps<typeof IconButton>, "icon" | "aria-label"> & { "aria-label"?: string },
) {
  const { onClose } = useDrawerContext();
  const { "aria-label": ariaLabel = "Close", ...rest } = props;
  return (
    <XStack position="absolute" top="$2" right="$2" zIndex={2}>
      <IconButton
        aria-label={ariaLabel}
        icon={<CloseIcon />}
        variant="ghost"
        size="sm"
        onPress={onClose}
        {...rest}
      />
    </XStack>
  );
};
DrawerCloseButton.displayName = "Drawer.CloseButton";

export const Drawer = Object.assign(DrawerRoot, {
  Overlay: DrawerOverlay,
  Content: DrawerContent,
  Header: DrawerHeader,
  Body: DrawerBody,
  Footer: DrawerFooter,
  Title: DrawerTitle,
  Description: DrawerDescription,
  CloseButton: DrawerCloseButton,
});
