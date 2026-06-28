import { forwardRef, type OptionHTMLAttributes, type SelectHTMLAttributes } from "react";
import selectRecipe from "./select.variants.json";
import { composeRecipe } from "../../utils/variants";
import { controlAttrs, spreadAttrs } from "../../utils/attrs";

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  variant?: string;
  size?: string;
  options?: SelectOption[];
  role?: string;
  tabIndex?: string;
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
    id,
    role,
    tabIndex,
    "aria-label": ariaLabel,
    className,
    children,
    ...rest
  },
  ref
) {
  return (
    <select
      ref={ref}
      id={id || undefined}
      value={value}
      className={composeRecipe(
        selectRecipe,
        { variant: variant ?? "", size: size ?? "" },
        className
      )}
      {...spreadAttrs(controlAttrs(id, role, tabIndex, ariaLabel, rest as Record<string, string>))}
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

export const SelectOption = forwardRef<HTMLOptionElement, SelectOptionProps>(
  function SelectOption({ value, label, selected, disabled, children, ...rest }, ref) {
    return (
      <option ref={ref} value={value} label={label} selected={selected} disabled={disabled} {...rest}>
        {children}
      </option>
    );
  }
);

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
