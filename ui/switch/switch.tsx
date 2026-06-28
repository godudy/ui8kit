import { forwardRef, type InputHTMLAttributes } from "react";
import switchRecipe from "./switch.variants.json";
import { composeRecipe } from "../../utils/variants";

export type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> & {
  variant?: string;
  size?: string;
};

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { variant, size, checked, defaultChecked, role, className, ...rest },
  ref
) {
  const isChecked = checked ?? defaultChecked ?? false;
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      defaultChecked={defaultChecked}
      role={role ?? "switch"}
      aria-checked={Boolean(isChecked)}
      className={composeRecipe(
        switchRecipe,
        { variant: variant ?? "", size: size ?? "" },
        className
      )}
      {...rest}
    />
  );
});
