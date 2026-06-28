import { forwardRef, type HTMLAttributes } from "react";
import stackRecipe from "./stack.variants.json";
import { composeRecipe } from "../../utils/variants";
import { LayoutTag } from "../../utils/layout-tag";
import { TagGroup } from "../../utils/tags";

export type StackProps = HTMLAttributes<HTMLElement> & {
  tag?: string;
};

export const Stack = forwardRef<HTMLElement, StackProps>(function Stack(
  { tag, className, children, ...rest },
  ref
) {
  return (
    <LayoutTag
      ref={ref}
      tag={tag}
      fallback="div"
      group={TagGroup.Stack}
      className={composeRecipe(stackRecipe, {}, className)}
      {...rest}
    >
      {children}
    </LayoutTag>
  );
});
