import { forwardRef, type HTMLAttributes } from "react";
import gridRecipe from "./grid.variants.json";
import { composeRecipe, cn } from "../../utils";

export type GridProps = HTMLAttributes<HTMLDivElement> & {
  cols?: string;
};

function gridColsClass(cols?: string, className?: string): string {
  if (className?.includes("grid-cols-")) return "";
  const c = (cols ?? "").trim();
  switch (c) {
    case "":
    case "1":
      return "grid-cols-1";
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
    case "10":
    case "11":
    case "12":
      return `grid-cols-${c}`;
    case "1-2":
      return "grid-cols-1 md:grid-cols-2";
    case "1-3":
      return "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";
    case "1-4":
      return "grid-cols-1 md:grid-cols-2 xl:grid-cols-4";
    default:
      return c;
  }
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  { cols, className, children, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      className={composeRecipe(gridRecipe, {}, gridColsClass(cols, className), className)}
      {...rest}
    >
      {children}
    </div>
  );
});

export type GridColProps = HTMLAttributes<HTMLDivElement> & {
  span?: number;
  start?: number;
  end?: number;
  order?: number;
};

function gridColClass(span?: number, start?: number, end?: number, order?: number): string {
  const parts: string[] = [];
  if (span && span > 0) parts.push(`col-span-${span}`);
  if (start && start > 0) parts.push(`col-start-${start}`);
  if (end && end > 0) parts.push(`col-end-${end}`);
  if (order && order > 0) parts.push(`order-${order}`);
  return cn(...parts);
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
