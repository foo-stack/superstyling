import { forwardRef, type ElementRef, type ReactNode } from "react";
import { XStack, Text as TamaguiText, type XStackProps } from "tamagui";
import { useTranslatedProps, type PseudoPropsMixin, type SxPropMixin } from "./common";
import { CloseIcon } from "@superstyling/icons";

/**
 * Tag — small labeled pill. Three variants × three sizes × colorScheme.
 * Dot-namespaced with subcomponents: `Tag.Label`, `Tag.CloseButton`,
 * `Tag.LeftIcon`, `Tag.RightIcon`. Matches Chakra's `<Tag>`.
 */

export type TagVariant = "subtle" | "solid" | "outline";
export type TagSize = "sm" | "md" | "lg";

const SIZE_TOKENS = {
  sm: { fontSize: 12, height: 20, paddingHorizontal: 6, gap: 4 },
  md: { fontSize: 14, height: 24, paddingHorizontal: 8, gap: 6 },
  lg: { fontSize: 16, height: 28, paddingHorizontal: 12, gap: 8 },
} as const;

export type TagProps = Omit<XStackProps, "size"> &
  PseudoPropsMixin<Partial<XStackProps>> &
  SxPropMixin<Partial<XStackProps> & PseudoPropsMixin<Partial<XStackProps>>> & {
    variant?: TagVariant;
    size?: TagSize;
    colorScheme?: string;
  };

export type TagElement = ElementRef<typeof XStack>;

const TagRoot = forwardRef<TagElement, TagProps>(function Tag(props, ref) {
  const { variant = "subtle", size = "md", colorScheme = "gray", ...rest } = props;
  const translated = useTranslatedProps(rest as Readonly<Record<string, unknown>>);
  const s = SIZE_TOKENS[size];

  const isSolid = variant === "solid";
  const isOutline = variant === "outline";

  return (
    <XStack
      ref={ref as never}
      alignItems="center"
      borderRadius={4}
      height={s.height}
      paddingHorizontal={s.paddingHorizontal}
      gap={s.gap}
      backgroundColor={isOutline ? "transparent" : isSolid ? "$primary" : "$color3"}
      borderWidth={isOutline ? 1 : 0}
      borderColor={isOutline ? "$primary" : undefined}
      {...({ "data-color-scheme": colorScheme } as object)}
      {...(translated as unknown as XStackProps)}
    />
  );
});
TagRoot.displayName = "Tag";

/**
 * Tag.Label — the text slot. Strings/numbers passed as direct children of
 * `<Tag>` also work; use `.Label` when composing with icons or close button
 * so alignment is explicit.
 */
export type TagLabelProps = {
  children?: ReactNode;
  color?: string;
  fontSize?: number;
};

const TagLabel = forwardRef<ElementRef<typeof TamaguiText>, TagLabelProps>(
  function TagLabel(props, ref) {
    return (
      <TamaguiText ref={ref as never} color="$color" fontWeight="500" {...(props as object)} />
    );
  },
);
TagLabel.displayName = "Tag.Label";

/**
 * Tag.CloseButton — small × button, common for dismissible filter tags.
 * Caller wires `onPress` to the remove handler.
 */
export type TagCloseButtonProps = {
  onPress?: () => void;
  "aria-label"?: string;
};

const TagCloseButton = forwardRef<ElementRef<typeof XStack>, TagCloseButtonProps>(
  function TagCloseButton(props, ref) {
    const { onPress, "aria-label": ariaLabel = "Remove" } = props;
    return (
      <XStack
        ref={ref as never}
        // XStack renders as div on web + View on native; we can't use a
        // literal <button> in cross-platform code, so role="button" is the
        // right a11y attachment.
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
        role="button"
        aria-label={ariaLabel}
        alignItems="center"
        justifyContent="center"
        width={16}
        height={16}
        borderRadius={8}
        cursor="pointer"
        onPress={onPress}
        hoverStyle={{ backgroundColor: "$color5" }}
      >
        <CloseIcon size={12} />
      </XStack>
    );
  },
);
TagCloseButton.displayName = "Tag.CloseButton";

/**
 * Tag.LeftIcon / Tag.RightIcon — icon slots. Thin wrappers that enforce
 * sizing consistent with the Tag's size prop. Caller passes an icon as
 * child.
 */
export type TagIconSlotProps = { children?: ReactNode };

const TagLeftIcon = forwardRef<ElementRef<typeof XStack>, TagIconSlotProps>(
  function TagLeftIcon(props, ref) {
    return (
      <XStack ref={ref as never} alignItems="center">
        {props.children}
      </XStack>
    );
  },
);
TagLeftIcon.displayName = "Tag.LeftIcon";

const TagRightIcon = forwardRef<ElementRef<typeof XStack>, TagIconSlotProps>(
  function TagRightIcon(props, ref) {
    return (
      <XStack ref={ref as never} alignItems="center">
        {props.children}
      </XStack>
    );
  },
);
TagRightIcon.displayName = "Tag.RightIcon";

export const Tag = Object.assign(TagRoot, {
  Label: TagLabel,
  CloseButton: TagCloseButton,
  LeftIcon: TagLeftIcon,
  RightIcon: TagRightIcon,
});
