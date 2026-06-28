import { forwardRef, type HTMLAttributes } from "react";
import separatorRecipe from "./separator.variants.json";
import { composeRecipe } from "../../utils/variants";
import { mergeAttrs } from "../../utils/attrs";

export type SeparatorProps = HTMLAttributes<HTMLHRElement> & {
  variant?: string;
  orientation?: string;
  decorative?: boolean;
};

export const Separator = forwardRef<HTMLHRElement, SeparatorProps>(function Separator(
  { variant, orientation, decorative, className, ...rest },
  ref
) {
  const attrs = mergeAttrs(rest as Record<string, string>);
  if (decorative) {
    attrs.role = "presentation";
    attrs["aria-hidden"] = "true";
  }
  if (orientation === "vertical") {
    attrs["aria-orientation"] = "vertical";
  }
  return (
    <hr
      ref={ref}
      className={composeRecipe(separatorRecipe, { variant: variant ?? "", orientation: orientation ?? "" }, className)}
      {...attrs}
    />
  );
});
