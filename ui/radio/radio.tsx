import { forwardRef, type InputHTMLAttributes } from "react";
import radioRecipe from "./radio.variants.json";
import { composeRecipe, type RecipeKey, type VariantRecipe } from "../../utils";

type RadioVariant = RecipeKey<typeof radioRecipe, "variant">;
type RadioSize = RecipeKey<typeof radioRecipe, "size">;

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
        radioRecipe as VariantRecipe,
        { variant: variant ?? "", size: size ?? "" },
        className
      )}
      {...rest}
    />
  );
});
Radio.displayName = "Radio";
