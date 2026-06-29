import { forwardRef, type FieldsetHTMLAttributes, type HTMLAttributes, type MeterHTMLAttributes, type OptionHTMLAttributes, type OutputHTMLAttributes, type ProgressHTMLAttributes } from "react";
import fieldsetRecipeJson from "./fieldset.variants.json";
import legendRecipeJson from "./legend.variants.json";
import meterRecipeJson from "./meter.variants.json";
import progressRecipeJson from "./progress.variants.json";
import { composeRecipe, defineRecipe } from "../../utils";

const { recipe: fieldsetRecipe, keys: fieldsetKeys } = defineRecipe(fieldsetRecipeJson);
const { recipe: legendRecipe, keys: legendKeys } = defineRecipe(legendRecipeJson);
const { recipe: meterRecipe, keys: meterKeys } = defineRecipe(meterRecipeJson);
const { recipe: progressRecipe, keys: progressKeys } = defineRecipe(progressRecipeJson);

type FieldsetVariant = typeof fieldsetKeys.variant;
type FieldsetSize = typeof fieldsetKeys.size;
type LegendVariant = typeof legendKeys.variant;
type LegendSize = typeof legendKeys.size;
type MeterVariant = typeof meterKeys.variant;
type MeterSize = typeof meterKeys.size;
type ProgressVariant = typeof progressKeys.variant;
type ProgressSize = typeof progressKeys.size;

export type FieldsetProps = FieldsetHTMLAttributes<HTMLFieldSetElement> & {
  variant?: FieldsetVariant;
  size?: FieldsetSize;
};

export type LegendProps = HTMLAttributes<HTMLLegendElement> & {
  variant?: LegendVariant;
  size?: LegendSize;
};

export type DataListProps = HTMLAttributes<HTMLDataListElement>;
export type DataOptionProps = OptionHTMLAttributes<HTMLOptionElement>;

export type OutputProps = OutputHTMLAttributes<HTMLOutputElement> & {
  value?: string;
};

export type MeterProps = MeterHTMLAttributes<HTMLMeterElement> & {
  variant?: MeterVariant;
  size?: MeterSize;
};

export type ProgressProps = ProgressHTMLAttributes<HTMLProgressElement> & {
  variant?: ProgressVariant;
  size?: ProgressSize;
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
        { variant, size },
        className
      )}
      {...rest}
    >
      {children}
    </fieldset>
  );
});
Fieldset.displayName = "Fieldset";

export const Legend = forwardRef<HTMLLegendElement, LegendProps>(function Legend(
  { variant, size, className, children, ...rest },
  ref
) {
  return (
    <legend
      ref={ref}
      className={composeRecipe(legendRecipe, { variant, size }, className)}
      {...rest}
    >
      {children}
    </legend>
  );
});
Legend.displayName = "Legend";

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
DataList.displayName = "DataList";

export const DataOption = forwardRef<HTMLOptionElement, DataOptionProps>(function DataOption(
  { value, label, ...rest },
  ref
) {
  return <option ref={ref} value={value} label={label} {...rest} />;
});
DataOption.displayName = "DataOption";

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
Output.displayName = "Output";

export const Meter = forwardRef<HTMLMeterElement, MeterProps>(function Meter(
  { variant, size, className, children, ...rest },
  ref
) {
  return (
    <meter
      ref={ref}
      className={composeRecipe(meterRecipe, { variant, size }, className)}
      {...rest}
    >
      {children}
    </meter>
  );
});
Meter.displayName = "Meter";

export const Progress = forwardRef<HTMLProgressElement, ProgressProps>(function Progress(
  { variant, size, className, children, ...rest },
  ref
) {
  return (
    <progress
      ref={ref}
      className={composeRecipe(
        progressRecipe,
        { variant, size },
        className
      )}
      {...rest}
    >
      {children}
    </progress>
  );
});
Progress.displayName = "Progress";
