import { forwardRef, type HTMLAttributes } from "react";
import textRecipe from "./text.variants.json";
import { composeRecipe } from "../../utils/variants";
import { LayoutTag } from "../../utils/layout-tag";
import { TagGroup } from "../../utils/tags";

export type TextProps = HTMLAttributes<HTMLElement> & {
  tag?: string;
};

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { tag, className, children, ...rest },
  ref
) {
  return (
    <LayoutTag
      ref={ref}
      tag={tag}
      fallback="p"
      group={TagGroup.Text}
      className={composeRecipe(textRecipe, {}, className)}
      {...rest}
    >
      {children}
    </LayoutTag>
  );
});
