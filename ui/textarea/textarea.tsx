import { forwardRef, type TextareaHTMLAttributes } from "react";
import textareaRecipe from "./textarea.variants.json";
import { composeRecipe, type RecipeKey, type VariantRecipe } from "../../utils";
import { textareaRows } from "../../utils/attrs";

type TextareaVariant = RecipeKey<typeof textareaRecipe, "variant">;
type TextareaSize = RecipeKey<typeof textareaRecipe, "size">;

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
        textareaRecipe as VariantRecipe,
        { variant: variant ?? "", size: size ?? "" },
        className
      )}
      {...rest}
    />
  );
});
Textarea.displayName = "Textarea";
