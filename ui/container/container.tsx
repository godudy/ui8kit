import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode, type Ref } from "react";
import containerRecipe from "./container.variants.json";
import { composeRecipe } from "../../utils";
import { resolveTag, TagGroup } from "../../utils/tags";
import { Slot } from "../slot/slot";

export type ContainerProps = Omit<HTMLAttributes<HTMLElement>, "className"> & {
  tag?: string;
  className?: string;
  children?: ReactNode;
  asChild?: boolean;
};

export const Container = forwardRef<HTMLElement, ContainerProps>(function Container(
  { tag, className, children, asChild, ...rest },
  ref
) {
  const cls = composeRecipe(containerRecipe, {}, className);
  if (asChild) {
    return (
      <Slot ref={ref} className={cls} {...rest}>
        {children}
      </Slot>
    );
  }
  const Tag = resolveTag(tag, "div", TagGroup.Container) as ElementType;
  return (
    <Tag ref={ref as Ref<HTMLElement>} className={cls} {...rest}>
      {children}
    </Tag>
  );
});
Container.displayName = "Container";
