import { forwardRef, type ElementType, type HTMLAttributes, type Ref } from "react";
import titleRecipe from "./title.variants.json";
import { composeRecipe } from "../../utils/variants";
import { titleTag } from "../../utils/attrs";

export type TitleProps = HTMLAttributes<HTMLHeadingElement> & {
  order?: number;
};

export const Title = forwardRef<HTMLHeadingElement, TitleProps>(function Title(
  { order, className, children, ...rest },
  ref
) {
  const Tag = titleTag(order) as ElementType;
  return (
    <Tag
      ref={ref as Ref<HTMLHeadingElement>}
      className={composeRecipe(titleRecipe, {}, className)}
      {...rest}
    >
      {children}
    </Tag>
  );
});
