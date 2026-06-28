import { forwardRef, type ElementType, type HTMLAttributes, type Ref } from "react";
import containerRecipe from "./container.variants.json";
import { composeRecipe } from "../../utils/variants";
import { resolveTag, TagGroup } from "../../utils/tags";

export type ContainerProps = HTMLAttributes<HTMLElement> & {
  tag?: string;
};

export const Container = forwardRef<HTMLElement, ContainerProps>(function Container(
  { tag, className, children, ...rest },
  ref
) {
  const Tag = resolveTag(tag, "div", TagGroup.Container) as ElementType;
  return (
    <Tag
      ref={ref as Ref<HTMLElement>}
      className={composeRecipe(containerRecipe, {}, className)}
      {...rest}
    >
      {children}
    </Tag>
  );
});
