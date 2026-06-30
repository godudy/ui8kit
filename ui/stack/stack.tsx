import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode, type Ref } from "react";
import stackRecipe from "./stack.variants.json";
import { composeRecipe } from "../../utils";
import { resolveTag, TagGroup } from "../../utils/tags";
import { Slot } from "../slot/slot";

/**
 * Vertical flex layout. Landmarks (`aside`, `section`, `header`, `nav`) belong on
 * `Block`. `Stack` allows only `div`, `ul`, or `ol` as `tag`.
 */
export type StackProps = Omit<HTMLAttributes<HTMLElement>, "className"> & {
  tag?: string;
  className?: string;
  children?: ReactNode;
  asChild?: boolean;
};

export const Stack = forwardRef<HTMLElement, StackProps>(function Stack(
  { tag, className, children, asChild, ...rest },
  ref
) {
  const cls = composeRecipe(stackRecipe, {}, className);
  if (asChild) {
    return (
      <Slot ref={ref} className={cls} {...rest}>
        {children}
      </Slot>
    );
  }
  const Tag = resolveTag(tag, "div", TagGroup.Stack) as ElementType;
  return (
    <Tag ref={ref as Ref<HTMLElement>} className={cls} {...rest}>
      {children}
    </Tag>
  );
});
Stack.displayName = "Stack";
