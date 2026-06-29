import { forwardRef, type HTMLAttributes } from "react";
import badgeRecipeJson from "./badge.variants.json";
import { composeRecipe, defineRecipe } from "../../utils";

const { recipe: badgeRecipe, keys: badgeKeys } = defineRecipe(badgeRecipeJson);

type BadgeVariant = typeof badgeKeys.variant;
type BadgeSize = typeof badgeKeys.size;

export type BadgeProps = Omit<HTMLAttributes<HTMLDivElement>, "className"> & {
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
};

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(function Badge(
  { variant, size, className, children, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      className={composeRecipe(badgeRecipe, { variant, size }, className)}
      {...rest}
    >
      {children}
    </div>
  );
});
Badge.displayName = "Badge";
