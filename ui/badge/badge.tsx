import { forwardRef, type HTMLAttributes } from "react";
import badgeRecipe from "./badge.variants.json";
import { composeRecipe } from "../../utils/variants";

export type BadgeProps = HTMLAttributes<HTMLDivElement> & {
  variant?: string;
  size?: string;
};

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(function Badge(
  { variant, size, className, children, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      className={composeRecipe(badgeRecipe, { variant: variant ?? "", size: size ?? "" }, className)}
      {...rest}
    >
      {children}
    </div>
  );
});
