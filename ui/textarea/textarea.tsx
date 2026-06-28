import { forwardRef, type TextareaHTMLAttributes } from "react";
import textareaRecipe from "./textarea.variants.json";
import { composeRecipe } from "../../utils/variants";
import { controlAttrs, textareaRows, spreadAttrs } from "../../utils/attrs";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  variant?: string;
  size?: string;
  role?: string;
  tabIndex?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    variant,
    size,
    id,
    role,
    tabIndex,
    "aria-label": ariaLabel,
    rows,
    className,
    value,
    children,
    ...rest
  },
  ref
) {
  return (
    <textarea
      ref={ref}
      id={id || undefined}
      rows={textareaRows(rows)}
      className={composeRecipe(
        textareaRecipe,
        { variant: variant ?? "", size: size ?? "" },
        className
      )}
      value={value}
      {...spreadAttrs(controlAttrs(id, role, tabIndex, ariaLabel, rest as Record<string, string>))}
    >
      {children}
    </textarea>
  );
});
