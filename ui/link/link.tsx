import { forwardRef, type AnchorHTMLAttributes } from "react";
import linkRecipe from "./link.variants.json";
import { composeRecipe, type RecipeKey, type VariantRecipe } from "../../utils";

type LinkVariant = RecipeKey<typeof linkRecipe, "variant">;
type LinkSize = RecipeKey<typeof linkRecipe, "size">;

export type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className"> & {
  variant?: LinkVariant;
  size?: LinkSize;
  external?: boolean;
  disabled?: boolean;
  className?: string;
};

function linkTarget(target?: string, external?: boolean): string | undefined {
  if (target?.trim()) return target;
  if (external) return "_blank";
  return undefined;
}

function linkRel(rel?: string, external?: boolean, target?: string): string | undefined {
  if (rel?.trim()) return rel;
  if (external || target === "_blank") return "noopener noreferrer";
  return undefined;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  {
    variant,
    size,
    href = "",
    target,
    rel,
    download,
    external,
    disabled,
    "aria-current": ariaCurrent,
    "aria-label": ariaLabel,
    className,
    children,
    ...rest
  },
  ref
) {
  const state = disabled ? "pointer-events-none opacity-50" : "";
  const cls = composeRecipe(
    linkRecipe as VariantRecipe,
    { variant: variant ?? "", size: size ?? "" },
    state,
    className
  );
  const resolvedTarget = linkTarget(target, external);
  const resolvedRel = linkRel(rel, external, resolvedTarget);

  return (
    <a
      ref={ref}
      href={href}
      className={cls}
      target={resolvedTarget}
      rel={resolvedRel}
      download={download || undefined}
      {...rest}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : rest.tabIndex}
    >
      {children}
    </a>
  );
});
Link.displayName = "Link";
