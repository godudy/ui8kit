import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import gridRecipe from "./grid.variants.json";
import { composeRecipe, cn } from "../../utils";
import { Slot } from "../slot/slot";

export type GridProps = Omit<HTMLAttributes<HTMLDivElement>, "className"> & {
  cols?: string;
  className?: string;
  children?: ReactNode;
  asChild?: boolean;
};

const GRID_COLS_CLASS: Record<string, string> = {
  "1": "grid-cols-1",
  "2": "grid-cols-2",
  "3": "grid-cols-3",
  "4": "grid-cols-4",
  "5": "grid-cols-5",
  "6": "grid-cols-6",
  "7": "grid-cols-7",
  "8": "grid-cols-8",
  "9": "grid-cols-9",
  "10": "grid-cols-10",
  "11": "grid-cols-11",
  "12": "grid-cols-12",
  "1-2": "grid-cols-1 md:grid-cols-2",
  "1-3": "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
  "1-4": "grid-cols-1 md:grid-cols-2 xl:grid-cols-4",
};

function gridColsClass(cols?: string, className?: string): string {
  if (className?.includes("grid-cols-")) return "";
  const c = (cols ?? "1").trim() || "1";
  return GRID_COLS_CLASS[c] ?? "";
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  { cols, className, children, asChild, ...rest },
  ref
) {
  const cls = composeRecipe(gridRecipe, {}, gridColsClass(cols, className), className);
  if (asChild) {
    return (
      <Slot ref={ref} className={cls} {...rest}>
        {children}
      </Slot>
    );
  }
  return (
    <div
      ref={ref}
      className={cls}
      {...rest}
    >
      {children}
    </div>
  );
});
Grid.displayName = "Grid";

export type GridColProps = HTMLAttributes<HTMLDivElement> & {
  span?: number;
  start?: number;
  end?: number;
  order?: number;
};

const GRID_COL_SPAN_CLASS: Record<number, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
};

const GRID_COL_START_CLASS: Record<number, string> = {
  1: "col-start-1",
  2: "col-start-2",
  3: "col-start-3",
  4: "col-start-4",
  5: "col-start-5",
  6: "col-start-6",
  7: "col-start-7",
  8: "col-start-8",
  9: "col-start-9",
  10: "col-start-10",
  11: "col-start-11",
  12: "col-start-12",
};

const GRID_COL_END_CLASS: Record<number, string> = {
  1: "col-end-1",
  2: "col-end-2",
  3: "col-end-3",
  4: "col-end-4",
  5: "col-end-5",
  6: "col-end-6",
  7: "col-end-7",
  8: "col-end-8",
  9: "col-end-9",
  10: "col-end-10",
  11: "col-end-11",
  12: "col-end-12",
};

const GRID_ORDER_CLASS: Record<number, string> = {
  1: "order-1",
  2: "order-2",
  3: "order-3",
  4: "order-4",
  5: "order-5",
  6: "order-6",
  7: "order-7",
  8: "order-8",
  9: "order-9",
  10: "order-10",
  11: "order-11",
  12: "order-12",
};

function gridToken(map: Record<number, string>, value?: number): string {
  if (!value || value <= 0) return "";
  return map[value] ?? "";
}

function gridColClass(span?: number, start?: number, end?: number, order?: number): string {
  return cn(
    gridToken(GRID_COL_SPAN_CLASS, span),
    gridToken(GRID_COL_START_CLASS, start),
    gridToken(GRID_COL_END_CLASS, end),
    gridToken(GRID_ORDER_CLASS, order)
  );
}

export const GridCol = forwardRef<HTMLDivElement, GridColProps>(function GridCol(
  { span, start, end, order, className, children, ...rest },
  ref
) {
  return (
    <div ref={ref} className={cn(gridColClass(span, start, end, order), className)} {...rest}>
      {children}
    </div>
  );
});
GridCol.displayName = "GridCol";
