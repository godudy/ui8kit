import { forwardRef, type DialogHTMLAttributes } from "react";
import dialogRecipe from "./dialog.variants.json";
import { composeRecipe } from "../../utils/variants";

export type DialogProps = DialogHTMLAttributes<HTMLDialogElement> & {
  variant?: string;
  size?: string;
  open?: boolean;
  dataUI8Kit?: string;
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
        dialogRecipe,
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
