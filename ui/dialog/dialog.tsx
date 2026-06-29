import { forwardRef, type DialogHTMLAttributes } from "react";
import dialogRecipeJson from "./dialog.variants.json";
import { composeRecipe, defineRecipe, type BehaviorMode } from "../../utils";

const { recipe: dialogRecipe, keys: dialogKeys } = defineRecipe(dialogRecipeJson);

type DialogVariant = typeof dialogKeys.variant;
type DialogSize = typeof dialogKeys.size;

export type DialogProps = Omit<DialogHTMLAttributes<HTMLDialogElement>, "className"> & {
  variant?: DialogVariant;
  size?: DialogSize;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  behavior?: BehaviorMode;
  className?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
};

export const Dialog = forwardRef<HTMLDialogElement, DialogProps>(function Dialog(
  {
    variant,
    size,
    id,
    open,
    onOpenChange,
    behavior,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    className,
    children,
    onClose,
    ...rest
  },
  ref
) {
  return (
    <dialog
      ref={ref}
      id={id || undefined}
      open={open}
      className={composeRecipe(
        dialogRecipe,
        { variant, size },
        className
      )}
      data-ui8kit={behavior === "ui8kit" ? "dialog" : undefined}
      aria-label={ariaLabel?.trim() || undefined}
      aria-labelledby={ariaLabelledBy?.trim() || undefined}
      aria-describedby={ariaDescribedBy?.trim() || undefined}
      onClose={(event) => {
        onOpenChange?.(false);
        onClose?.(event);
      }}
      {...rest}
    >
      {children}
    </dialog>
  );
});
Dialog.displayName = "Dialog";
