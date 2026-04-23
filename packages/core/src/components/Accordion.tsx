import { type ComponentProps, type ReactNode } from "react";
import { Accordion as TamaguiAccordion } from "@tamagui/accordion";
import { ChevronDownIcon } from "@superstyling/icons";
import { XStack, YStack } from "tamagui";

/**
 * Accordion — collapsible content sections. Built on @tamagui/accordion
 * which provides keyboard navigation (↑/↓/Home/End) and ARIA
 * disclosure semantics.
 *
 *   <Accordion allowMultiple defaultValue={["q1"]}>
 *     <Accordion.Item value="q1">
 *       <Accordion.Button>
 *         <Text>Question 1</Text>
 *         <Accordion.Icon />
 *       </Accordion.Button>
 *       <Accordion.Panel>
 *         <Text>Answer 1</Text>
 *       </Accordion.Panel>
 *     </Accordion.Item>
 *   </Accordion>
 */

export interface AccordionProps {
  /** Allow multiple panels open simultaneously. Default false. */
  allowMultiple?: boolean;
  /** Allow the user to close all panels. Default true when single, always true when multiple. */
  allowToggle?: boolean;
  /** Controlled open item(s). Array when allowMultiple. */
  value?: string | string[];
  /** Uncontrolled initial. */
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
  children?: ReactNode;
}

function AccordionRoot({
  allowMultiple = false,
  allowToggle = true,
  value,
  defaultValue,
  onChange,
  children,
}: AccordionProps) {
  // Tamagui's Accordion exposes `type: "single" | "multiple"` + different
  // prop shapes per mode. We branch here for a clean single API.
  if (allowMultiple) {
    return (
      <TamaguiAccordion
        type="multiple"
        value={Array.isArray(value) ? value : value ? [value] : undefined}
        defaultValue={
          Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : undefined
        }
        onValueChange={onChange as never}
      >
        {children}
      </TamaguiAccordion>
    );
  }
  return (
    <TamaguiAccordion
      type="single"
      collapsible={allowToggle}
      value={typeof value === "string" ? value : undefined}
      defaultValue={typeof defaultValue === "string" ? defaultValue : undefined}
      onValueChange={onChange as never}
    >
      {children}
    </TamaguiAccordion>
  );
}
AccordionRoot.displayName = "Accordion";

// ────────────────────────────────────────────────────────────────────────
// Item

export interface AccordionItemProps extends ComponentProps<typeof TamaguiAccordion.Item> {
  value: string;
  children?: ReactNode;
}

const AccordionItem = function AccordionItem(props: AccordionItemProps) {
  return (
    <TamaguiAccordion.Item borderBottomWidth={1} borderBottomColor="$borderColor" {...props} />
  );
};
AccordionItem.displayName = "Accordion.Item";

// ────────────────────────────────────────────────────────────────────────
// Button (the header trigger)

const AccordionButton = function AccordionButton(
  props: ComponentProps<typeof TamaguiAccordion.Trigger>,
) {
  return (
    <TamaguiAccordion.Header>
      <TamaguiAccordion.Trigger
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        paddingVertical="$3"
        paddingHorizontal="$2"
        backgroundColor="transparent"
        borderWidth={0}
        hoverStyle={{ backgroundColor: "$backgroundHover" }}
        {...props}
      />
    </TamaguiAccordion.Header>
  );
};
AccordionButton.displayName = "Accordion.Button";

// ────────────────────────────────────────────────────────────────────────
// Icon (chevron that rotates on open)

const AccordionIcon = function AccordionIcon() {
  // Tamagui exposes open state as `$state-open` conditional prop on
  // Accordion.Trigger, which lets us rotate the chevron — but we render
  // the Icon as a peer inside the Button. For a simpler baseline we just
  // show a static ChevronDownIcon here; callers who want animated rotation
  // can swap for a custom icon with conditional rotate.
  return (
    <XStack alignItems="center">
      <ChevronDownIcon size={16} />
    </XStack>
  );
};
AccordionIcon.displayName = "Accordion.Icon";

// ────────────────────────────────────────────────────────────────────────
// Panel (the collapsible body)

const AccordionPanel = function AccordionPanel(
  props: ComponentProps<typeof TamaguiAccordion.Content>,
) {
  return <TamaguiAccordion.Content paddingHorizontal="$2" paddingBottom="$3" {...props} />;
};
AccordionPanel.displayName = "Accordion.Panel";

// ────────────────────────────────────────────────────────────────────────

export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Button: AccordionButton,
  Icon: AccordionIcon,
  Panel: AccordionPanel,
});

void YStack;
