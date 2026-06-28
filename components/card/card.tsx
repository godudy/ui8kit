import { forwardRef, type ElementType, type HTMLAttributes, type Ref } from "react";
import cardRecipe from "./card.variants.json";
import { cn, composeRecipe } from "../../utils";
import { titleTag } from "../../utils/attrs";
import { resolveTag, TagGroup } from "../../utils/tags";

export type CardProps = HTMLAttributes<HTMLElement> & {
  variant?: string;
  tag?: string;
};

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>;
export type CardContentProps = HTMLAttributes<HTMLDivElement>;
export type CardFooterProps = HTMLAttributes<HTMLDivElement>;

export type CardTitleProps = HTMLAttributes<HTMLHeadingElement> & {
  order?: number;
};

export type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { variant, tag, className, children, ...rest },
  ref
) {
  const Tag = resolveTag(tag, "div", TagGroup.Layout) as ElementType;
  return (
    <Tag
      ref={ref as Ref<HTMLElement>}
      className={composeRecipe(cardRecipe, { variant: variant ?? "" }, className)}
      {...rest}
    >
      {children}
    </Tag>
  );
});

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  function CardHeader(
  { className, children, ...rest },
  ref
) {
  return (
    <div ref={ref} className={cn("border-b border-border px-4 py-2", className)} {...rest}>
      {children}
    </div>
  );
});

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle(
  { order, className, children, ...rest },
  ref
) {
  const Tag = titleTag(order) as ElementType;
  return (
    <Tag
      ref={ref as Ref<HTMLHeadingElement>}
      className={cn("text-sm font-semibold", className)}
      {...rest}
    >
      {children}
    </Tag>
  );
});

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  function CardDescription({ className, children, ...rest }, ref) {
    return (
      <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...rest}>
        {children}
      </p>
    );
  }
);

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(function CardContent(
  { className, children, ...rest },
  ref
) {
  return (
    <div ref={ref} className={cn("p-4", className)} {...rest}>
      {children}
    </div>
  );
});

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter(
  { className, children, ...rest },
  ref
) {
  return (
    <div ref={ref} className={cn("border-t border-border px-4 py-3", className)} {...rest}>
      {children}
    </div>
  );
});
