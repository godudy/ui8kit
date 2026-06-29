import { forwardRef, type InputHTMLAttributes } from "react";
import inputRecipe from "./input.variants.json";
import { composeRecipe, type RecipeKey, type VariantRecipe } from "../../utils";
import { defaultInputType } from "../../utils/attrs";

type InputVariant = RecipeKey<typeof inputRecipe, "variant">;
type InputSize = RecipeKey<typeof inputRecipe, "size">;

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "className"> & {
  variant?: InputVariant;
  size?: InputSize;
  className?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { variant, size, type, className, ...rest },
  ref
) {
  return (
    <input
      ref={ref}
      type={defaultInputType(type)}
      className={composeRecipe(
        inputRecipe as VariantRecipe,
        { variant: variant ?? "", size: size ?? "" },
        className
      )}
      {...rest}
    />
  );
});
Input.displayName = "Input";
