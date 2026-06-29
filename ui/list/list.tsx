import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode, type Ref } from "react";
import listRecipe from "./list.variants.json";
import { composeRecipe } from "../../utils";
import { resolveTag, TagGroup } from "../../utils/tags";

export type ListProps = Omit<HTMLAttributes<HTMLElement>, "className"> & {
  tag?: string;
  className?: string;
  children?: ReactNode;
};

function listTag(tag?: string): string {
  return resolveTag(tag, "ul", TagGroup.List);
}

export const List = forwardRef<HTMLElement, ListProps>(function List(
  { tag, className, children, ...rest },
  ref
) {
  const Tag = listTag(tag) as ElementType;
  return (
    <Tag ref={ref as Ref<HTMLElement>} className={composeRecipe(listRecipe, {}, className)} {...rest}>
      {children}
    </Tag>
  );
});
List.displayName = "List";

export type ListItemProps = Omit<HTMLAttributes<HTMLElement>, "className"> & {
  tag?: string;
  value?: number;
  className?: string;
  children?: ReactNode;
};

export const ListItem = forwardRef<HTMLElement, ListItemProps>(function ListItem(
  { tag, value, className, children, ...rest },
  ref
) {
  const resolved = resolveTag(tag, "li", TagGroup.ListItem);
  const Tag = resolved as ElementType;
  const valueAttr =
    value && value > 0 && resolved === "li" ? { value } : {};
  return (
    <Tag
      ref={ref as Ref<HTMLElement>}
      className={composeRecipe(listRecipe, {}, className)}
      {...valueAttr}
      {...rest}
    >
      {children}
    </Tag>
  );
});
ListItem.displayName = "ListItem";
