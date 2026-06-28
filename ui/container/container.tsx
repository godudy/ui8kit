import { forwardRef, type HTMLAttributes } from "react";
import containerRecipe from "./container.variants.json";
import { composeRecipe } from "../../utils/variants";
import { LayoutTag } from "../../utils/layout-tag";
import { TagGroup } from "../../utils/tags";

export type ContainerProps = HTMLAttributes<HTMLElement> & {
  tag?: string;
};

export const Container = forwardRef<HTMLElement, ContainerProps>(function Container(
  { tag, className, children, ...rest },
  ref
) {
  return (
    <LayoutTag
      ref={ref}
      tag={tag}
      fallback="div"
      group={TagGroup.Container}
      className={composeRecipe(containerRecipe, {}, className)}
      {...rest}
    >
      {children}
    </LayoutTag>
  );
});
