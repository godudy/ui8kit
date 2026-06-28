import { forwardRef, type DetailsHTMLAttributes, type HTMLAttributes, type Ref } from "react";
import disclosureRecipe from "./disclosure.variants.json";
import summaryRecipe from "./summary.variants.json";
import { composeRecipe } from "../../utils/variants";

export type DisclosureProps = DetailsHTMLAttributes<HTMLDetailsElement> & {
  variant?: string;
  size?: string;
};

export type SummaryProps = HTMLAttributes<HTMLElement> & {
  variant?: string;
  size?: string;
};

export const Disclosure = forwardRef<HTMLDetailsElement, DisclosureProps>(function Disclosure(
  { variant, size, open, className, children, ...rest },
  ref
) {
  return (
    <details
      ref={ref}
      open={open}
      className={composeRecipe(
        disclosureRecipe,
        { variant: variant ?? "", size: size ?? "" },
        className
      )}
      {...rest}
    >
      {children}
    </details>
  );
});

export const Summary = forwardRef<HTMLElement, SummaryProps>(function Summary(
  { variant, size, className, children, ...rest },
  ref
) {
  return (
    <summary
      ref={ref as Ref<HTMLElement>}
      className={composeRecipe(summaryRecipe, { variant: variant ?? "", size: size ?? "" }, className)}
      {...rest}
    >
      {children}
    </summary>
  );
});
