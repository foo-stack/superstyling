import { Children, cloneElement, forwardRef, isValidElement, type ReactNode } from "react";
import { XStack, Text as TamaguiText, type XStackProps } from "tamagui";
import { ChevronRightIcon } from "@superstyling/icons";
import { Link, type LinkProps } from "./Link";

/**
 * Breadcrumb — navigation trail. Inserts a separator between each
 * rendered `Breadcrumb.Item`. Matches Chakra's `<Breadcrumb>` compound.
 *
 *   <Breadcrumb>
 *     <Breadcrumb.Item>
 *       <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
 *     </Breadcrumb.Item>
 *     <Breadcrumb.Item>
 *       <Breadcrumb.Link href="/docs">Docs</Breadcrumb.Link>
 *     </Breadcrumb.Item>
 *     <Breadcrumb.Item isCurrentPage>
 *       <Breadcrumb.Link href="#">Breadcrumb</Breadcrumb.Link>
 *     </Breadcrumb.Item>
 *   </Breadcrumb>
 */

export interface BreadcrumbProps extends Omit<XStackProps, "separator"> {
  /** Character, string, or node rendered between items. Default `/`. */
  separator?: ReactNode;
  /** Gap around each separator. Default `"$2"`. */
  spacing?: XStackProps["gap"];
  children?: ReactNode;
}

const BreadcrumbRoot = forwardRef<unknown, BreadcrumbProps>(function Breadcrumb(props, ref) {
  const { separator = "/", spacing = "$2", children, ...rest } = props;
  const items = Children.toArray(children).filter(isValidElement);
  const last = items.length - 1;

  return (
    <XStack
      ref={ref as never}
      role="navigation"
      aria-label="Breadcrumb"
      alignItems="center"
      gap={spacing}
      {...rest}
    >
      {items.map((child, i) => (
        <XStack key={i} alignItems="center" gap={spacing}>
          {child}
          {i < last ? (
            typeof separator === "string" || typeof separator === "number" ? (
              <TamaguiText color="$color10" fontSize={14}>
                {separator}
              </TamaguiText>
            ) : (
              separator
            )
          ) : null}
        </XStack>
      ))}
    </XStack>
  );
});
BreadcrumbRoot.displayName = "Breadcrumb";

// ────────────────────────────────────────────────────────────────────────
// Item

export interface BreadcrumbItemProps extends Omit<XStackProps, "children"> {
  /** Mark the current page. The nested Link gets aria-current="page" and muted styling. */
  isCurrentPage?: boolean;
  children?: ReactNode;
}

const BreadcrumbItem = forwardRef<unknown, BreadcrumbItemProps>(
  function BreadcrumbItem(props, ref) {
    const { isCurrentPage, children, ...rest } = props;
    // Inject aria-current into a child BreadcrumbLink if present.
    const annotated = Children.map(children, (child) => {
      if (!isValidElement(child)) return child;
      if ((child.type as { displayName?: string })?.displayName === "Breadcrumb.Link") {
        const existing = child.props as Record<string, unknown>;
        return cloneElement(
          child as never,
          {
            ...existing,
            "aria-current": isCurrentPage ? "page" : undefined,
            color: isCurrentPage ? "$color10" : (existing.color ?? "$primary"),
          } as never,
        );
      }
      return child;
    });
    return (
      <XStack ref={ref as never} alignItems="center" {...rest}>
        {annotated}
      </XStack>
    );
  },
);
BreadcrumbItem.displayName = "Breadcrumb.Item";

// ────────────────────────────────────────────────────────────────────────
// Link

const BreadcrumbLink = forwardRef<unknown, LinkProps>(function BreadcrumbLink(props, ref) {
  return <Link ref={ref as never} {...props} />;
});
BreadcrumbLink.displayName = "Breadcrumb.Link";

// ────────────────────────────────────────────────────────────────────────
// Separator — optional standalone slot for consumers who want to position
// the separator manually instead of the auto-insertion default.

const BreadcrumbSeparator = forwardRef<unknown, { children?: ReactNode }>(
  function BreadcrumbSeparator(props, ref) {
    return (
      <XStack ref={ref as never} alignItems="center">
        {props.children ?? (
          <TamaguiText color="$color10" fontSize={14}>
            /
          </TamaguiText>
        )}
      </XStack>
    );
  },
);
BreadcrumbSeparator.displayName = "Breadcrumb.Separator";

export const Breadcrumb = Object.assign(BreadcrumbRoot, {
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  Separator: BreadcrumbSeparator,
});

// Re-export the default chevron as a convenient alternative separator.
export { ChevronRightIcon as BreadcrumbChevron };
