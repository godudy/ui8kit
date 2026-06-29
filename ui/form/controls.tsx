import { forwardRef, type FieldsetHTMLAttributes, type HTMLAttributes, type MeterHTMLAttributes, type OptionHTMLAttributes, type OutputHTMLAttributes, type ProgressHTMLAttributes } from "react";
import fieldsetRecipe from "./fieldset.variants.json";
import legendRecipe from "./legend.variants.json";
import meterRecipe from "./meter.variants.json";
import progressRecipe from "./progress.variants.json";
import { composeRecipe, type RecipeKey, type VariantRecipe } from "../../utils";

type FieldsetVariant = RecipeKey<typeof fieldsetRecipe, "variant">;
type FieldsetSize = RecipeKey<typeof fieldsetRecipe, "size">;
type LegendVariant = RecipeKey<typeof legendRecipe, "variant">;
type LegendSize = RecipeKey<typeof legendRecipe, "size">;
type MeterVariant = RecipeKey<typeof meterRecipe, "variant">;
type MeterSize = RecipeKey<typeof meterRecipe, "size">;
type ProgressVariant = RecipeKey<typeof progressRecipe, "variant">;
type ProgressSize = RecipeKey<typeof progressRecipe, "size">;

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
        fieldsetRecipe as VariantRecipe,
        { variant: variant ?? "", size: size ?? "" },
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
      className={composeRecipe(legendRecipe as VariantRecipe, { variant: variant ?? "", size: size ?? "" }, className)}
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
      className={composeRecipe(meterRecipe as VariantRecipe, { variant: variant ?? "", size: size ?? "" }, className)}
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
        progressRecipe as VariantRecipe,
        { variant: variant ?? "", size: size ?? "" },
        className
      )}
      {...rest}
    >
      {children}
    </progress>
  );
});
Progress.displayName = "Progress";
