import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import iconBadgeRecipeJson from "./iconbadge.variants.json";
import { composeRecipe, defineRecipe } from "../../utils";

const { recipe: iconBadgeRecipe, keys: iconBadgeKeys } = defineRecipe(iconBadgeRecipeJson);

type IconBadgeVariant = typeof iconBadgeKeys.variant;
type IconBadgeSize = typeof iconBadgeKeys.size;

export type { IconBadgeVariant, IconBadgeSize };

export type IconBadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, "className" | "title"> & {
  variant?: IconBadgeVariant;
  size?: IconBadgeSize;
  className?: string;
  children?: ReactNode;
  /** @deprecated Pass the letter or glyph as children. */
  name?: string;
  /** @deprecated Pass an <Icon /> as children instead. */
  iconType?: "svg" | "img" | "font";
  /** @deprecated Pass an <Icon /> as children instead. */
  baseClass?: string;
  /** @deprecated Pass an <Icon /> as children instead. */
  prefix?: string;
  /** @deprecated Pass content as children. */
  text?: string;
  /** @deprecated Pass an <Icon /> as children instead. */
  title?: string;
};

export const IconBadge = forwardRef<HTMLSpanElement, IconBadgeProps>(function IconBadge(
  {
    variant,
    size,
    className,
    children,
    name: _name,
    iconType: _iconType,
    baseClass: _baseClass,
    prefix: _prefix,
    text: _text,
    title: _title,
    ...rest
  },
  ref
) {
  void _name; void _iconType; void _baseClass; void _prefix; void _text; void _title;
  const cls = composeRecipe(iconBadgeRecipe, { variant, size }, className);
  return (
    <span ref={ref} className={cls} {...rest}>
      {children}
    </span>
  );
});
IconBadge.displayName = "IconBadge";
