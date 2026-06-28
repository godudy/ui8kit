import { forwardRef, type ElementType, type HTMLAttributes } from "react";
import titleRecipe from "./title.variants.json";
import { composeRecipe } from "../../utils/variants";
import { titleTag } from "../../utils/attrs";

export type TitleProps = HTMLAttributes<HTMLElement> & {
  order?: number;
};

export const Title = forwardRef<HTMLElement, TitleProps>(function Title(
  { order, className, children, ...rest },
  ref
) {
  const Tag = titleTag(order) as ElementType;
  return (
    <Tag ref={ref as never} className={composeRecipe(titleRecipe, {}, className)} {...rest}>
      {children}
    </Tag>
  );
});
