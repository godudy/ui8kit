import { forwardRef, type HTMLAttributes } from "react";
import blockRecipe from "./block.variants.json";
import { composeRecipe } from "../../utils/variants";
import { domAttrs, spreadAttrs } from "../../utils/attrs";
import { LayoutTag } from "../../utils/layout-tag";
import { TagGroup } from "../../utils/tags";

export type BlockProps = HTMLAttributes<HTMLElement> & {
  tag?: string;
};

export const Block = forwardRef<HTMLElement, BlockProps>(function Block(
  { tag, id, className, children, ...rest },
  ref
) {
  const attrs = spreadAttrs(domAttrs(id, undefined, undefined, rest as Record<string, string>));
  return (
    <LayoutTag
      ref={ref}
      tag={tag}
      fallback="div"
      group={TagGroup.Layout}
      className={composeRecipe(blockRecipe, {}, className)}
      {...attrs}
    >
      {children}
    </LayoutTag>
  );
});
