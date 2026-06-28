import { forwardRef, type HTMLAttributes } from "react";
import groupRecipe from "./group.variants.json";
import { composeRecipe } from "../../utils/variants";
import { LayoutTag } from "../../utils/layout-tag";
import { TagGroup } from "../../utils/tags";

export type GroupProps = HTMLAttributes<HTMLElement> & {
  tag?: string;
};

export const Group = forwardRef<HTMLElement, GroupProps>(function Group(
  { tag, className, children, ...rest },
  ref
) {
  return (
    <LayoutTag
      ref={ref}
      tag={tag}
      fallback="div"
      group={TagGroup.Group}
      className={composeRecipe(groupRecipe, {}, className)}
      {...rest}
    >
      {children}
    </LayoutTag>
  );
});
