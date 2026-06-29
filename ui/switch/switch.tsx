import { forwardRef, type InputHTMLAttributes } from "react";
import switchRecipe from "./switch.variants.json";
import { composeRecipe, type RecipeKey, type VariantRecipe } from "../../utils";

type SwitchVariant = RecipeKey<typeof switchRecipe, "variant">;
type SwitchSize = RecipeKey<typeof switchRecipe, "size">;

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
        switchRecipe as VariantRecipe,
        { variant: variant ?? "", size: size ?? "" },
        className
      )}
      {...rest}
    />
  );
});
Switch.displayName = "Switch";
