import { forwardRef, type InputHTMLAttributes } from "react";
import checkboxRecipe from "./checkbox.variants.json";
import { composeRecipe, type RecipeKey, type VariantRecipe } from "../../utils";

type CheckboxVariant = RecipeKey<typeof checkboxRecipe, "variant">;
type CheckboxSize = RecipeKey<typeof checkboxRecipe, "size">;

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "className"> & {
  variant?: CheckboxVariant;
  size?: CheckboxSize;
  className?: string;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { variant, size, className, ...rest },
  ref
) {
  return (
    <input
      ref={ref}
      type="checkbox"
      className={composeRecipe(
        checkboxRecipe as VariantRecipe,
        { variant: variant ?? "", size: size ?? "" },
        className
      )}
      {...rest}
    />
  );
});
Checkbox.displayName = "Checkbox";
