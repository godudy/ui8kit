import { forwardRef, type InputHTMLAttributes } from "react";
import checkboxRecipeJson from "./checkbox.variants.json";
import { composeRecipe, defineRecipe } from "../../utils";

const { recipe: checkboxRecipe, keys: checkboxKeys } = defineRecipe(checkboxRecipeJson);

type CheckboxVariant = typeof checkboxKeys.variant;
type CheckboxSize = typeof checkboxKeys.size;

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
        checkboxRecipe,
        { variant, size },
        className
      )}
      {...rest}
    />
  );
});
Checkbox.displayName = "Checkbox";
