import { forwardRef, type InputHTMLAttributes } from "react";
import radioRecipe from "./radio.variants.json";
import { composeRecipe } from "../../utils/variants";

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> & {
  variant?: string;
  size?: string;
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
        { variant: variant ?? "", size: size ?? "" },
        className
      )}
      {...rest}
    />
  );
});
