import { useEffect, useRef, type Ref } from "react";
import { Modal, type ModalProps } from "./Modal";

/**
 * AlertDialog — confirmation-style dialog. Identical to Modal but with
 * `role="alertdialog"` for screen readers + a `leastDestructiveRef` that
 * receives initial focus (Chakra's pattern: focus on the safest action,
 * not the destructive one).
 *
 * Example — destructive confirm with Cancel taking initial focus:
 *
 *   const cancelRef = useRef(null);
 *   <AlertDialog isOpen onClose leastDestructiveRef={cancelRef}>
 *     <AlertDialog.Overlay />
 *     <AlertDialog.Content>
 *       <AlertDialog.Header>Delete item?</AlertDialog.Header>
 *       <AlertDialog.CloseButton />
 *       <AlertDialog.Body>This cannot be undone.</AlertDialog.Body>
 *       <AlertDialog.Footer>
 *         <Button ref={cancelRef} onPress={onClose}>Cancel</Button>
 *         <Button colorScheme="red" onPress={onDelete}>Delete</Button>
 *       </AlertDialog.Footer>
 *     </AlertDialog.Content>
 *   </AlertDialog>
 */

export interface AlertDialogProps extends Omit<ModalProps, "role" | "initialFocusRef"> {
  /**
   * Ref for the non-destructive action (usually "Cancel"). Receives initial
   * focus. Mutually exclusive with Modal's `initialFocusRef`.
   */
  leastDestructiveRef?: Ref<unknown>;
}

function AlertDialogRoot(props: AlertDialogProps) {
  const { leastDestructiveRef, ...rest } = props;
  return <Modal role="alertdialog" initialFocusRef={leastDestructiveRef} {...rest} />;
}
AlertDialogRoot.displayName = "AlertDialog";

// Broad compound type — Modal's inner subcomponent types aren't exported
// individually, so a precise typing would trip TS4023 when this module
// is re-exported. Runtime behavior is identical to Modal.
// oxlint-disable-next-line @typescript-eslint/no-explicit-any
export const AlertDialog: typeof AlertDialogRoot & Record<string, any> = Object.assign(
  AlertDialogRoot,
  {
    Overlay: Modal.Overlay,
    Content: Modal.Content,
    Header: Modal.Header,
    Body: Modal.Body,
    Footer: Modal.Footer,
    Title: Modal.Title,
    Description: Modal.Description,
    CloseButton: Modal.CloseButton,
  },
);

// Keep imports tidy when TS pre-checks
void useEffect;
void useRef;
