import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import textRecipeJson from "./text.variants.json";
import { composeRecipe, defineRecipe } from "../../utils";
import { Slot } from "../slot/slot";

const { recipe: textRecipe } = defineRecipe(textRecipeJson);

export type TextProps = Omit<HTMLAttributes<HTMLParagraphElement>, "className"> & {
  className?: string;
  children?: ReactNode;
  asChild?: boolean;
};

export const Text = forwardRef<HTMLParagraphElement, TextProps>(function Text(
  { className, children, asChild, ...rest },
  ref
) {
  const cls = composeRecipe(textRecipe, {}, className);
  if (asChild) {
    return (
      <Slot ref={ref} className={cls} {...rest}>
        {children}
      </Slot>
    );
  }
  return (
    <p ref={ref} className={cls} {...rest}>
      {children}
    </p>
  );
});
Text.displayName = "Text";
