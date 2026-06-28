import { forwardRef, type HTMLAttributes } from "react";
import alertRecipe from "./alert.variants.json";
import { composeRecipe } from "../../utils/variants";

export type AlertProps = HTMLAttributes<HTMLElement> & {
  variant?: string;
  role?: string;
  "aria-live"?: "off" | "polite" | "assertive";
};

export const Alert = forwardRef<HTMLElement, AlertProps>(function Alert(
  { variant, role, "aria-live": ariaLive, className, children, ...rest },
  ref
) {
  const resolvedLive: AlertProps["aria-live"] = ariaLive ?? "polite";
  return (
    <section
      ref={ref}
      className={composeRecipe(alertRecipe, { variant: variant ?? "" }, className)}
      role={role?.trim() || "status"}
      aria-live={resolvedLive}
      {...rest}
    >
      {children}
    </section>
  );
});
