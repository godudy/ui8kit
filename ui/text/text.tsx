import { forwardRef, type ElementType, type HTMLAttributes, type Ref } from "react";
import textRecipe from "./text.variants.json";
import { composeRecipe } from "../../utils/variants";
import { resolveTag, TagGroup } from "../../utils/tags";

export type TextProps = HTMLAttributes<HTMLElement> & {
  tag?: string;
};

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { tag, className, children, ...rest },
  ref
) {
  const Tag = resolveTag(tag, "p", TagGroup.Text) as ElementType;
  return (
    <Tag ref={ref as Ref<HTMLElement>} className={composeRecipe(textRecipe, {}, className)} {...rest}>
      {children}
    </Tag>
  );
});
