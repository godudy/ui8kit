import { forwardRef, type DialogHTMLAttributes } from "react";
import dialogRecipe from "./dialog.variants.json";
import { composeRecipe, type RecipeKey, type VariantRecipe } from "../../utils";

type DialogVariant = RecipeKey<typeof dialogRecipe, "variant">;
type DialogSize = RecipeKey<typeof dialogRecipe, "size">;

export type DialogProps = Omit<DialogHTMLAttributes<HTMLDialogElement>, "className"> & {
  variant?: DialogVariant;
  size?: DialogSize;
  open?: boolean;
  dataUI8Kit?: string;
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
    dataUI8Kit,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    className,
    children,
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
        dialogRecipe as VariantRecipe,
        { variant: variant ?? "", size: size ?? "" },
        className
      )}
      data-ui8kit={dataUI8Kit?.trim() || undefined}
      aria-label={ariaLabel?.trim() || undefined}
      aria-labelledby={ariaLabelledBy?.trim() || undefined}
      aria-describedby={ariaDescribedBy?.trim() || undefined}
      {...rest}
    >
      {children}
    </dialog>
  );
});
Dialog.displayName = "Dialog";
