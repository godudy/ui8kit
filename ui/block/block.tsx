import { forwardRef, type ElementType, type HTMLAttributes, type Ref } from "react";
import blockRecipe from "./block.variants.json";
import { composeRecipe } from "../../utils/variants";
import { resolveTag, TagGroup } from "../../utils/tags";

export type BlockProps = HTMLAttributes<HTMLElement> & {
  tag?: string;
};

export const Block = forwardRef<HTMLElement, BlockProps>(function Block(
  { tag, id, className, children, ...rest },
  ref
) {
  const Tag = resolveTag(tag, "div", TagGroup.Layout) as ElementType;
  return (
    <Tag
      ref={ref as Ref<HTMLElement>}
      id={id || undefined}
      className={composeRecipe(blockRecipe, {}, className)}
      {...rest}
    >
      {children}
    </Tag>
  );
});
