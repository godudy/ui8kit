import { forwardRef, type HTMLAttributes, type Ref, type SVGProps } from "react";
import iconRecipeJson from "./icon.variants.json";
import { cn, composeRecipe, defineRecipe } from "../../utils";

const { recipe: iconRecipe, keys: iconKeys } = defineRecipe(iconRecipeJson);

type IconType = typeof iconKeys.type;
type IconSize = typeof iconKeys.size;

export type { IconType, IconSize };

export type IconProps = Omit<HTMLAttributes<HTMLElement>, "className"> & {
  name?: string;
  type?: IconType;
  baseClass?: string;
  prefix?: string;
  size?: IconSize;
  href?: string;
  title?: string;
  decorative?: boolean;
  className?: string;
  "aria-label"?: string;
};

function iconType(value?: string): string {
  const t = (value ?? "").trim();
  return t === "svg" || t === "text" ? t : "class";
}

function iconClassName(name?: string, baseClass?: string, prefix?: string): string {
  const n = (name ?? "").trim();
  if (!n) return (baseClass ?? "").trim();
  return cn((baseClass ?? "").trim(), `${(prefix ?? "").trim()}${n}`);
}

function iconIsDecorative(
  decorative?: boolean,
  title?: string,
  ariaLabel?: string
): boolean {
  return decorative || !(title?.trim() || ariaLabel?.trim());
}

function iconAttrs(
  decorative?: boolean,
  title?: string,
  ariaLabel?: string,
  rest?: HTMLAttributes<HTMLElement>
): HTMLAttributes<HTMLElement> {
  const attrs: HTMLAttributes<HTMLElement> = { ...(rest ?? {}) };
  if (iconIsDecorative(decorative, title, ariaLabel)) {
    attrs["aria-hidden"] = true;
    return attrs;
  }
  attrs.role = "img";
  if (ariaLabel?.trim()) attrs["aria-label"] = ariaLabel.trim();
  return attrs;
}

function iconClasses(
  type?: string,
  size?: string,
  name?: string,
  baseClass?: string,
  prefix?: string,
  className?: string
): string {
  const resolved = iconType(type) as IconType;
  const base = composeRecipe(iconRecipe, { type: resolved, size: size as IconSize | undefined });
  if (resolved === "class") {
    return cn(base, iconClassName(name, baseClass, prefix), className);
  }
  return cn(base, className);
}

export const Icon = forwardRef<HTMLElement | SVGSVGElement, IconProps>(function Icon(
  {
    name,
    type,
    baseClass,
    prefix,
    size,
    href,
    title,
    decorative,
    "aria-label": ariaLabel,
    className,
    children,
    ...rest
  },
  ref
) {
  const cls = iconClasses(type, size, name, baseClass, prefix, className);
  const attrs = iconAttrs(decorative, title, ariaLabel, rest);
  const resolved = iconType(type);

  if (resolved === "svg") {
    return (
      <svg
        ref={ref as Ref<SVGSVGElement>}
        className={cls}
        {...(attrs as SVGProps<SVGSVGElement>)}
      >
        {title ? <title>{title}</title> : null}
        {href ? <use href={href} /> : null}
        {children}
      </svg>
    );
  }

  if (resolved === "text") {
    return (
      <span ref={ref as Ref<HTMLElement>} className={cls} {...attrs}>
        {children}
      </span>
    );
  }

  return <span ref={ref as Ref<HTMLElement>} className={cls} {...attrs} />;
});
Icon.displayName = "Icon";
