import {
  forwardRef,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import titleRecipeJson from "./title.variants.json";
import { composeRecipe, defineRecipe } from "../../utils";
import { titleTag } from "../../utils/attrs";
import { Slot } from "../slot/slot";

const { recipe: titleRecipe } = defineRecipe(titleRecipeJson);

export type TitleAs = 1 | 2 | 3 | 4 | 5 | 6;

export type TitleProps = Omit<HTMLAttributes<HTMLHeadingElement>, "className"> & {
  as?: TitleAs;
  className?: string;
  children?: ReactNode;
  asChild?: boolean;
};

function titleClasses(className?: string): string {
  return composeRecipe(titleRecipe, {}, className);
}

export const Title = forwardRef<HTMLHeadingElement, TitleProps>(function Title(
  { as, className, children, asChild, ...rest },
  ref
) {
  const cls = titleClasses(className);
  if (asChild) {
    return (
      <Slot ref={ref} className={cls} {...rest}>
        {children}
      </Slot>
    );
  }
  const Tag = titleTag(as) as ElementType;
  return (
    <Tag ref={ref} className={cls} {...rest}>
      {children}
    </Tag>
  );
});
Title.displayName = "Title";

export const H1 = forwardRef<HTMLHeadingElement, Omit<TitleProps, "as">>(function H1(
  props,
  ref
) {
  return <Title ref={ref} as={1} {...props} />;
});
H1.displayName = "H1";

export const H2 = forwardRef<HTMLHeadingElement, Omit<TitleProps, "as">>(function H2(
  props,
  ref
) {
  return <Title ref={ref} as={2} {...props} />;
});
H2.displayName = "H2";

export const H3 = forwardRef<HTMLHeadingElement, Omit<TitleProps, "as">>(function H3(
  props,
  ref
) {
  return <Title ref={ref} as={3} {...props} />;
});
H3.displayName = "H3";

export const H4 = forwardRef<HTMLHeadingElement, Omit<TitleProps, "as">>(function H4(
  props,
  ref
) {
  return <Title ref={ref} as={4} {...props} />;
});
H4.displayName = "H4";

export const H5 = forwardRef<HTMLHeadingElement, Omit<TitleProps, "as">>(function H5(
  props,
  ref
) {
  return <Title ref={ref} as={5} {...props} />;
});
H5.displayName = "H5";

export const H6 = forwardRef<HTMLHeadingElement, Omit<TitleProps, "as">>(function H6(
  props,
  ref
) {
  return <Title ref={ref} as={6} {...props} />;
});
H6.displayName = "H6";
