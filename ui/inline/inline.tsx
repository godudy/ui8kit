import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import inlineRecipeJson from "./inline.variants.json";
import { composeRecipe, defineRecipe } from "../../utils";
import { Slot } from "../slot/slot";

const { recipe: inlineRecipe } = defineRecipe(inlineRecipeJson);

export type InlineProps = Omit<HTMLAttributes<HTMLSpanElement>, "className"> & {
  className?: string;
  children?: ReactNode;
  asChild?: boolean;
};

export const Inline = forwardRef<HTMLSpanElement, InlineProps>(function Inline(
  { className, children, asChild, ...rest },
  ref
) {
  const cls = composeRecipe(inlineRecipe, {}, className);
  if (asChild) {
    return (
      <Slot ref={ref} className={cls} {...rest}>
        {children}
      </Slot>
    );
  }
  return (
    <span ref={ref} className={cls} {...rest}>
      {children}
    </span>
  );
});
Inline.displayName = "Inline";
