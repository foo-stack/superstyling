import { forwardRef, type ComponentProps, type ReactNode } from "react";
import { Text as TamaguiText, XStack, YStack, type XStackProps, type YStackProps } from "tamagui";

/**
 * Table — tabular data with platform-appropriate rendering.
 *
 * **Web:** real `<table>` / `<thead>` / `<tbody>` / `<tr>` / `<th>` / `<td>`
 * semantics via Tamagui's `tag` prop on YStack/XStack. Preserves grid
 * accessibility (row/columnheader announcements, caption, scope).
 *
 * **Native:** same compound API but renders as disciplined flex boxes
 * (YStack rows over XStack cells). For long lists prefer wrapping the
 * rendered rows in a `FlatList` directly — `TableContainer` adds
 * horizontal scroll; vertical virtualization is the caller's choice
 * to keep this wrapper thin.
 *
 *   <TableContainer>
 *     <Table>
 *       <Table.Caption>Users</Table.Caption>
 *       <Table.Thead>
 *         <Table.Tr>
 *           <Table.Th>Name</Table.Th>
 *           <Table.Th>Email</Table.Th>
 *         </Table.Tr>
 *       </Table.Thead>
 *       <Table.Tbody>
 *         {users.map((u) => (
 *           <Table.Tr key={u.id}>
 *             <Table.Td>{u.name}</Table.Td>
 *             <Table.Td>{u.email}</Table.Td>
 *           </Table.Tr>
 *         ))}
 *       </Table.Tbody>
 *     </Table>
 *   </TableContainer>
 */

export type TableVariant = "simple" | "striped" | "unstyled";
export type TableSize = "sm" | "md" | "lg";

// ────────────────────────────────────────────────────────────────────────
// Root

export interface TableProps extends Omit<YStackProps, "size"> {
  variant?: TableVariant;
  size?: TableSize;
  children?: ReactNode;
}

const TableRoot = forwardRef<unknown, TableProps>(function Table(props, ref) {
  const { variant = "simple", size = "md", ...rest } = props;
  return (
    <YStack
      ref={ref as never}
      {...({ tag: "table", "data-table-variant": variant, "data-table-size": size } as object)}
      width="100%"
      {...rest}
    />
  );
});
TableRoot.displayName = "Table";

// ────────────────────────────────────────────────────────────────────────
// Thead / Tbody / Tfoot

const Thead = forwardRef<unknown, YStackProps>(function Thead(props, ref) {
  return (
    <YStack
      ref={ref as never}
      {...({ tag: "thead" } as object)}
      borderBottomWidth={2}
      borderBottomColor="$borderColor"
      {...props}
    />
  );
});
Thead.displayName = "Table.Thead";

const Tbody = forwardRef<unknown, YStackProps>(function Tbody(props, ref) {
  return <YStack ref={ref as never} {...({ tag: "tbody" } as object)} {...props} />;
});
Tbody.displayName = "Table.Tbody";

const Tfoot = forwardRef<unknown, YStackProps>(function Tfoot(props, ref) {
  return (
    <YStack
      ref={ref as never}
      {...({ tag: "tfoot" } as object)}
      borderTopWidth={2}
      borderTopColor="$borderColor"
      {...props}
    />
  );
});
Tfoot.displayName = "Table.Tfoot";

// ────────────────────────────────────────────────────────────────────────
// Tr (row) — flex row of cells

const Tr = forwardRef<unknown, XStackProps>(function Tr(props, ref) {
  return (
    <XStack
      ref={ref as never}
      {...({ tag: "tr" } as object)}
      borderBottomWidth={1}
      borderBottomColor="$borderColor"
      alignItems="stretch"
      {...props}
    />
  );
});
Tr.displayName = "Table.Tr";

// ────────────────────────────────────────────────────────────────────────
// Th / Td

const SIZE_PADDING: Record<TableSize, number> = { sm: 8, md: 12, lg: 16 };

export interface CellProps extends Omit<YStackProps, "size"> {
  size?: TableSize;
  /** Horizontal alignment of the cell text. Chakra parity. */
  isNumeric?: boolean;
  children?: ReactNode;
}

const Th = forwardRef<unknown, CellProps>(function Th(props, ref) {
  const { size = "md", isNumeric, children, ...rest } = props;
  const pad = SIZE_PADDING[size];
  return (
    <YStack
      ref={ref as never}
      {...({ tag: "th", scope: "col" } as object)}
      flex={1}
      paddingHorizontal={pad}
      paddingVertical={pad}
      alignItems={isNumeric ? "flex-end" : "flex-start"}
      {...rest}
    >
      <TamaguiText
        fontSize={12}
        fontWeight="700"
        color="$color10"
        textTransform="uppercase"
        letterSpacing={0.5}
      >
        {children}
      </TamaguiText>
    </YStack>
  );
});
Th.displayName = "Table.Th";

const Td = forwardRef<unknown, CellProps>(function Td(props, ref) {
  const { size = "md", isNumeric, children, ...rest } = props;
  const pad = SIZE_PADDING[size];
  return (
    <YStack
      ref={ref as never}
      {...({ tag: "td" } as object)}
      flex={1}
      paddingHorizontal={pad}
      paddingVertical={pad}
      alignItems={isNumeric ? "flex-end" : "flex-start"}
      justifyContent="center"
      {...rest}
    >
      {typeof children === "string" || typeof children === "number" ? (
        <TamaguiText fontSize={14} color="$color">
          {children}
        </TamaguiText>
      ) : (
        children
      )}
    </YStack>
  );
});
Td.displayName = "Table.Td";

// ────────────────────────────────────────────────────────────────────────
// Caption

const Caption = forwardRef<unknown, ComponentProps<typeof TamaguiText>>(
  function Caption(props, ref) {
    return (
      <TamaguiText
        ref={ref as never}
        {...({ tag: "caption" } as object)}
        paddingVertical="$2"
        fontSize={13}
        color="$color10"
        {...props}
      />
    );
  },
);
Caption.displayName = "Table.Caption";

// ────────────────────────────────────────────────────────────────────────

export const Table = Object.assign(TableRoot, {
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  Caption,
});

/**
 * TableContainer — horizontal-scroll wrapper. Needed on web for tables
 * wider than the viewport; on native, a `ScrollView horizontal` works
 * equivalently.
 */
export const TableContainer = forwardRef<unknown, YStackProps>(function TableContainer(props, ref) {
  return (
    <YStack
      ref={ref as never}
      {...({ overflowX: "auto" } as object)}
      borderWidth={1}
      borderColor="$borderColor"
      borderRadius={8}
      {...props}
    />
  );
});
TableContainer.displayName = "TableContainer";
