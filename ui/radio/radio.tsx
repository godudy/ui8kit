import { forwardRef, type InputHTMLAttributes } from "react";
import radioRecipeJson from "./radio.variants.json";
import { composeRecipe, defineRecipe } from "../../utils";

const { recipe: radioRecipe, keys: radioKeys } = defineRecipe(radioRecipeJson);

type RadioVariant = typeof radioKeys.variant;
type RadioSize = typeof radioKeys.size;

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "className"> & {
  variant?: RadioVariant;
  size?: RadioSize;
  className?: string;
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { variant, size, className, ...rest },
  ref
) {
  return (
    <input
      ref={ref}
      type="radio"
      className={composeRecipe(
        radioRecipe,
        { variant, size },
        className
      )}
      {...rest}
    />
  );
});
Radio.displayName = "Radio";
