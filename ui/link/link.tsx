import { forwardRef, type AnchorHTMLAttributes } from "react";
import linkRecipe from "./link.variants.json";
import { composeRecipe } from "../../utils/variants";
import { controlAttrs, spreadAttrs } from "../../utils/attrs";

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: string;
  size?: string;
  external?: boolean;
  disabled?: boolean;
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
    id,
    role,
    tabIndex,
    className,
    children,
    ...rest
  },
  ref
) {
  const state = disabled ? "pointer-events-none opacity-50" : "";
  const cls = composeRecipe(
    linkRecipe,
    { variant: variant ?? "", size: size ?? "" },
    state,
    className
  );
  const attrs = spreadAttrs(
    controlAttrs(
      id,
      role,
      tabIndex !== undefined ? String(tabIndex) : undefined,
      ariaLabel,
      rest as Record<string, string>
    )
  );
  if (ariaCurrent !== undefined && ariaCurrent !== false) {
    attrs["aria-current"] = ariaCurrent;
  }
  if (disabled) {
    attrs["aria-disabled"] = true;
    attrs.tabIndex = -1;
  }
  const resolvedTarget = linkTarget(target, external);
  const resolvedRel = linkRel(rel, external, resolvedTarget);

  return (
    <a
      ref={ref}
      href={href}
      id={id || undefined}
      className={cls}
      target={resolvedTarget}
      rel={resolvedRel}
      download={download || undefined}
      {...attrs}
    >
      {children}
    </a>
  );
});
