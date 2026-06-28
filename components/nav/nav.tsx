import { forwardRef, type HTMLAttributes, type LiHTMLAttributes } from "react";
import navLinkRecipe from "./nav-link.variants.json";
import navListRecipe from "./nav-list.variants.json";
import { composeRecipe } from "../../utils";
import { mergeAttrs, spreadAttrs } from "../../utils/attrs";
import { Link } from "../../ui/link/link";

export type NavProps = HTMLAttributes<HTMLElement> & {
  "aria-label"?: string;
  dataUI8Kit?: string;
};

export type NavListProps = HTMLAttributes<HTMLUListElement> & {
  orientation?: string;
  gap?: string;
};

export type NavItemProps = LiHTMLAttributes<HTMLLIElement>;

export type NavLinkProps = HTMLAttributes<HTMLElement> & {
  href?: string;
  variant?: string;
  size?: string;
  active?: boolean;
  disabled?: boolean;
  "aria-current"?: string;
  "aria-label"?: string;
};

function navLinkClasses(
  variant?: string,
  size?: string,
  active?: boolean,
  disabled?: boolean,
  className?: string
): string {
  let v = variant ?? "";
  if (active && !v.trim()) v = "active";
  const state = disabled ? "pointer-events-none opacity-50" : "";
  return composeRecipe(navLinkRecipe, { variant: v, size: size ?? "" }, state, className);
}

function navLinkAttrs(
  active?: boolean,
  disabled?: boolean,
  ariaCurrent?: string,
  rest?: Record<string, string>
): ReturnType<typeof spreadAttrs> {
  const attrs = mergeAttrs(rest ?? {});
  let current = (ariaCurrent ?? "").trim();
  if (active && !current) current = "page";
  if (current) attrs["aria-current"] = current;
  if (disabled) {
    attrs["aria-disabled"] = true;
    attrs.tabIndex = "-1";
  }
  return spreadAttrs(attrs);
}

export const Nav = forwardRef<HTMLElement, NavProps>(function Nav(
  { className, "aria-label": ariaLabel, dataUI8Kit, children, ...rest },
  ref
) {
  const attrs = mergeAttrs(rest as Record<string, string>);
  if (ariaLabel?.trim()) attrs["aria-label"] = ariaLabel.trim();
  if (dataUI8Kit?.trim()) attrs["data-ui8kit"] = dataUI8Kit.trim();
  return (
    <nav ref={ref as never} className={className} {...attrs}>
      {children}
    </nav>
  );
});

export const NavList = forwardRef<HTMLUListElement, NavListProps>(function NavList(
  { orientation, gap, className, children, ...rest },
  ref
) {
  return (
    <ul
      ref={ref}
      className={composeRecipe(
        navListRecipe,
        { orientation: orientation ?? "", gap: gap ?? "" },
        className
      )}
      {...rest}
    >
      {children}
    </ul>
  );
});

export const NavItem = forwardRef<HTMLLIElement, NavItemProps>(function NavItem(
  { className, children, ...rest },
  ref
) {
  return (
    <li ref={ref} className={className} {...rest}>
      {children}
    </li>
  );
});

export const NavLink = forwardRef<HTMLElement, NavLinkProps>(function NavLink(
  {
    href,
    variant,
    size,
    active,
    disabled,
    "aria-current": ariaCurrent,
    "aria-label": ariaLabel,
    className,
    children,
    ...rest
  },
  ref
) {
  const cls = navLinkClasses(variant, size, active, disabled, className);
  const attrs = navLinkAttrs(active, disabled, ariaCurrent, rest as Record<string, string>);

  if (disabled || !href?.trim()) {
    return (
      <span ref={ref as never} className={cls} {...attrs}>
        {children}
      </span>
    );
  }

  return (
    <Link
      ref={ref as never}
      href={href}
      variant="unstyled"
      className={cls}
      aria-label={ariaLabel}
      {...attrs}
    >
      {children}
    </Link>
  );
});
