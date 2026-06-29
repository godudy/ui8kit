import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode, type Ref } from "react";
import titleRecipe from "./title.variants.json";
import { composeRecipe, type VariantRecipe } from "../../utils";
import { titleTag } from "../../utils/attrs";
import { Slot } from "../slot/slot";

export type TitleProps = Omit<HTMLAttributes<HTMLHeadingElement>, "className"> & {
  order?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  children?: ReactNode;
  asChild?: boolean;
};

export const Title = forwardRef<HTMLHeadingElement, TitleProps>(function Title(
  { order, className, children, asChild, ...rest },
  ref
) {
  const cls = composeRecipe(titleRecipe as VariantRecipe, {}, className);
  if (asChild) {
    return (
      <Slot ref={ref} className={cls} {...rest}>
        {children}
      </Slot>
    );
  }
  const Tag = titleTag(order) as ElementType;
  return (
    <Tag
      ref={ref as Ref<HTMLHeadingElement>}
      className={cls}
      {...rest}
    >
      {children}
    </Tag>
  );
});
Title.displayName = "Title";
