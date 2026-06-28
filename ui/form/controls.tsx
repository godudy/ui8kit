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
  { variant, size, className, children, ...rest },
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
  { className, children, ...rest },
  ref
) {
  return (
    <datalist ref={ref} className={className} {...rest}>
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
  { className, value, children, ...rest },
  ref
) {
  return (
    <output
      ref={ref}
      className={className}
      {...rest}
    >
      {value}
      {children}
    </output>
  );
});

export const Meter = forwardRef<HTMLMeterElement, MeterProps>(function Meter(
  { variant, size, className, children, ...rest },
  ref
) {
  return (
    <meter
      ref={ref}
      className={composeRecipe(meterRecipe, { variant: variant ?? "", size: size ?? "" }, className)}
      {...rest}
    >
      {children}
    </meter>
  );
});

export const Progress = forwardRef<HTMLProgressElement, ProgressProps>(function Progress(
  { variant, size, className, children, ...rest },
  ref
) {
  return (
    <progress
      ref={ref}
      className={composeRecipe(
        progressRecipe,
        { variant: variant ?? "", size: size ?? "" },
        className
      )}
      {...rest}
    >
      {children}
    </progress>
  );
});
