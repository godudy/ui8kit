import { forwardRef, type HTMLAttributes } from "react";
import separatorRecipe from "./separator.variants.json";
import { composeRecipe } from "../../utils/variants";

export type SeparatorProps = HTMLAttributes<HTMLHRElement> & {
  variant?: string;
  orientation?: string;
  decorative?: boolean;
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
