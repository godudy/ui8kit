import {
  forwardRef,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type LiHTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import navLinkRecipeJson from "./nav-link.variants.json";
import navListRecipeJson from "./nav-list.variants.json";
import { composeRecipe, defineRecipe, type BehaviorMode } from "../../utils";
import { Link } from "../../ui/link/link";

const { recipe: navLinkRecipe, keys: navLinkKeys } = defineRecipe(navLinkRecipeJson);
const { recipe: navListRecipe, keys: navListKeys } = defineRecipe(navListRecipeJson);

type NavLinkVariant = typeof navLinkKeys.variant;
type NavLinkSize = typeof navLinkKeys.size;
type NavListOrientation = typeof navListKeys.orientation;
type NavListGap = typeof navListKeys.gap;

export type NavProps = HTMLAttributes<HTMLElement> & {
  "aria-label"?: string;
  behavior?: BehaviorMode;
};

export type NavListProps = Omit<HTMLAttributes<HTMLUListElement>, "className"> & {
  orientation?: NavListOrientation;
  gap?: NavListGap;
  className?: string;
  children?: ReactNode;
};

export type NavItemProps = LiHTMLAttributes<HTMLLIElement>;

export type NavLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className"> & {
  href?: string;
  variant?: NavLinkVariant;
  size?: NavLinkSize;
  active?: boolean;
  disabled?: boolean;
  className?: string;
};

function navLinkClasses(
  variant: NavLinkVariant | undefined,
  size: NavLinkSize | undefined,
  active?: boolean,
  disabled?: boolean,
  className?: string
): string {
  const state = disabled ? "pointer-events-none opacity-50" : "";
  if (active && !variant) {
    return composeRecipe(navLinkRecipe, { variant: "active", size }, state, className);
  }
  return composeRecipe(navLinkRecipe, { variant, size }, state, className);
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
  { className, "aria-label": ariaLabel, behavior, children, ...rest },
  ref
) {
  return (
    <nav
      ref={ref as Ref<HTMLElement>}
      className={className}
      aria-label={ariaLabel?.trim() || undefined}
      data-ui8kit={behavior === "ui8kit" ? "nav" : undefined}
      {...rest}
    >
      {children}
    </nav>
  );
});
Nav.displayName = "Nav";

export const NavList = forwardRef<HTMLUListElement, NavListProps>(function NavList(
  { orientation, gap, className, children, ...rest },
  ref
) {
  return (
    <ul
      ref={ref}
      className={composeRecipe(
        navListRecipe,
        { orientation, gap },
        className
      )}
      {...rest}
    >
      {children}
    </ul>
  );
});
NavList.displayName = "NavList";

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
NavItem.displayName = "NavItem";

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
NavLink.displayName = "NavLink";
