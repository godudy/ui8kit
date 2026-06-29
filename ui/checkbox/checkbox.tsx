import { forwardRef, type InputHTMLAttributes } from "react";
import checkboxRecipe from "./checkbox.variants.json";
import { composeRecipe } from "../../utils/variants";

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> & {
  variant?: string;
  size?: string;
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
        { variant: variant ?? "", size: size ?? "" },
        className
      )}
      {...rest}
    />
  );
});
