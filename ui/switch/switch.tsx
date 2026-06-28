import { forwardRef, type InputHTMLAttributes } from "react";
import switchRecipe from "./switch.variants.json";
import { composeRecipe } from "../../utils/variants";
import { switchAttrs, spreadAttrs } from "../../utils/attrs";

export type SwitchProps = InputHTMLAttributes<HTMLInputElement> & {
  variant?: string;
  size?: string;
  role?: string;
  tabIndex?: string;
  checked?: boolean;
};

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    variant,
    size,
    id,
    role,
    tabIndex,
    "aria-label": ariaLabel,
    checked = false,
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
      checked={checked}
      className={composeRecipe(
        switchRecipe,
        { variant: variant ?? "", size: size ?? "" },
        className
      )}
      {...spreadAttrs(
        switchAttrs(checked, id, role, tabIndex, ariaLabel, rest as Record<string, string>)
      )}
    />
  );
});
