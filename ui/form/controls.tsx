import { forwardRef, type FieldsetHTMLAttributes, type HTMLAttributes, type MeterHTMLAttributes, type OptionHTMLAttributes, type OutputHTMLAttributes, type ProgressHTMLAttributes } from "react";
import fieldsetRecipe from "./fieldset.variants.json";
import legendRecipe from "./legend.variants.json";
import meterRecipe from "./meter.variants.json";
import progressRecipe from "./progress.variants.json";
import { composeRecipe } from "../../utils/variants";

export type FieldsetProps = FieldsetHTMLAttributes<HTMLFieldSetElement> & {
  variant?: string;
  size?: string;
};

export type LegendProps = HTMLAttributes<HTMLLegendElement> & {
  variant?: string;
  size?: string;
};

export type DataListProps = HTMLAttributes<HTMLDataListElement>;
export type DataOptionProps = OptionHTMLAttributes<HTMLOptionElement>;

export type OutputProps = OutputHTMLAttributes<HTMLOutputElement> & {
  value?: string;
};

export type MeterProps = MeterHTMLAttributes<HTMLMeterElement> & {
  variant?: string;
  size?: string;
};

export type ProgressProps = ProgressHTMLAttributes<HTMLProgressElement> & {
  variant?: string;
  size?: string;
};

export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(function Fieldset(
  { variant, size, name, form, disabled, className, children, ...rest },
  ref
) {
  return (
    <fieldset
      ref={ref}
      className={composeRecipe(
        fieldsetRecipe,
        { variant: variant ?? "", size: size ?? "" },
        className
      )}
      name={name || undefined}
      form={form || undefined}
      disabled={disabled}
      {...rest}
    >
      {children}
    </fieldset>
  );
});

export const Legend = forwardRef<HTMLLegendElement, LegendProps>(function Legend(
  { variant, size, className, children, ...rest },
  ref
) {
  return (
    <legend
      ref={ref}
      className={composeRecipe(legendRecipe, { variant: variant ?? "", size: size ?? "" }, className)}
      {...rest}
    >
      {children}
    </legend>
  );
});

export const DataList = forwardRef<HTMLDataListElement, DataListProps>(function DataList(
  { id, className, children, ...rest },
  ref
) {
  return (
    <datalist ref={ref} id={id || undefined} className={className} {...rest}>
      {children}
    </datalist>
  );
});

export const DataOption = forwardRef<HTMLOptionElement, DataOptionProps>(function DataOption(
  { value, label, ...rest },
  ref
) {
  return <option ref={ref} value={value} label={label} {...rest} />;
});

export const Output = forwardRef<HTMLOutputElement, OutputProps>(function Output(
  { id, className, name, htmlFor, value, children, ...rest },
  ref
) {
  return (
    <output
      ref={ref}
      id={id || undefined}
      className={className}
      name={name}
      htmlFor={htmlFor || undefined}
      {...rest}
    >
      {value}
      {children}
    </output>
  );
});

export const Meter = forwardRef<HTMLMeterElement, MeterProps>(function Meter(
  { variant, size, id, className, value, min, max, low, high, optimum, children, ...rest },
  ref
) {
  return (
    <meter
      ref={ref}
      id={id || undefined}
      className={composeRecipe(meterRecipe, { variant: variant ?? "", size: size ?? "" }, className)}
      value={value}
      min={min}
      max={max}
      low={low}
      high={high}
      optimum={optimum}
      {...rest}
    >
      {children}
    </meter>
  );
});

export const Progress = forwardRef<HTMLProgressElement, ProgressProps>(function Progress(
  { variant, size, id, className, value, max, children, ...rest },
  ref
) {
  return (
    <progress
      ref={ref}
      id={id || undefined}
      className={composeRecipe(
        progressRecipe,
        { variant: variant ?? "", size: size ?? "" },
        className
      )}
      value={value}
      max={max}
      {...rest}
    >
      {children}
    </progress>
  );
});
