import { forwardRef, type LabelHTMLAttributes } from "react";
import labelRecipe from "./label.variants.json";
import { composeRecipe } from "../../utils";

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { htmlFor, className, children, ...rest },
  ref
) {
  return (
    <label
      ref={ref}
      className={composeRecipe(labelRecipe, {}, className)}
      htmlFor={htmlFor}
      {...rest}
    >
      {children}
    </label>
  );
});
Label.displayName = "Label";
