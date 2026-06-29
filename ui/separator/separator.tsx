import { forwardRef, type HTMLAttributes } from "react";
import separatorRecipeJson from "./separator.variants.json";
import { composeRecipe, defineRecipe } from "../../utils";

const { recipe: separatorRecipe, keys: separatorKeys } = defineRecipe(separatorRecipeJson);

type SeparatorVariant = typeof separatorKeys.variant;
type SeparatorOrientation = typeof separatorKeys.orientation;

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
        separatorRecipe,
        { variant, orientation },
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
