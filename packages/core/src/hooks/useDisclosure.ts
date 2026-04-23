import { useCallback, useId, useMemo, useState } from "react";

/**
 * useDisclosure — boolean open/close state with Chakra-compatible shape.
 * Useful for modals, drawers, menus, popovers.
 *
 *   const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
 */

export interface UseDisclosureProps {
  isOpen?: boolean;
  defaultIsOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  id?: string;
}

export interface UseDisclosureReturn {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  /** Stable id for the disclosure (useful for aria-controls). */
  id: string;
  /** Aria helpers for the trigger button. */
  getButtonProps: () => {
    "aria-expanded": boolean;
    "aria-controls": string;
    onPress: () => void;
  };
  /** Aria helpers for the disclosure panel. */
  getDisclosureProps: () => { id: string; hidden: boolean };
}

export function useDisclosure(props: UseDisclosureProps = {}): UseDisclosureReturn {
  const {
    isOpen: controlled,
    defaultIsOpen = false,
    onOpen: onOpenProp,
    onClose: onCloseProp,
  } = props;
  const autoId = useId();
  const id = props.id ?? autoId;

  const [local, setLocal] = useState(defaultIsOpen);
  const isControlled = controlled !== undefined;
  const isOpen = isControlled ? (controlled as boolean) : local;

  const onOpen = useCallback(() => {
    if (!isControlled) setLocal(true);
    onOpenProp?.();
  }, [isControlled, onOpenProp]);

  const onClose = useCallback(() => {
    if (!isControlled) setLocal(false);
    onCloseProp?.();
  }, [isControlled, onCloseProp]);

  const onToggle = useCallback(() => {
    if (isOpen) onClose();
    else onOpen();
  }, [isOpen, onOpen, onClose]);

  const getButtonProps = useCallback(
    () => ({
      "aria-expanded": isOpen,
      "aria-controls": id,
      onPress: onToggle,
    }),
    [isOpen, id, onToggle],
  );

  const getDisclosureProps = useCallback(() => ({ id, hidden: !isOpen }), [id, isOpen]);

  return useMemo(
    () => ({ isOpen, onOpen, onClose, onToggle, id, getButtonProps, getDisclosureProps }),
    [isOpen, onOpen, onClose, onToggle, id, getButtonProps, getDisclosureProps],
  );
}
