import { forwardRef, type HTMLAttributes } from "react";
import listRecipe from "./list.variants.json";
import { composeRecipe } from "../../utils/variants";
import { resolveTag, TagGroup } from "../../utils/tags";

export type ListProps = HTMLAttributes<HTMLElement> & {
  tag?: string;
};

function listTag(tag?: string): string {
  return resolveTag(tag, "ul", TagGroup.List);
}

export const List = forwardRef<HTMLElement, ListProps>(function List(
  { tag, className, children, ...rest },
  ref
) {
  const Tag = listTag(tag) as "ul" | "ol" | "dl" | "menu";
  return (
    <Tag ref={ref as never} className={composeRecipe(listRecipe, {}, className)} {...rest}>
      {children}
    </Tag>
  );
});

export type ListItemProps = HTMLAttributes<HTMLElement> & {
  tag?: string;
  value?: number;
};

export const ListItem = forwardRef<HTMLElement, ListItemProps>(function ListItem(
  { tag, value, className, children, ...rest },
  ref
) {
  const resolved = resolveTag(tag, "li", TagGroup.ListItem);
  const Tag = resolved as "li" | "dt" | "dd";
  const valueAttr =
    value && value > 0 && resolved === "li" ? { value } : {};
  return (
    <Tag
      ref={ref as never}
      className={composeRecipe(listRecipe, {}, className)}
      {...valueAttr}
      {...rest}
    >
      {children}
    </Tag>
  );
});
