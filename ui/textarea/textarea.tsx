import { forwardRef, type TextareaHTMLAttributes } from "react";
import textareaRecipeJson from "./textarea.variants.json";
import { composeRecipe, defineRecipe } from "../../utils";
import { textareaRows } from "../../utils/attrs";

const { recipe: textareaRecipe, keys: textareaKeys } = defineRecipe(textareaRecipeJson);

type TextareaVariant = typeof textareaKeys.variant;
type TextareaSize = typeof textareaKeys.size;

export type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size" | "className"> & {
  variant?: TextareaVariant;
  size?: TextareaSize;
  className?: string;
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
        { variant, size },
        className
      )}
      {...rest}
    />
  );
});
Textarea.displayName = "Textarea";
