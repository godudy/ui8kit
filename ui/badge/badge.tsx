import { forwardRef, type HTMLAttributes } from "react";
import badgeRecipe from "./badge.variants.json";
import { composeRecipe, type RecipeKey, type VariantRecipe } from "../../utils";

type BadgeVariant = RecipeKey<typeof badgeRecipe, "variant">;
type BadgeSize = RecipeKey<typeof badgeRecipe, "size">;

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
      className={composeRecipe(badgeRecipe as VariantRecipe, { variant: variant ?? "", size: size ?? "" }, className)}
      {...rest}
    >
      {children}
    </div>
  );
});
Badge.displayName = "Badge";
