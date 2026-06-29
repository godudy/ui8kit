import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode, type Ref } from "react";
import textRecipe from "./text.variants.json";
import { composeRecipe, type VariantRecipe } from "../../utils";
import { resolveTag, TagGroup } from "../../utils/tags";
import { Slot } from "../slot/slot";

export type TextProps = Omit<HTMLAttributes<HTMLElement>, "className"> & {
  tag?: string;
  className?: string;
  children?: ReactNode;
  asChild?: boolean;
};

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { tag, className, children, asChild, ...rest },
  ref
) {
  const cls = composeRecipe(textRecipe as VariantRecipe, {}, className);
  if (asChild) {
    return (
      <Slot ref={ref} className={cls} {...rest}>
        {children}
      </Slot>
    );
  }
  const Tag = resolveTag(tag, "p", TagGroup.Text) as ElementType;
  return (
    <Tag ref={ref as Ref<HTMLElement>} className={cls} {...rest}>
      {children}
    </Tag>
  );
});
Text.displayName = "Text";
