import { forwardRef, type HTMLAttributes } from "react";
import boxRecipe from "./box.variants.json";
import { composeRecipe } from "../../utils/variants";
import { LayoutTag } from "../../utils/layout-tag";
import { TagGroup } from "../../utils/tags";

export type BoxProps = HTMLAttributes<HTMLElement> & {
  tag?: string;
};

export const Box = forwardRef<HTMLElement, BoxProps>(function Box(
  { tag, className, children, ...rest },
  ref
) {
  return (
    <LayoutTag
      ref={ref}
      tag={tag}
      fallback="div"
      group={TagGroup.Layout}
      className={composeRecipe(boxRecipe, {}, className)}
      {...rest}
    >
      {children}
    </LayoutTag>
  );
});
