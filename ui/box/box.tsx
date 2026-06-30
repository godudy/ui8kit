import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode, type Ref } from "react";
import boxRecipe from "./box.variants.json";
import { composeRecipe } from "../../utils";
import { resolveTag, TagGroup } from "../../utils/tags";
import { Slot } from "../slot/slot";

export type BoxProps = Omit<HTMLAttributes<HTMLElement>, "className"> & {
  tag?: string;
  className?: string;
  children?: ReactNode;
  asChild?: boolean;
};

export const Box = forwardRef<HTMLElement, BoxProps>(function Box(
  { tag, className, children, asChild, ...rest },
  ref
) {
  if (asChild) {
    return (
      <Slot ref={ref} className={composeRecipe(boxRecipe, {}, className)} {...rest}>
        {children}
      </Slot>
    );
  }
  const Tag = resolveTag(tag, "div", TagGroup.BoxAllowed) as ElementType;
  return (
    <Tag ref={ref as Ref<HTMLElement>} className={composeRecipe(boxRecipe, {}, className)} {...rest}>
      {children}
    </Tag>
  );
});
Box.displayName = "Box";
