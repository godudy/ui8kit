import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";
import buttonRecipe from "./button.variants.json";
import { cn, composeRecipe } from "../../utils";
import { controlAttrs, defaultButtonType, spreadAttrs } from "../../utils/attrs";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    variant?: string;
    size?: string;
  };

function buttonClasses(
  variant?: string,
  size?: string,
  disabled?: boolean,
  className?: string
): string {
  const state = disabled ? "pointer-events-none opacity-50" : "";
  if ((variant ?? "").trim() === "unstyled") {
    return cn(state, className);
  }
  return cn(
    composeRecipe(buttonRecipe, { variant: variant ?? "", size: size ?? "" }),
    state,
    className
  );
}

function buttonSpreadAttrs(
  id?: string,
  role?: string,
  tabIndex?: string,
  ariaLabel?: string,
  href?: string,
  disabled?: boolean,
  rest?: Record<string, string>
): ReturnType<typeof spreadAttrs> {
  const attrs = spreadAttrs(
    controlAttrs(id, role, tabIndex, ariaLabel, rest as Record<string, string>)
  );
  if (href?.trim() && disabled) {
    attrs["aria-disabled"] = true;
    attrs.tabIndex = -1;
    if (!attrs.role) attrs.role = "link";
  }
  return attrs;
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(
    {
      variant,
      size,
      type,
      form,
      disabled,
      href,
      id,
      role,
      tabIndex,
      "aria-label": ariaLabel,
      className,
      children,
      ...rest
    },
    ref
  ) {
    const cls = buttonClasses(variant, size, disabled, className);
    const spread = buttonSpreadAttrs(
      id,
      role,
      tabIndex !== undefined ? String(tabIndex) : undefined,
      ariaLabel,
      href,
      disabled,
      rest as Record<string, string>
    );

    if (href?.trim()) {
      return (
        <a
          ref={ref as never}
          href={href}
          id={id || undefined}
          className={cls}
          rel={disabled ? "nofollow noopener noreferrer" : undefined}
          {...spread}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        ref={ref as never}
        type={defaultButtonType(type)}
        className={cls}
        disabled={disabled}
        id={id || undefined}
        form={form || undefined}
        {...spread}
      >
        {children}
      </button>
    );
  }
);
