import { forwardRef } from "react";
import { Grid, type GridProps, type GridElement } from "./Grid";

/**
 * SimpleGrid — N-equal-column grid with automatic template generation.
 * Pass `columns` for a fixed column count, or `minChildWidth` for
 * responsive auto-fill that wraps when children don't fit.
 *
 * Matches Chakra's `<SimpleGrid columns={3} spacing={4}>` API.
 */
export type SimpleGridProps = Omit<GridProps, "templateColumns"> & {
  /** Fixed number of columns. Takes precedence over minChildWidth. */
  columns?: number;
  /** Responsive auto-fill width (e.g., 200, "12rem"). Mutually exclusive with columns. */
  minChildWidth?: number | string;
  /** Alias for gap (Chakra parity). */
  spacing?: GridProps["gap"];
  /** Alias for rowGap. */
  spacingY?: GridProps["rowGap"];
  /** Alias for columnGap. */
  spacingX?: GridProps["columnGap"];
};

function formatLength(v: number | string): string {
  return typeof v === "number" ? `${v}px` : v;
}

export const SimpleGrid = forwardRef<GridElement, SimpleGridProps>(function SimpleGrid(props, ref) {
  const { columns, minChildWidth, spacing, spacingY, spacingX, gap, rowGap, columnGap, ...rest } =
    props;

  let templateColumns: string | undefined;
  if (columns !== undefined) {
    templateColumns = `repeat(${columns}, minmax(0, 1fr))`;
  } else if (minChildWidth !== undefined) {
    templateColumns = `repeat(auto-fit, minmax(${formatLength(minChildWidth)}, 1fr))`;
  }

  return (
    <Grid
      ref={ref as never}
      templateColumns={templateColumns}
      gap={gap ?? spacing}
      rowGap={rowGap ?? spacingY}
      columnGap={columnGap ?? spacingX}
      {...rest}
    />
  );
});
SimpleGrid.displayName = "SimpleGrid";
