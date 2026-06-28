import { forwardRef, type InputHTMLAttributes } from "react";
import inputRecipe from "./input.variants.json";
import { composeRecipe } from "../../utils/variants";
import { controlAttrs, defaultInputType, spreadAttrs } from "../../utils/attrs";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  variant?: string;
  size?: string;
  role?: string;
  tabIndex?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    variant,
    size,
    type,
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
      type={defaultInputType(type)}
      className={composeRecipe(
        inputRecipe,
        { variant: variant ?? "", size: size ?? "" },
        className
      )}
      {...spreadAttrs(controlAttrs(id, role, tabIndex, ariaLabel, rest as Record<string, string>))}
    />
  );
});
