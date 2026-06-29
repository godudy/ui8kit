import { forwardRef, type HTMLAttributes } from "react";
import iconBadgeRecipe from "./iconbadge.variants.json";
import { composeRecipe, type RecipeKey, type VariantRecipe } from "../../utils";
import { Icon, type IconType } from "../../ui/icon/icon";

type IconBadgeVariant = RecipeKey<typeof iconBadgeRecipe, "variant">;
type IconBadgeSize = RecipeKey<typeof iconBadgeRecipe, "size">;

export type { IconBadgeVariant, IconBadgeSize };

export type IconBadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, "className"> & {
  variant?: IconBadgeVariant;
  size?: IconBadgeSize;
  name?: string;
  iconType?: IconType;
  baseClass?: string;
  prefix?: string;
  text?: string;
  title?: string;
  className?: string;
  "aria-label"?: string;
};

function iconBadgeText(name?: string, text?: string): string {
  if (text) return text;
  if (!name) return "*";
  return [...name][0] ?? "*";
}

export const IconBadge = forwardRef<HTMLSpanElement, IconBadgeProps>(function IconBadge(
  {
    variant,
    size,
    name,
    iconType,
    baseClass,
    prefix,
    text,
    title,
    "aria-label": ariaLabel,
    className,
    children,
    ...rest
  },
  ref
) {
  const showIcon = baseClass?.trim() || iconType === "svg";
  return (
    <span
      ref={ref}
      className={composeRecipe(
        iconBadgeRecipe as VariantRecipe,
        { variant: variant ?? "", size: size ?? "" },
        className
      )}
      {...rest}
    >
      {showIcon ? (
        <Icon
          type={iconType}
          name={name}
          baseClass={baseClass}
          prefix={prefix}
          title={title}
          aria-label={ariaLabel}
        />
      ) : (
        iconBadgeText(name, text)
      )}
      {children}
    </span>
  );
});
IconBadge.displayName = "IconBadge";
