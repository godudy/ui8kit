import { forwardRef, type HTMLAttributes } from "react";
import alertRecipe from "./alert.variants.json";
import { alertAttrs } from "../../utils/attrs";
import { composeRecipe } from "../../utils/variants";

export type AlertProps = HTMLAttributes<HTMLElement> & {
  variant?: string;
  role?: string;
  "aria-live"?: string;
};

export const Alert = forwardRef<HTMLElement, AlertProps>(function Alert(
  { variant, role, "aria-live": ariaLive, className, children, ...rest },
  ref
) {
  const attrs = alertAttrs(role, ariaLive);
  return (
    <section
      ref={ref as never}
      className={composeRecipe(alertRecipe, { variant: variant ?? "" }, className)}
      role={attrs.role as "status"}
      aria-live={(attrs["aria-live"] as "polite" | "off" | "assertive") ?? "polite"}
      {...rest}
    >
      {children}
    </section>
  );
});
