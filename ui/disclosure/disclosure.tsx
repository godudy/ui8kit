import { forwardRef, type DetailsHTMLAttributes, type HTMLAttributes, type Ref } from "react";
import disclosureRecipeJson from "./disclosure.variants.json";
import summaryRecipeJson from "./summary.variants.json";
import { composeRecipe, defineRecipe } from "../../utils";

const { recipe: disclosureRecipe, keys: disclosureKeys } = defineRecipe(disclosureRecipeJson);
const { recipe: summaryRecipe, keys: summaryKeys } = defineRecipe(summaryRecipeJson);

type DisclosureVariant = typeof disclosureKeys.variant;
type DisclosureSize = typeof disclosureKeys.size;
type SummaryVariant = typeof summaryKeys.variant;
type SummarySize = typeof summaryKeys.size;

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
        disclosureRecipe,
        { variant, size },
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
      className={composeRecipe(summaryRecipe, { variant, size }, className)}
      {...rest}
    >
      {children}
    </summary>
  );
});
Summary.displayName = "Summary";
