import { forwardRef, type ElementType, type HTMLAttributes, type Ref } from "react";
import boxRecipe from "./box.variants.json";
import { composeRecipe } from "../../utils/variants";
import { resolveTag, TagGroup } from "../../utils/tags";

export type BoxProps = HTMLAttributes<HTMLElement> & {
  tag?: string;
};

export const Box = forwardRef<HTMLElement, BoxProps>(function Box(
  { tag, className, children, ...rest },
  ref
) {
  const Tag = resolveTag(tag, "div", TagGroup.Layout) as ElementType;
  return (
    <Tag ref={ref as Ref<HTMLElement>} className={composeRecipe(boxRecipe, {}, className)} {...rest}>
      {children}
    </Tag>
  );
});
