import { forwardRef, type HTMLAttributes } from "react";
import separatorRecipe from "./separator.variants.json";
import { composeRecipe, type RecipeKey, type VariantRecipe } from "../../utils";

type SeparatorVariant = RecipeKey<typeof separatorRecipe, "variant">;
type SeparatorOrientation = RecipeKey<typeof separatorRecipe, "orientation">;

export type SeparatorProps = Omit<HTMLAttributes<HTMLHRElement>, "className"> & {
  variant?: SeparatorVariant;
  orientation?: SeparatorOrientation;
  decorative?: boolean;
  className?: string;
};

export const Separator = forwardRef<HTMLHRElement, SeparatorProps>(function Separator(
  { variant, orientation, decorative, className, ...rest },
  ref
) {
  return (
    <hr
      ref={ref}
      className={composeRecipe(
        separatorRecipe as VariantRecipe,
        { variant: variant ?? "", orientation: orientation ?? "" },
        className
      )}
      {...rest}
      role={decorative ? "presentation" : rest.role}
      aria-hidden={decorative ? true : rest["aria-hidden"]}
      aria-orientation={orientation === "vertical" ? "vertical" : rest["aria-orientation"]}
    />
  );
});
Separator.displayName = "Separator";
