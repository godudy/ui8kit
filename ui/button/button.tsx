import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import buttonRecipe from "./button.variants.json";
import { cn, composeRecipe } from "../../utils";
import { defaultButtonType } from "../../utils/attrs";

type ButtonBaseProps = {
  variant?: string;
  size?: string;
  className?: string;
  children?: ReactNode;
};

type ButtonAsButtonProps = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "type"> & {
    href?: undefined;
    type?: "button" | "submit" | "reset";
  };

type ButtonAsAnchorProps = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className"> & {
    href: string;
    disabled?: boolean;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps;

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

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(props, ref) {
    if ("href" in props && props.href?.trim()) {
      const anchorProps = props as ButtonAsAnchorProps;
      const {
        href,
        variant,
        size,
        disabled,
        className,
        children,
        rel,
        tabIndex,
        role,
        ...rest
      } = anchorProps;

      const cls = buttonClasses(variant, size, disabled, className);
      const resolvedRel = disabled ? rel || "nofollow noopener noreferrer" : rel;

      return (
        <a
          ref={ref as Ref<HTMLAnchorElement>}
          href={href}
          className={cls}
          rel={resolvedRel}
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : tabIndex}
          role={disabled ? role || "link" : role}
          {...rest}
        >
          {children}
        </a>
      );
    }

    const buttonProps = props as ButtonAsButtonProps;
    const { variant, size, type, disabled, className, children, ...rest } = buttonProps;
    const cls = buttonClasses(variant, size, disabled, className);

    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        type={defaultButtonType(type)}
        className={cls}
        disabled={disabled}
        {...rest}
      >
        {children}
      </button>
    );
  }
);
