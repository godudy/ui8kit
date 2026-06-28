import { forwardRef, type TextareaHTMLAttributes } from "react";
import textareaRecipe from "./textarea.variants.json";
import { composeRecipe } from "../../utils/variants";
import { textareaRows } from "../../utils/attrs";

export type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> & {
  variant?: string;
  size?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { variant, size, rows, className, ...rest },
  ref
) {
  return (
    <textarea
      ref={ref}
      rows={textareaRows(rows)}
      className={composeRecipe(
        textareaRecipe,
        { variant: variant ?? "", size: size ?? "" },
        className
      )}
      {...rest}
    />
  );
});
