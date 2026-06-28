import { forwardRef, type InputHTMLAttributes } from "react";
import radioRecipe from "./radio.variants.json";
import { composeRecipe } from "../../utils/variants";
import { controlAttrs, spreadAttrs } from "../../utils/attrs";

export type RadioProps = InputHTMLAttributes<HTMLInputElement> & {
  variant?: string;
  size?: string;
  role?: string;
  tabIndex?: string;
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
    variant,
    size,
    id,
    role,
    tabIndex,
    "aria-label": ariaLabel,
    className,
    ...rest
  },
  ref
) {
  return (
    <input
      ref={ref}
      id={id || undefined}
      type="radio"
      className={composeRecipe(
        radioRecipe,
        { variant: variant ?? "", size: size ?? "" },
        className
      )}
      {...spreadAttrs(controlAttrs(id, role, tabIndex, ariaLabel, rest as Record<string, string>))}
    />
  );
});
