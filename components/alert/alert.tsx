import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import alertRecipe from "./alert.variants.json";
import { composeRecipe, type RecipeKey, type VariantRecipe } from "../../utils";
import { Slot } from "../../ui/slot/slot";

type AlertVariant = RecipeKey<typeof alertRecipe, "variant">;

export type AlertProps = Omit<HTMLAttributes<HTMLElement>, "className"> & {
  variant?: AlertVariant;
  role?: string;
  "aria-live"?: "off" | "polite" | "assertive";
  className?: string;
  children?: ReactNode;
  asChild?: boolean;
};

export const Alert = forwardRef<HTMLElement, AlertProps>(function Alert(
  { variant, role, "aria-live": ariaLive, className, children, asChild, ...rest },
  ref
) {
  const resolvedLive: AlertProps["aria-live"] = ariaLive ?? "polite";
  const cls = composeRecipe(alertRecipe as VariantRecipe, { variant: variant ?? "" }, className);
  if (asChild) {
    return (
      <Slot
        ref={ref}
        className={cls}
        role={role?.trim() || "status"}
        aria-live={resolvedLive}
        {...rest}
      >
        {children}
      </Slot>
    );
  }
  return (
    <section
      ref={ref}
      className={cls}
      role={role?.trim() || "status"}
      aria-live={resolvedLive}
      {...rest}
    >
      {children}
    </section>
  );
});
Alert.displayName = "Alert";
