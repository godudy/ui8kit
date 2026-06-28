import { forwardRef, type InputHTMLAttributes } from "react";
import inputRecipe from "./input.variants.json";
import { composeRecipe } from "../../utils/variants";
import { defaultInputType } from "../../utils/attrs";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  variant?: string;
  size?: string;
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
        inputRecipe,
        { variant: variant ?? "", size: size ?? "" },
        className
      )}
      {...rest}
    />
  );
});
