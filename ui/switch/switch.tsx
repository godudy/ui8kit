import { forwardRef, type InputHTMLAttributes } from "react";
import switchRecipeJson from "./switch.variants.json";
import { composeRecipe, defineRecipe } from "../../utils";

const { recipe: switchRecipe, keys: switchKeys } = defineRecipe(switchRecipeJson);

type SwitchVariant = typeof switchKeys.variant;
type SwitchSize = typeof switchKeys.size;

export type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "className"> & {
  variant?: SwitchVariant;
  size?: SwitchSize;
  className?: string;
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
        { variant, size },
        className
      )}
      {...rest}
    />
  );
});
Switch.displayName = "Switch";
