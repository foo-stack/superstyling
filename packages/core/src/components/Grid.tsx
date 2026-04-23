import { forwardRef, type ElementRef } from "react";
import { YStack, type YStackProps } from "tamagui";
import { useTranslatedProps, type PseudoPropsMixin, type SxPropMixin } from "./common";

/**
 * Grid — CSS grid container. On web, renders with `display: grid`; on
 * native, Tamagui maps grid props to a flexbox-approximation. Chakra's
 * common grid props (`templateColumns`, `templateRows`, `gap`, `rowGap`,
 * `columnGap`) pass through as-is since Tamagui recognizes them.
 *
 * For responsive "N equal columns", reach for SimpleGrid instead.
 */

export type GridProps = YStackProps &
  PseudoPropsMixin<Partial<YStackProps>> &
  SxPropMixin<Partial<YStackProps> & PseudoPropsMixin<Partial<YStackProps>>> & {
    templateColumns?: string;
    templateRows?: string;
    templateAreas?: string;
    autoFlow?: "row" | "column" | "dense" | "row dense" | "column dense";
    autoRows?: string;
    autoColumns?: string;
  };

export type GridElement = ElementRef<typeof YStack>;

export const Grid = forwardRef<GridElement, GridProps>(function Grid(props, ref) {
  const { templateColumns, templateRows, templateAreas, autoFlow, autoRows, autoColumns, ...rest } =
    props;
  const translated = useTranslatedProps(rest as Readonly<Record<string, unknown>>);
  return (
    <YStack
      ref={ref as never}
      {...({
        display: "grid",
        gridTemplateColumns: templateColumns,
        gridTemplateRows: templateRows,
        gridTemplateAreas: templateAreas,
        gridAutoFlow: autoFlow,
        gridAutoRows: autoRows,
        gridAutoColumns: autoColumns,
      } as unknown as YStackProps)}
      {...(translated as unknown as YStackProps)}
    />
  );
});
Grid.displayName = "Grid";

/**
 * GridItem — child placement helper. `colSpan` / `rowSpan` / `colStart` /
 * `rowStart` / `area` mirror CSS grid-item props with Chakra's shorthand
 * names.
 */
export type GridItemProps = YStackProps &
  PseudoPropsMixin<Partial<YStackProps>> &
  SxPropMixin<Partial<YStackProps> & PseudoPropsMixin<Partial<YStackProps>>> & {
    colSpan?: number | "auto";
    rowSpan?: number | "auto";
    colStart?: number | "auto";
    rowStart?: number | "auto";
    colEnd?: number | "auto";
    rowEnd?: number | "auto";
    area?: string;
  };

export const GridItem = forwardRef<GridElement, GridItemProps>(function GridItem(props, ref) {
  const { colSpan, rowSpan, colStart, rowStart, colEnd, rowEnd, area, ...rest } = props;
  const translated = useTranslatedProps(rest as Readonly<Record<string, unknown>>);
  return (
    <YStack
      ref={ref as never}
      {...({
        gridColumn:
          colSpan !== undefined
            ? colSpan === "auto"
              ? "auto"
              : `span ${colSpan} / span ${colSpan}`
            : undefined,
        gridRow:
          rowSpan !== undefined
            ? rowSpan === "auto"
              ? "auto"
              : `span ${rowSpan} / span ${rowSpan}`
            : undefined,
        gridColumnStart: colStart,
        gridRowStart: rowStart,
        gridColumnEnd: colEnd,
        gridRowEnd: rowEnd,
        gridArea: area,
      } as unknown as YStackProps)}
      {...(translated as unknown as YStackProps)}
    />
  );
});
GridItem.displayName = "GridItem";
