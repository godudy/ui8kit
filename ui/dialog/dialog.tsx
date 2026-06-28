import { forwardRef, type DialogHTMLAttributes } from "react";
import dialogRecipe from "./dialog.variants.json";
import { composeRecipe } from "../../utils/variants";
import { mergeAttrs } from "../../utils/attrs";

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
  const attrs = mergeAttrs(rest as Record<string, string>);
  if (id?.trim()) attrs.id = id.trim();
  if (dataUI8Kit?.trim()) attrs["data-ui8kit"] = dataUI8Kit.trim();
  if (ariaLabel?.trim()) attrs["aria-label"] = ariaLabel.trim();
  if (ariaLabelledBy?.trim()) attrs["aria-labelledby"] = ariaLabelledBy.trim();
  if (ariaDescribedBy?.trim()) attrs["aria-describedby"] = ariaDescribedBy.trim();

  return (
    <dialog
      ref={ref}
      open={open}
      className={composeRecipe(
        dialogRecipe,
        { variant: variant ?? "", size: size ?? "" },
        className
      )}
      {...attrs}
    >
      {children}
    </dialog>
  );
});
