import { forwardRef, type OptionHTMLAttributes, type SelectHTMLAttributes } from "react";
import selectRecipe from "./select.variants.json";
import { composeRecipe, type RecipeKey, type VariantRecipe } from "../../utils";

type SelectVariant = RecipeKey<typeof selectRecipe, "variant">;
type SelectSize = RecipeKey<typeof selectRecipe, "size">;

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "size" | "className"> & {
  variant?: SelectVariant;
  size?: SelectSize;
  className?: string;
  options?: SelectOption[];
};

export type SelectOptionProps = OptionHTMLAttributes<HTMLOptionElement> & {
  label?: string;
};

export type OptGroupProps = OptionHTMLAttributes<HTMLOptGroupElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    variant,
    size,
    options,
    value,
    className,
    children,
    ...rest
  },
  ref
) {
  return (
    <select
      ref={ref}
      value={value}
      className={composeRecipe(
        selectRecipe as VariantRecipe,
        { variant: variant ?? "", size: size ?? "" },
        className
      )}
      {...rest}
    >
      {options?.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
      {children}
    </select>
  );
});
Select.displayName = "Select";

export const SelectOption = forwardRef<HTMLOptionElement, SelectOptionProps>(
  function SelectOption({ value, label, selected, disabled, children, ...rest }, ref) {
    return (
      <option ref={ref} value={value} label={label} selected={selected} disabled={disabled} {...rest}>
        {children}
      </option>
    );
  }
);
SelectOption.displayName = "SelectOption";

export const OptGroup = forwardRef<HTMLOptGroupElement, OptGroupProps>(function OptGroup(
  { label, disabled, className, children, ...rest },
  ref
) {
  return (
    <optgroup ref={ref} className={className} label={label} disabled={disabled} {...rest}>
      {children}
    </optgroup>
  );
});
OptGroup.displayName = "OptGroup";
