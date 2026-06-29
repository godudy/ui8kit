import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode, type Ref } from "react";
import blockRecipe from "./block.variants.json";
import { composeRecipe, type VariantRecipe } from "../../utils";
import { resolveTag, TagGroup } from "../../utils/tags";
import { Slot } from "../slot/slot";

export type BlockProps = Omit<HTMLAttributes<HTMLElement>, "className"> & {
  tag?: string;
  className?: string;
  children?: ReactNode;
  asChild?: boolean;
};

export const Block = forwardRef<HTMLElement, BlockProps>(function Block(
  { tag, id, className, children, asChild, ...rest },
  ref
) {
  const cls = composeRecipe(blockRecipe as VariantRecipe, {}, className);
  if (asChild) {
    return (
      <Slot ref={ref} id={id || undefined} className={cls} {...rest}>
        {children}
      </Slot>
    );
  }
  const Tag = resolveTag(tag, "div", TagGroup.Layout) as ElementType;
  return (
    <Tag
      ref={ref as Ref<HTMLElement>}
      id={id || undefined}
      className={cls}
      {...rest}
    >
      {children}
    </Tag>
  );
});
Block.displayName = "Block";
