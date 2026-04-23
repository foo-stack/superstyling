import { type ComponentProps, type ReactNode } from "react";
import { Popover as TamaguiPopover } from "@tamagui/popover";
import { XStack, YStack } from "tamagui";
import { CloseIcon } from "@superstyling/icons";
import { IconButton } from "./IconButton";

/**
 * Popover — floating panel anchored to a trigger. Matches Chakra's
 * `<Popover>` compound. Built on `@tamagui/popover`; portals, handles
 * outside-click dismiss, keyboard (Escape) close, and placement flipping.
 *
 *   <Popover>
 *     <Popover.Trigger>
 *       <Button>Open</Button>
 *     </Popover.Trigger>
 *     <Popover.Content>
 *       <Popover.Arrow />
 *       <Popover.Header>Title</Popover.Header>
 *       <Popover.Body>Body</Popover.Body>
 *       <Popover.Footer>Footer</Popover.Footer>
 *       <Popover.CloseButton />
 *     </Popover.Content>
 *   </Popover>
 *
 * Uncontrolled by default. Pass `isOpen` + `onClose` for controlled use.
 */

export type PopoverPlacement =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "top-start"
  | "top-end"
  | "right-start"
  | "right-end"
  | "bottom-start"
  | "bottom-end"
  | "left-start"
  | "left-end";

export interface PopoverProps {
  children?: ReactNode;
  /** Anchor side relative to the trigger. Default `"bottom"`. */
  placement?: PopoverPlacement;
  /** Controlled open state. */
  isOpen?: boolean;
  /** Called when open state changes (controlled + uncontrolled). */
  onClose?: () => void;
  /** Dismiss on clicks outside the content. Default `true`. */
  closeOnBlur?: boolean;
  /** Dismiss on Escape. Default `true`. */
  closeOnEsc?: boolean;
  /** Initial open state when uncontrolled. */
  defaultIsOpen?: boolean;
}

function PopoverRoot({
  children,
  placement = "bottom",
  isOpen,
  onClose,
  defaultIsOpen,
}: PopoverProps) {
  // closeOnBlur / closeOnEsc from Chakra's API are supported by default in
  // Tamagui's Popover; explicitly disabling them isn't wired yet — callers
  // can hold `isOpen` controlled and ignore Tamagui's signal if they need
  // to resist dismiss. Tracked for a v0.3 follow-up if real use cases surface.
  return (
    <TamaguiPopover
      placement={placement as never}
      open={isOpen}
      defaultOpen={defaultIsOpen}
      onOpenChange={(next: boolean) => {
        if (!next) onClose?.();
      }}
      allowFlip
      // Tamagui `Popover` already handles outside-click + esc dismiss; no
      // flag needed to disable — callers set isOpen manually if they want
      // to resist dismiss.
    >
      {children}
    </TamaguiPopover>
  );
}
PopoverRoot.displayName = "Popover";

const PopoverTrigger = TamaguiPopover.Trigger;
const PopoverAnchor = TamaguiPopover.Anchor;

const PopoverContent = function PopoverContent(
  props: ComponentProps<typeof TamaguiPopover.Content>,
) {
  return (
    <TamaguiPopover.Content
      {...({ animation: "quicker" } as object)}
      enterStyle={{ y: -4, opacity: 0, scale: 0.98 }}
      exitStyle={{ y: -4, opacity: 0, scale: 0.98 }}
      y={0}
      opacity={1}
      scale={1}
      backgroundColor="$background"
      borderWidth={1}
      borderColor="$borderColor"
      borderRadius={8}
      padding="$3"
      elevate
      {...props}
    />
  );
};
PopoverContent.displayName = "Popover.Content";

const PopoverArrow = function PopoverArrow(props: ComponentProps<typeof TamaguiPopover.Arrow>) {
  return (
    <TamaguiPopover.Arrow
      borderWidth={1}
      borderColor="$borderColor"
      backgroundColor="$background"
      {...props}
    />
  );
};
PopoverArrow.displayName = "Popover.Arrow";

const PopoverHeader = function PopoverHeader(props: ComponentProps<typeof YStack>) {
  return (
    <YStack paddingBottom="$2" borderBottomWidth={1} borderBottomColor="$borderColor" {...props} />
  );
};
PopoverHeader.displayName = "Popover.Header";

const PopoverBody = function PopoverBody(props: ComponentProps<typeof YStack>) {
  return <YStack paddingVertical="$2" {...props} />;
};
PopoverBody.displayName = "Popover.Body";

const PopoverFooter = function PopoverFooter(props: ComponentProps<typeof XStack>) {
  return (
    <XStack
      gap="$2"
      paddingTop="$2"
      borderTopWidth={1}
      borderTopColor="$borderColor"
      justifyContent="flex-end"
      {...props}
    />
  );
};
PopoverFooter.displayName = "Popover.Footer";

const PopoverCloseButton = function PopoverCloseButton(
  props: Omit<ComponentProps<typeof IconButton>, "icon" | "aria-label"> & {
    "aria-label"?: string;
  },
) {
  const { "aria-label": ariaLabel = "Close", ...rest } = props;
  return (
    <TamaguiPopover.Close asChild>
      <IconButton aria-label={ariaLabel} icon={<CloseIcon />} variant="ghost" size="sm" {...rest} />
    </TamaguiPopover.Close>
  );
};
PopoverCloseButton.displayName = "Popover.CloseButton";

export const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Anchor: PopoverAnchor,
  Content: PopoverContent,
  Arrow: PopoverArrow,
  Header: PopoverHeader,
  Body: PopoverBody,
  Footer: PopoverFooter,
  CloseButton: PopoverCloseButton,
});
