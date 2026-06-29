import { forwardRef, type HTMLAttributes, type ThHTMLAttributes, type TdHTMLAttributes } from "react";
import tableRecipe from "./table.variants.json";
import { composeRecipe } from "../../utils";

export type TableProps = HTMLAttributes<HTMLTableElement>;
export type TableCaptionProps = HTMLAttributes<HTMLTableCaptionElement>;
export type TableSectionProps = HTMLAttributes<HTMLTableSectionElement>;
export type TableRowProps = HTMLAttributes<HTMLTableRowElement>;

export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement> & {
  scope?: string;
  colSpan?: number;
  rowSpan?: number;
  headers?: string;
  abbr?: string;
};

export type TableHeadCellProps = ThHTMLAttributes<HTMLTableCellElement> & {
  scope?: string;
  colSpan?: number;
  rowSpan?: number;
  headers?: string;
  abbr?: string;
};

export type TableColGroupProps = HTMLAttributes<HTMLTableColElement> & {
  span?: number;
};

export type TableColProps = HTMLAttributes<HTMLTableColElement> & {
  span?: number;
};

function tableScope(scope?: string): string | undefined {
  const s = (scope ?? "").trim().toLowerCase();
  if (s === "col" || s === "colgroup" || s === "row" || s === "rowgroup") return s;
  return undefined;
}

function tableCellAttrs(
  scope?: string,
  colSpan?: number,
  rowSpan?: number,
  headers?: string,
  abbr?: string,
  heading?: boolean
): Record<string, string | number> {
  const attrs: Record<string, string | number> = {};
  if (heading) {
    const sc = tableScope(scope);
    if (sc) attrs.scope = sc;
    if (abbr?.trim()) attrs.abbr = abbr.trim();
  }
  if (colSpan && colSpan > 0) attrs.colSpan = colSpan;
  if (rowSpan && rowSpan > 0) attrs.rowSpan = rowSpan;
  if (headers?.trim()) attrs.headers = headers.trim();
  return attrs;
}

function spanAttrs(span?: number): Record<string, string> {
  if (!span || span <= 0) return {};
  return { span: String(span) };
}

export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { className, children, ...rest },
  ref
) {
  return (
    <table ref={ref} className={composeRecipe(tableRecipe, {}, className)} {...rest}>
      {children}
    </table>
  );
});
Table.displayName = "Table";

export const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  function TableCaption({ className, children, ...rest }, ref) {
    return (
      <caption ref={ref} className={className} {...rest}>
        {children}
      </caption>
    );
  }
);
TableCaption.displayName = "TableCaption";

export const TableHead = forwardRef<HTMLTableSectionElement, TableSectionProps>(
  function TableHead({ className, children, ...rest }, ref) {
    return (
      <thead ref={ref} className={className} {...rest}>
        {children}
      </thead>
    );
  }
);
TableHead.displayName = "TableHead";

export const TableBody = forwardRef<HTMLTableSectionElement, TableSectionProps>(
  function TableBody({ className, children, ...rest }, ref) {
    return (
      <tbody ref={ref} className={className} {...rest}>
        {children}
      </tbody>
    );
  }
);
TableBody.displayName = "TableBody";

export const TableFoot = forwardRef<HTMLTableSectionElement, TableSectionProps>(
  function TableFoot({ className, children, ...rest }, ref) {
    return (
      <tfoot ref={ref} className={className} {...rest}>
        {children}
      </tfoot>
    );
  }
);
TableFoot.displayName = "TableFoot";

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { className, children, ...rest },
  ref
) {
  return (
    <tr ref={ref} className={className} {...rest}>
      {children}
    </tr>
  );
});
TableRow.displayName = "TableRow";

export const TableHeadCell = forwardRef<HTMLTableCellElement, TableHeadCellProps>(
  function TableHeadCell(
    { className, scope, colSpan, rowSpan, headers, abbr, children, ...rest },
    ref
  ) {
    return (
      <th
        ref={ref}
        className={className}
        {...tableCellAttrs(scope, colSpan, rowSpan, headers, abbr, true)}
        {...rest}
      >
        {children}
      </th>
    );
  }
);
TableHeadCell.displayName = "TableHeadCell";

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { className, scope, colSpan, rowSpan, headers, abbr, children, ...rest },
  ref
) {
  return (
    <td
      ref={ref}
      className={className}
      {...tableCellAttrs(scope, colSpan, rowSpan, headers, abbr, false)}
      {...rest}
    >
      {children}
    </td>
  );
});
TableCell.displayName = "TableCell";

export const TableColGroup = forwardRef<HTMLTableColElement, TableColGroupProps>(
  function TableColGroup({ className, span, children, ...rest }, ref) {
    return (
      <colgroup ref={ref} className={className} {...spanAttrs(span)} {...rest}>
        {children}
      </colgroup>
    );
  }
);
TableColGroup.displayName = "TableColGroup";

export const TableCol = forwardRef<HTMLTableColElement, TableColProps>(function TableCol(
  { className, span, ...rest },
  ref
) {
  return <col ref={ref} className={className} {...spanAttrs(span)} {...rest} />;
});
TableCol.displayName = "TableCol";
