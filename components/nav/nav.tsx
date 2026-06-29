import {
  forwardRef,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type LiHTMLAttributes,
  type Ref,
} from "react";
import navLinkRecipe from "./nav-link.variants.json";
import navListRecipe from "./nav-list.variants.json";
import { composeRecipe } from "../../utils";
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

export type NavLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href?: string;
  variant?: string;
  size?: string;
  active?: boolean;
  disabled?: boolean;
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

function navLinkCurrent(
  active?: boolean,
  ariaCurrent?: AnchorHTMLAttributes<HTMLAnchorElement>["aria-current"]
): AnchorHTMLAttributes<HTMLAnchorElement>["aria-current"] {
  if (ariaCurrent !== undefined && ariaCurrent !== false) return ariaCurrent;
  if (active) return "page";
  return undefined;
}

export const Nav = forwardRef<HTMLElement, NavProps>(function Nav(
  { className, "aria-label": ariaLabel, dataUI8Kit, children, ...rest },
  ref
) {
  return (
    <nav
      ref={ref as Ref<HTMLElement>}
      className={className}
      aria-label={ariaLabel?.trim() || undefined}
      data-ui8kit={dataUI8Kit?.trim() || undefined}
      {...rest}
    >
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
    tabIndex,
    className,
    children,
    ...rest
  },
  ref
) {
  const cls = navLinkClasses(variant, size, active, disabled, className);
  const resolvedCurrent = navLinkCurrent(active, ariaCurrent);

  if (disabled || !href?.trim()) {
    return (
      <span
        ref={ref as Ref<HTMLElement>}
        className={cls}
        aria-current={resolvedCurrent}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : tabIndex}
        {...rest}
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      ref={ref as Ref<HTMLAnchorElement>}
      href={href}
      variant="unstyled"
      className={cls}
      aria-label={ariaLabel}
      aria-current={resolvedCurrent}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : tabIndex}
      {...rest}
    >
      {children}
    </Link>
  );
});
