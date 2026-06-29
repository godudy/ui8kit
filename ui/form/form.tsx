import { forwardRef, type FormHTMLAttributes, type HTMLAttributes } from "react";
import formRecipe from "./form.variants.json";
import formItemRecipe from "./form-item.variants.json";
import formDescriptionRecipe from "./form-description.variants.json";
import formMessageRecipe from "./form-message.variants.json";
import { composeRecipe } from "../../utils";

export type FormProps = FormHTMLAttributes<HTMLFormElement>;
export type FormItemProps = HTMLAttributes<HTMLDivElement>;
export type FormDescriptionProps = HTMLAttributes<HTMLParagraphElement>;
export type FormMessageProps = HTMLAttributes<HTMLParagraphElement>;

export const Form = forwardRef<HTMLFormElement, FormProps>(function Form(
  { className, children, ...rest },
  ref
) {
  return (
    <form ref={ref} className={composeRecipe(formRecipe, {}, className)} {...rest}>
      {children}
    </form>
  );
});
Form.displayName = "Form";

export const FormItem = forwardRef<HTMLDivElement, FormItemProps>(function FormItem(
  { className, children, ...rest },
  ref
) {
  return (
    <div ref={ref} className={composeRecipe(formItemRecipe, {}, className)} {...rest}>
      {children}
    </div>
  );
});
FormItem.displayName = "FormItem";

export const FormDescription = forwardRef<HTMLParagraphElement, FormDescriptionProps>(
  function FormDescription({ className, children, ...rest }, ref) {
    return (
      <p ref={ref} className={composeRecipe(formDescriptionRecipe, {}, className)} {...rest}>
        {children}
      </p>
    );
  }
);
FormDescription.displayName = "FormDescription";

export const FormMessage = forwardRef<HTMLParagraphElement, FormMessageProps>(
  function FormMessage({ className, children, ...rest }, ref) {
    return (
      <p
        ref={ref}
        role="alert"
        className={composeRecipe(formMessageRecipe, {}, className)}
        {...rest}
      >
        {children}
      </p>
    );
  }
);
FormMessage.displayName = "FormMessage";
