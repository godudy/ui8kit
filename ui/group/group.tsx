import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode, type Ref } from "react";
import groupRecipe from "./group.variants.json";
import { composeRecipe } from "../../utils";
import { resolveTag, TagGroup } from "../../utils/tags";
import { Slot } from "../slot/slot";

/**
 * Horizontal flex grouping. Landmarks (`aside`, `section`, `header`, `nav`) belong
 * on `Block`. `Group` allows only `div`, `fieldset`, or `dl` as `tag`.
 */
export type GroupProps = Omit<HTMLAttributes<HTMLElement>, "className"> & {
  tag?: string;
  className?: string;
  children?: ReactNode;
  asChild?: boolean;
};

export const Group = forwardRef<HTMLElement, GroupProps>(function Group(
  { tag, className, children, asChild, ...rest },
  ref
) {
  const cls = composeRecipe(groupRecipe, {}, className);
  if (asChild) {
    return (
      <Slot ref={ref} className={cls} {...rest}>
        {children}
      </Slot>
    );
  }
  const Tag = resolveTag(tag, "div", TagGroup.Group) as ElementType;
  return (
    <Tag ref={ref as Ref<HTMLElement>} className={cls} {...rest}>
      {children}
    </Tag>
  );
});
Group.displayName = "Group";
