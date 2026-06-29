import { forwardRef, type InputHTMLAttributes } from "react";
import inputRecipeJson from "./input.variants.json";
import { composeRecipe, defineRecipe } from "../../utils";
import { defaultInputType } from "../../utils/attrs";

const { recipe: inputRecipe, keys: inputKeys } = defineRecipe(inputRecipeJson);

type InputVariant = typeof inputKeys.variant;
type InputSize = typeof inputKeys.size;

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
        inputRecipe,
        { variant, size },
        className
      )}
      {...rest}
    />
  );
});
Input.displayName = "Input";
