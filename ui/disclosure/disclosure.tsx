import { forwardRef, type DetailsHTMLAttributes, type HTMLAttributes, type Ref } from "react";
import disclosureRecipe from "./disclosure.variants.json";
import summaryRecipe from "./summary.variants.json";
import { composeRecipe, type RecipeKey, type VariantRecipe } from "../../utils";

type DisclosureVariant = RecipeKey<typeof disclosureRecipe, "variant">;
type DisclosureSize = RecipeKey<typeof disclosureRecipe, "size">;
type SummaryVariant = RecipeKey<typeof summaryRecipe, "variant">;
type SummarySize = RecipeKey<typeof summaryRecipe, "size">;

export type DisclosureProps = Omit<DetailsHTMLAttributes<HTMLDetailsElement>, "className"> & {
  variant?: DisclosureVariant;
  size?: DisclosureSize;
  className?: string;
};

export type SummaryProps = Omit<HTMLAttributes<HTMLElement>, "className"> & {
  variant?: SummaryVariant;
  size?: SummarySize;
  className?: string;
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
        disclosureRecipe as VariantRecipe,
        { variant: variant ?? "", size: size ?? "" },
        className
      )}
      {...rest}
    >
      {children}
    </details>
  );
});
Disclosure.displayName = "Disclosure";

export const Summary = forwardRef<HTMLElement, SummaryProps>(function Summary(
  { variant, size, className, children, ...rest },
  ref
) {
  return (
    <summary
      ref={ref as Ref<HTMLElement>}
      className={composeRecipe(summaryRecipe as VariantRecipe, { variant: variant ?? "", size: size ?? "" }, className)}
      {...rest}
    >
      {children}
    </summary>
  );
});
Summary.displayName = "Summary";
