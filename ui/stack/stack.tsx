import { forwardRef, type ElementType, type HTMLAttributes, type Ref } from "react";
import stackRecipe from "./stack.variants.json";
import { composeRecipe } from "../../utils/variants";
import { resolveTag, TagGroup } from "../../utils/tags";

export type StackProps = HTMLAttributes<HTMLElement> & {
  tag?: string;
};

export const Stack = forwardRef<HTMLElement, StackProps>(function Stack(
  { tag, className, children, ...rest },
  ref
) {
  const Tag = resolveTag(tag, "div", TagGroup.Stack) as ElementType;
  return (
    <Tag ref={ref as Ref<HTMLElement>} className={composeRecipe(stackRecipe, {}, className)} {...rest}>
      {children}
    </Tag>
  );
});
