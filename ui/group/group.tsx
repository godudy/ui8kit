import { forwardRef, type ElementType, type HTMLAttributes, type Ref } from "react";
import groupRecipe from "./group.variants.json";
import { composeRecipe } from "../../utils/variants";
import { resolveTag, TagGroup } from "../../utils/tags";

export type GroupProps = HTMLAttributes<HTMLElement> & {
  tag?: string;
};

export const Group = forwardRef<HTMLElement, GroupProps>(function Group(
  { tag, className, children, ...rest },
  ref
) {
  const Tag = resolveTag(tag, "div", TagGroup.Group) as ElementType;
  return (
    <Tag ref={ref as Ref<HTMLElement>} className={composeRecipe(groupRecipe, {}, className)} {...rest}>
      {children}
    </Tag>
  );
});
