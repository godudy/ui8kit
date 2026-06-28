import { forwardRef, type InputHTMLAttributes } from "react";
import checkboxRecipe from "./checkbox.variants.json";
import { composeRecipe } from "../../utils/variants";
import { controlAttrs, spreadAttrs } from "../../utils/attrs";

export type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  variant?: string;
  size?: string;
  role?: string;
  tabIndex?: string;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
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
      type="checkbox"
      className={composeRecipe(
        checkboxRecipe,
        { variant: variant ?? "", size: size ?? "" },
        className
      )}
      {...spreadAttrs(controlAttrs(id, role, tabIndex, ariaLabel, rest as Record<string, string>))}
    />
  );
});
