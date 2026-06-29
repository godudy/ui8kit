import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import buttonRecipe from "./button.variants.json";
import { cn, composeRecipe, type RecipeKey, type VariantRecipe } from "../../utils";
import { defaultButtonType } from "../../utils/attrs";
import { Slot } from "../slot/slot";

type ButtonVariant = RecipeKey<typeof buttonRecipe, "variant">;
type ButtonSize = RecipeKey<typeof buttonRecipe, "size">;

export type { ButtonVariant, ButtonSize };

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: ReactNode;
  asChild?: boolean;
};

function buttonClasses(
  variant: ButtonVariant | undefined,
  size: ButtonSize | undefined,
  disabled: boolean | undefined,
  className: string | undefined
): string {
  const state = disabled ? "pointer-events-none opacity-50" : "";
  if ((variant ?? "").trim() === "unstyled") {
    return cn(state, className);
  }
  return cn(
    composeRecipe(buttonRecipe as VariantRecipe, { variant: variant ?? "", size: size ?? "" }),
    state,
    className
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, type, disabled, className, children, asChild, ...rest },
  ref
) {
  const cls = buttonClasses(variant, size, disabled, className);

  if (asChild) {
    return (
      <Slot ref={ref} className={cls} type={defaultButtonType(type)} disabled={disabled} {...rest}>
        {children}
      </Slot>
    );
  }

  return (
    <button
      ref={ref}
      type={defaultButtonType(type)}
      className={cls}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";
