import { forwardRef, type ElementRef, type ReactNode } from "react";
import { XStack, YStack, Text as TamaguiText, type YStackProps } from "tamagui";
import { useTranslatedProps, type PseudoPropsMixin, type SxPropMixin } from "./common";

/**
 * List — vertical list of items. Base component; prefer `OrderedList` or
 * `UnorderedList` for semantic web output. All three render the same on
 * native (no list semantics in RN), but the web path emits `<ul>` / `<ol>`.
 */

export type ListProps = YStackProps &
  PseudoPropsMixin<Partial<YStackProps>> &
  SxPropMixin<Partial<YStackProps> & PseudoPropsMixin<Partial<YStackProps>>> & {
    /** Spacing between items. Alias for gap. */
    spacing?: YStackProps["gap"];
    /** Alias for Chakra's `styleType` — only applied on web. */
    styleType?: "disc" | "circle" | "square" | "decimal" | "none";
    /** Alias for Chakra's `stylePosition`. Web-only. */
    stylePosition?: "inside" | "outside";
  };

export type ListElement = ElementRef<typeof YStack>;

function ListImpl({
  as,
  styleType,
  stylePosition,
  spacing,
  gap,
  ...rest
}: ListProps & { as?: "ul" | "ol" | "div" }) {
  const translated = useTranslatedProps(rest as Readonly<Record<string, unknown>>);
  return (
    <YStack
      {...({ tag: as ?? "ul" } as object)}
      gap={gap ?? spacing ?? "$2"}
      {...({
        listStyleType: styleType,
        listStylePosition: stylePosition,
      } as unknown as YStackProps)}
      {...(translated as unknown as YStackProps)}
    />
  );
}

export const List = forwardRef<ListElement, ListProps>(function List(props, ref) {
  return <ListImpl {...props} as="ul" {...({ ref: ref as never } as object)} />;
});
List.displayName = "List";

/** OrderedList — semantic `<ol>` on web. */
export const OrderedList = forwardRef<ListElement, ListProps>(function OrderedList(props, ref) {
  return <ListImpl styleType="decimal" {...props} as="ol" {...({ ref: ref as never } as object)} />;
});
OrderedList.displayName = "OrderedList";

/** UnorderedList — semantic `<ul>` on web. */
export const UnorderedList = forwardRef<ListElement, ListProps>(function UnorderedList(props, ref) {
  return <ListImpl styleType="disc" {...props} as="ul" {...({ ref: ref as never } as object)} />;
});
UnorderedList.displayName = "UnorderedList";

/** ListItem — row inside a List. Icon + text layout via composition. */
export type ListItemProps = YStackProps &
  PseudoPropsMixin<Partial<YStackProps>> &
  SxPropMixin<Partial<YStackProps> & PseudoPropsMixin<Partial<YStackProps>>>;

export const ListItem = forwardRef<ListElement, ListItemProps>(function ListItem(props, ref) {
  const translated = useTranslatedProps(props as Readonly<Record<string, unknown>>);
  return (
    <YStack
      ref={ref as never}
      {...({ tag: "li" } as object)}
      {...(translated as unknown as YStackProps)}
    />
  );
});
ListItem.displayName = "ListItem";

/**
 * ListIcon — inline icon slot at the start of a list item. Typically used
 * with `styleType="none"` on the parent List to replace bullets with icons.
 * Matches Chakra's `<ListIcon as={IconComponent} />`, but we take children
 * directly (no `as` prop — Chakra API gap documented in migration guide).
 */
export type ListIconProps = { children?: ReactNode };

export function ListIcon(props: ListIconProps) {
  return (
    <XStack alignItems="center" justifyContent="center" marginRight="$2">
      {props.children}
    </XStack>
  );
}
ListIcon.displayName = "ListIcon";

// Text wrapper is re-exported for convenience when authoring lists:
// <ListItem><ListIcon>{<CheckIcon />}</ListIcon> Task complete</ListItem>.
// We keep Text re-export local to maintain clean imports.
export const ListItemText = TamaguiText;
