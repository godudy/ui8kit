import { forwardRef, type HTMLAttributes } from "react";
import iconBadgeRecipe from "./iconbadge.variants.json";
import { composeRecipe } from "../../utils";
import { Icon } from "../../ui/icon/icon";

export type IconBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: string;
  size?: string;
  name?: string;
  iconType?: string;
  baseClass?: string;
  prefix?: string;
  text?: string;
  title?: string;
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
        iconBadgeRecipe,
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
