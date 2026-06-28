import {
  forwardRef,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { resolveTag, type TagGroup } from "./tags";

type LayoutTagProps = HTMLAttributes<HTMLElement> & {
  tag?: string;
  fallback: string;
  group: TagGroup;
  className?: string;
  children?: ReactNode;
};

/** Renders a resolved semantic layout tag with forwarded ref. */
export const LayoutTag = forwardRef<HTMLElement, LayoutTagProps>(
  function LayoutTag({ tag, fallback, group, className, children, ...rest }, ref) {
    const Tag = resolveTag(tag, fallback, group) as ElementType;
    return (
      <Tag ref={ref as never} className={className} {...rest}>
        {children}
      </Tag>
    );
  }
);
